import * as fs from 'fs';
import {DataFormat} from './dataFormat';
export class DataHandler{
    private _data_uri:string;
    private _data_buffer:DataFormat[];
    public async load():Promise<void>{
        throw Error('unimplement');
    }
    public encode():string{
        throw Error('unimplement');
    }
    public decode(data:fs.ReadStream):fs.WriteStream{
        throw Error('unimplement');
    }
    public async upload():Promise<void>{
        throw Error('unimplement');
    }
    public async download():Promise<void>{
        throw Error('unimplement');
    }

    public append(data:DataFormat){
        this._data_buffer.push(data);
    }
    public flush(){

    }


}