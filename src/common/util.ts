import * as vscode from 'vscode';
import * as component from './component';
import { IDataFormat } from '../dataFormat';
export function EDBUG(x: string ) {
    const _EDEBUG = 1;
    if (_EDEBUG == 1) {
        vscode.window.showInformationMessage(x)
    }
}

export function registerCommand(command: string, callback: (...args: any[]) => any, thisArg?: any){
    let context = component.getContext();
    let disposable = vscode.commands.registerCommand(command,callback);
    context.subscriptions.push(disposable);
}

export function ppIDataFormat(data:IDataFormat):string{
    return `fileName: ${data.fileName}, fileType: ${data.fileType}, count: ${data.count}, time: ${data.time}`;
}