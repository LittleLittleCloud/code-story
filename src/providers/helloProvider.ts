import * as component from '../common/component';
import { RegisterProvider } from '../interface/registerProvider';
import * as util from '../common/util';
import * as vscode from 'vscode';

@component.Export(RegisterProvider)
@component.Singleton
export class SayHello{
    public register(){
        util.EDBUG('hello')
        util.registerCommand('extension.sayHello',async () => {
            vscode.window.showInformationMessage('hello world');
        })
    }
}