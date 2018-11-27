import * as fs from 'fs';
import { IDataFormat } from './dataFormat';
import * as component from './common/component';
import { EDBUG } from './common/util';
import { RegisterProvider } from './interface/registerProvider';
import * as path from 'path';
import * as vscode from 'vscode';
import * as sqlite from 'sqlite3';

@component.Export(RegisterProvider)
@component.Singleton
export class DataHandler {
    private _data_uri: string;
    private _id = '.record';
    private _data_buffer: IDataFormat[] = [];
    private _flushEveryEntry = 1;
    private _db: sqlite.Database;
    public async register() {
        let recordPath = path.join(__dirname, '../', this._id);
        this._data_uri = recordPath;
        this.connect_or_create(this._data_uri);
    }

    public async connect_or_create(path: string) {
        this._db = new sqlite.Database(path, sqlite.OPEN_CREATE, (err) => {
            if (err) {
                console.error(err.message);
            }
        });
        this._db.run(
            "CREATE TABLE IF NOT EXISTS record (fileType TEXT, count INT, time INT)"
        );
    }

    get data_uri() {
        return this._data_uri;
    }

    get db(){
        return this._db;
    }
    public encode(): string {
        throw Error('unimplement');
    }
    public decode(data: fs.ReadStream): fs.WriteStream {
        throw Error('unimplement');
    }
    public async upload(): Promise<void> {
        throw Error('unimplement');
    }
    public async download(): Promise<void> {
        throw Error('unimplement');
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
                        stmt.run(item.fileType,item.count,item.time);
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