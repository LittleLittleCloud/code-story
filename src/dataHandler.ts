import * as fs from 'fs';
import { IDataFormat } from './dataFormat';
import * as component from './common/component'
import { EDBUG } from './common/util';
import { RegisterProvider } from './interface/registerProvider';
import * as path from 'path';
import * as vscode from 'vscode';
@component.Export(RegisterProvider)
@component.Singleton
export class DataHandler {
    private _data_uri: string;
    private _id = '.record';
    private _data_buffer: IDataFormat[] = [];
    private _fsStream: fs.WriteStream;
    private _flushEveryEntry = 1;
    public async register() {
        let recordPath = path.join(__dirname, '../', this._id);
        this._data_uri = recordPath;
        this._fsStream = fs.createWriteStream(recordPath, { flags: 'a' });
    }

    get data_uri() {
        return this._data_uri;
    }
    public load(): IDataFormat[] {
        let buffer: IDataFormat[] = [];
        let data = fs.readFileSync(this._data_uri, { encoding: 'utf-8' });
        const raw = data.split(/\n/);
        let re = /fileType: ([a-zA-Z]+), count: ([-0-9]+), time: ([0-9]+)/;
        raw.forEach((val, index) => {
            const m = val.match(re);
            if (m.length > 3) {
                buffer.push(
                    <IDataFormat>{
                        fileType: m[1],
                        count: Number(m[2]),
                        time: Number(m[3])
                    }
                )
            }

        })
        return buffer
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
            this._data_buffer.push(value)
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
                    this._data_buffer.forEach((item, index) => {
                        this._fsStream.write(`fileType: ${item.fileType}, count: ${item.count}, time: ${item.time}\n`, (err) => {
                            if (err) {
                                err.message = index;
                                throw err;
                            }
                        });
                    }
                    );
                }
            ).then(
                () => {
                    this._data_buffer = [];
                },
                (error) => {
                    console.log(error);
                    this._data_buffer = this._data_buffer.slice(error.message, -1);
                })
        }
    }
}