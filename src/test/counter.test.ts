import * as assert from 'assert';
import * as vscode from 'vscode';
import * as path from 'path';
// import { EDBUG } from '../common/util';

describe('start counter test', async () => {
    const filePath = path.join(__dirname, 'counter-test');
    const uri = vscode.Uri.file(filePath);

    before(async () => {
        const edit = new vscode.WorkspaceEdit();
        edit.createFile(uri, { overwrite: true, ignoreIfExists: true });
        await vscode.workspace.applyEdit(edit);
    });

    it('open file counter-test', async () => {
        const textDocument = await vscode.workspace.openTextDocument(filePath);
        assert(textDocument.lineCount == 1);
        var edit = new vscode.WorkspaceEdit();
        const pos = new vscode.Position(0, 0);
        edit.insert(uri, pos, 'new line\n');
        await vscode.workspace.applyEdit(edit);
        await textDocument.save();
        assert(textDocument.lineCount == 2);
        edit = new vscode.WorkspaceEdit();
        const range = new vscode.Range(0, 0, 1, 0);
        edit.delete(uri, range);
        await vscode.workspace.applyEdit(edit);
        await textDocument.save();
        assert(textDocument.lineCount == 1);
    });

    after(async () => {
        const deleteEdit = new vscode.WorkspaceEdit();
        await deleteEdit.deleteFile(uri);
        await vscode.workspace.applyEdit(deleteEdit);
    });
});

// describe('test the order of Mocha hooks', function(){
//     before( function(){ console.log('before'); });
//     after( function(){ console.log('after'); });
//     beforeEach( function(){ console.log('beforeEach'); });
//     afterEach( function(){ console.log('afterEach'); });
//     it('test 1', function(){ console.log('1'); });
//     it('test 2', function(){ console.log('2'); });

//    });

