import * as vscode from 'vscode';
import {DataHandler} from './dataHandler';
export class LineCounter{
    private _document:vscode.TextDocument;
    private _dataHandler:DataHandler;
    public async update():Promise<void>{
        throw Error('unimplement');
    }
    
    public async onDocumentChange()
}