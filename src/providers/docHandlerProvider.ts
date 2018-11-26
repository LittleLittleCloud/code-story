import * as component from '../common/component';
import { RegisterProvider } from '../interface/registerProvider';
import * as util from '../common/util';
import * as vscode from 'vscode';
import { METHOD, TYPE, IDataFormat } from '../dataFormat';
import { METHODS } from 'http';
import { DataHandler } from '../dataHandler';

@component.Export(RegisterProvider)
@component.Singleton
export class WindowHandlerProvider {
    private _visibleTextEditors: DocHandler[] = [];
    public register() {
        const visibleTextEditors = vscode.window.visibleTextEditors;
        for (const textEditor of visibleTextEditors) {
            this._visibleTextEditors.push(new DocHandler(textEditor.document))
        }
        vscode.window.onDidChangeVisibleTextEditors((e) => {
            this.updateVisibleTextEditor(e);
        });
        vscode.workspace.onDidSaveTextDocument((d) => {
            this.saveDocument(d);
        });
    }

    private updateVisibleTextEditor(e: vscode.TextEditor[]) {
        // just save all and start from begin
        util.EDBUG('updateVisibleTextEditor ' + e.length)
        for (const editor of this._visibleTextEditors) {
            editor.save()；
        }
        //remove duplicates
        this._visibleTextEditors = []
        e = e.filter((elem, index, self) => {
            return index === self.indexOf(elem)
        })
        for (const textEditor of e) {
            this._visibleTextEditors.push(new DocHandler(textEditor.document))
        }
    }

    private saveDocument(d: vscode.TextDocument) {
        util.EDBUG('save ' + d.fileName)
        this._visibleTextEditors.find((x) => {
            return x.fileName === d.fileName；
        }).update()
    }
}

export class DocHandler {
    private _document: vscode.TextDocument;
    private _buffer: IDataFormat[] = [];
    private _lineCount: number;
    constructor(doc: vscode.TextDocument) {
        this._document = doc
        this._lineCount = doc.lineCount
    }

    public update() {
        if (this._document.lineCount === this._lineCount) {
            return
        }
        const data = <IDataFormat>{
            fileName: this._document.fileName,
            fileType: this._document.languageId,
            count: this._document.lineCount - this._lineCount,
            time: new Date().getTime()
        }
        util.EDBUG(util.ppIDataFormat(data))
        this._buffer.push(data)
        this._lineCount = this._document.lineCount
    }
    get fileName() {
        return this._document.fileName
    }

    public save() {
        this.update();
        if (this._buffer.length > 0) {
            component.get(DataHandler).append(this._buffer);
        }
        this._buffer = []
    }
}