import * as component from './common/component';
import { RegisterProvider } from './interface/registerProvider';
import { registerCommand, EDBUG, ppIDataFormat } from './common/util';
import { DataHandler } from './dataHandler';
import * as sqlite from 'sqlite3';
import * as vscode from 'vscode';
import { IRequestParam, sendRequest } from './common/webRequest';
@component.Export(RegisterProvider)
@component.Singleton
export class RecordHandler{
    private _dataHandler;
    public async register(){
        registerCommand('codeStory.showReport',async () =>{
            await this.showReport();
        });
        registerCommand('codeStory.showReportHTML', async () =>{
            await this.showHTMLReport();
        });
        registerCommand('codeStory.showDetailReport', async () =>{
            await this.showDetailedReport();
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

    public async showHTMLReport(){
        const param: IRequestParam ={
            endpoint:'localhost',
            method:'GET',
            port:23333,
            path:'/report/basicReport'
        };
        try{
            const html: string = await sendRequest(param);
            const panel = vscode.window.createWebviewPanel(
                'Report',
                'Report',
                vscode.ViewColumn.One,
                {
                    enableScripts:true
                }
            );
            panel.webview.html = html;
        } catch(e){
            await vscode.window.showErrorMessage(e);
        }
    }

    public async showDetailedReport(){
        const param: IRequestParam ={
            endpoint:'localhost',
            method:'GET',
            port:23333,
            path:'/report/detailReport'
        };
        try{
            const html: string = await sendRequest(param);
            const panel = vscode.window.createWebviewPanel(
                'Report',
                'Report',
                vscode.ViewColumn.One,
                {
                    enableScripts:true,
                }
            );
            panel.webview.html = html;
        } catch(e){
            await vscode.window.showErrorMessage(e);
        }
    }
}