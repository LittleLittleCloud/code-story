import * as vscode from 'vscode';
import * as assert from 'assert';
import * as path from 'path';
import { DocHandler } from '../providers/docHandlerProvider';


describe('test on DocHandler', async()=>{
    const filePath = path.join(__dirname, 'counter-test');
    const uri = vscode.Uri.file(filePath);
    it('test single file',async()=>{
        const doc = await vscode.workspace.openTextDocument(filePath);
        const docHandler = new DocHandler(doc);
        assert(docHandler.lineCount===1,"file's line number should be 1");
        var edit = new vscode.WorkspaceEdit();
        const pos = new vscode.Position(0, 0);
        edit.insert(uri, pos, 'new line\n');
        await vscode.workspace.applyEdit(edit);
        assert(docHandler.lineCount===2,"file's line number should be 2");
        edit = new vscode.WorkspaceEdit();
        const range = new vscode.Range(0, 0, 1, 0);
        edit.delete(uri, range);
        await vscode.workspace.applyEdit(edit);
        assert(docHandler.lineCount===1,"file's line number should be 1");
        const deleteEdit = new vscode.WorkspaceEdit();
        await deleteEdit.deleteFile(uri);
        await vscode.workspace.applyEdit(deleteEdit);
    });
});