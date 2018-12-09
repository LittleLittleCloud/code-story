import * as component from './common/component';
import { RegisterProvider } from './interface/registerProvider';
import { registerCommand, EDBUG, ppIDataFormat } from './common/util';
import { DataHandler } from './dataHandler';
import * as sqlite from 'sqlite3';
import * as vscode from 'vscode';
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

    public async unregister(){
        //pass
    }

    public async showReport(){
        let db:sqlite.Database = this._dataHandler.db;
        let langIds:string[]=[];
        langIds = await new Promise<string[]>((resolve,reject)=>{
            var res = [];
            db.all("select filetype from record group by filetype",(err,rows)=>{
                if(err){
                    vscode.window.showErrorMessage(err.message);
                    reject(err);
                }else{
                    rows.forEach((row)=>{
                        res.push(row.fileType);
                    });
                    resolve(res);
                }
            });
        });
        
        let langId = await vscode.window.showQuickPick(langIds,{canPickMany:false});

        db.get(`select sum(count) as res from record where filetype = '${langId}'`,(err,sum)=>{
            if (err){
                console.error(err);
            }else{
                vscode.window.showInformationMessage(`you write ${sum.res} lines of ${langId}`);
            }
        });
    }
}