import * as vscode from 'vscode';
import * as component from '../common/component';
import { RegisterProvider } from '../interface/registerProvider';
import { registerCommand } from '../common/util';
import { WindowHandlerProvider } from './docHandlerProvider';


@component.Export(RegisterProvider)
@component.Singleton
export class StatusProvider{
    private _statusBar: vscode.StatusBarItem;
    private _status: number;
    public async register(){
        registerCommand('codeStory.controlButton', async ()=>{
            if (this._status>=1){
                this._status=0;
                this.start();
            }else{
                this._status=1;
                this.start();
            }
        });
        this._statusBar=vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left,20);
        this._statusBar.command='codeStory.controlButton';

        component.getContext().subscriptions.push(this._statusBar);        
        this._status=1;

        this.start();
    }

    public async unregister(){
        //pass
    }

    get status(){
        return this._status;
    }

    set statue(s: number){
        this._status=s;
    }

    public start(status?:number){
        if(status!==undefined){
            this._status=status;
        }
        switch (this._status){
            case 1: {
                this._statusBar.text= 'code-story :  $(primitive-dot)  start recording';
                component.get(WindowHandlerProvider).register();
                break;
            }
            case 0: {
                this._statusBar.text= 'code-story :  $(triangle-right)  stop recording';
                component.get(WindowHandlerProvider).unregister();
                break;
            }
            case 2: {
                this._statusBar.text+=' uploading...';
                break;
            }
            case 3: {
                this._statusBar.text+= ' downloading...';
                break;
            }
        }
        this._statusBar.show();
    }
}