import * as component from './common/component';
import { RegisterProvider } from './interface/registerProvider';
import { registerCommand, EDBUG, ppIDataFormat } from './common/util';
import { DataHandler } from './dataHandler';
import * as sqlite from 'sqlite3';
@component.Export(RegisterProvider)
@component.Singleton
export class RecordHandler{
    private _dataHandler;
    public async register(){
        registerCommand('codeStory.showReport',async () =>{
            await this.showReport();
        });
        this._dataHandler = component.get(DataHandler);
    }

    public async showReport(){
        let db:sqlite.Database = this._dataHandler.db;
        db.run("select sum(count) from record where filetype = typescript",(sum,err)=>{
            if (err){
                console.error(err);
            }else{
                EDBUG(`you write ${sum} lines of typecript`);
            }
        });
    }
}