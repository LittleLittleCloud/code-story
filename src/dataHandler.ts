import * as fs from 'fs';
import {IDataFormat} from './dataFormat';
import * as component from './common/component'
import { EDBUG } from './common/util';

@component.Singleton
export class DataHandler{
    private _data_uri:string;
    private _data_buffer:IDataFormat[]=[];
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

    public append(data:IDataFormat[]){
        EDBUG('dataHandler save '+data.length+' data')
        this._data_buffer.push.apply(data);
    }

    public flush(){

    }


}