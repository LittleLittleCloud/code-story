import * as component from './common/component';
import { RegisterProvider } from './interface/registerProvider';
import { registerCommand, EDBUG, ppIDataFormat } from './common/util';
import { DataHandler } from './dataHandler';

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
        let buf = this._dataHandler.load();
        for (const entry of buf){
            console.log(ppIDataFormat(entry));
        }
    }
}