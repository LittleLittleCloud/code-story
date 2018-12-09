import * as fs from 'fs';
import { IDataFormat } from './dataFormat';
import * as component from './common/component';
import { EDBUG, registerCommand, withProgress } from './common/util';
import { RegisterProvider } from './interface/registerProvider';
import * as path from 'path';
import * as vscode from 'vscode';
import * as sqlite from 'sqlite3';
import { GoogleDriveProvider } from './providers/googleDriveProvider';
import { StatusProvider } from './providers/statusProvider';

@component.Export(RegisterProvider)
@component.Singleton
export class DataHandler {
    private _local_data_uri: string;
    private _remote_data_uri: string;
    private _id = '.record.db';
    private _data_buffer: IDataFormat[] = [];
    private _flushEveryEntry = 1;
    private _db: sqlite.Database;
    public async register() {
        let extensionPath = component.getContext().extensionPath;
        EDBUG(extensionPath);
        if (!fs.existsSync(path.join(extensionPath, 'record'))) {
            fs.mkdirSync(path.join(extensionPath, 'record'));
        }
        if (!fs.existsSync(path.join(extensionPath, 'record', 'local'))) {
            fs.mkdirSync(path.join(extensionPath, 'record', 'local'));
        }
        let recordPath = path.join(extensionPath, 'record', 'local', this._id);
        this._local_data_uri = recordPath;
        this._remote_data_uri = recordPath + '.remote';
        this.connect_or_create(this._local_data_uri);
        registerCommand('codeStory.upload',async () =>{
            this.upload();
        });
        registerCommand('codeStory.download',async ()=>{
            this.download();
        });
    }

    public async unregister() {
        this._db.close();
    }

    public async connect_or_create(path: string) {
        this._db = new sqlite.Database(path, (err) => {
            if (err) {
                console.error(err.message);
            }
        });
        this._db.run(
            "CREATE TABLE IF NOT EXISTS record (fileType TEXT, count INT, time INT PRIMARY KEY)"
        );
    }

    get data_uri() {
        return this._local_data_uri;
    }

    get db() {
        return this._db;
    }
    public encode(): string {
        throw Error('unimplement');
    }
    public decode(data: fs.ReadStream): fs.WriteStream {
        throw Error('unimplement');
    }
    public async upload(): Promise<void> {
        const platform = <string>vscode.workspace.getConfiguration('codeStory').get('syncPlatform');
        if (platform === 'GoogleDrive') {
            await withProgress('uploading ... ',()=>component.get(GoogleDriveProvider).upload(this._local_data_uri));
        } else {
            throw Error('unimplement');
        }
    }
    public async download(): Promise<void> {
        const platform = <string>vscode.workspace.getConfiguration('codeStory').get('codeStory.syncPlatform');
        const status = component.get(StatusProvider).status;
        if (platform === 'GoogleDrive') {
            await component.get(GoogleDriveProvider).download(this._id,this._remote_data_uri);
        } else {
            throw Error('unimplement');
        }
    }

    public async append(data: IDataFormat[]) {
        EDBUG('dataHandler save ' + data.length + ' data');
        data.forEach((value, index) => {
            this._data_buffer.push(value);
        });
        await this.flush();
    }

    public async flush() {
        if (this._flushEveryEntry < this._data_buffer.length) {
            EDBUG('flush ');
            await vscode.window.withProgress(
                { location: vscode.ProgressLocation.Window },
                async (progress) => {
                    progress.report({ message: `code-story: sync...` });
                    const stmt = this._db.prepare("INSERT INTO record VALUES (?,?,?)");
                    this._data_buffer.forEach((item, index) => {
                        stmt.run(item.fileType, item.count, item.time);
                    }
                    );
                    stmt.finalize();
                }
            ).then(
                () => {
                    this._data_buffer = [];
                },
                (error) => {
                    console.log(error);
                    this._data_buffer = this._data_buffer.slice(error.message, -1);
                });
        }
    }
}