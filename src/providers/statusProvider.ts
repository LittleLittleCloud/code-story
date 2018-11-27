import * as vscode from 'vscode';
import * as component from '../common/component';
import { RegisterProvider } from '../interface/registerProvider';
import { registerCommand } from '../common/util';


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
        this._statusBar=vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left,100);
        this._statusBar.command='codeStory.controlButton';

        component.getContext().subscriptions.push(this._statusBar);        
        this._status=1;

        this.start();
    }

    get status(){
        return this._status;
    }

    set statue(s: number){
        this._status=s;
    }

    public start(){
        switch (this._status){
            case 1: {
                this._statusBar.text= 'code-story: $(primitive-dot) start recording';
                break;
            }
            case 0: {
                this._statusBar.text= 'code-story: $(primitive-square) stop recording';
                break;
            }
        }
        this._statusBar.show();
    }
}