import * as vscode from 'vscode';
import * as component from './component';
import { IDataFormat } from '../dataFormat';
let _EDEBUG = 0;
export function EDBUG(x: string ) {
    if (_EDEBUG === 1) {
        vscode.window.showInformationMessage(x);
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

export async function withProgress<T>(msg: string, func: () => T | Promise<T>): Promise<T> {
    return await vscode.window.withProgress<T>(
        { location: vscode.ProgressLocation.Window },
        async (progress: vscode.Progress<{ message?: string }>) => {
            progress.report({ message: `code story: ${msg}` });

            return await func();
        }
    );
}