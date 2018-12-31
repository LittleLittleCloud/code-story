import * as fs from 'fs';
import { IDataFormat } from './dataFormat';
import * as component from './common/component';
import { EDBUG, registerCommand, withProgress } from './common/util';
import { RegisterProvider } from './interface/registerProvider';
import * as path from 'path';
import * as vscode from 'vscode';
import * as sqlite from 'sqlite3';
import { GoogleDriveProvider } from './providers/googleDriveProvider';

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
        let extensionPath = path.join(process.env.HOMEDRIVE,process.env.HOMEPATH,'.code-story');
        if(!fs.existsSync(extensionPath)){
            fs.mkdirSync(extensionPath);
        }
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
            this.download_merge();
        });
        registerCommand('codeStory.sync',async()=>{
            this.sync();
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
    public async upload(): Promise<void> {
        const platform = <string>vscode.workspace.getConfiguration('codeStory').get('syncPlatform');
        if (platform === 'GoogleDrive') {
            await withProgress('uploading ... ',()=>component.get(GoogleDriveProvider).upload(this._local_data_uri));
        } else {
            throw Error('unimplement');
        }
    }
    public async download_merge(): Promise<void> {
        const platform = <string>vscode.workspace.getConfiguration('codeStory').get('syncPlatform');
        if (platform === 'GoogleDrive') {
            await withProgress('downloading ... ',async ()=> await component.get(GoogleDriveProvider).download(this._remote_data_uri));
            await withProgress('merging ...',async ()=>{
                const newDB = new sqlite.Database(this._remote_data_uri,sqlite.OPEN_READONLY,(err)=>{
                    if(err){
                        vscode.window.showErrorMessage(err.message);
                        return;
                    }
                });
                const newRecords = await new Promise<IDataFormat[]>((resolve,reject)=>{
                    var res = [];
                    newDB.all("select * from record",(err,rows)=>{
                        if(err){
                            vscode.window.showErrorMessage(err.message);
                            reject(err);
                        }else{
                            rows.forEach((row)=>{
                                res.push(<IDataFormat>{
                                    fileType:row.fileType,
                                    count:row.count,
                                    time:row.time
                                });
                            });
                            resolve(res);
                        }
                    });
                });
                await this.append(newRecords);
            });
        } else {
            throw Error('unimplement');
        }
    }

    public async sync(){
        await this.download_merge();
        await this.upload();
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
                    const stmt = this._db.prepare("INSERT OR REPLACE INTO record VALUES (?,?,?)");
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
                    vscode.window.showErrorMessage(error);
                    this._data_buffer = this._data_buffer.slice(error.message, -1);
                });
        }
    }
}