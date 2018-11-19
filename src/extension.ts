'use strict';
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as component from './common/component';
import { RegisterProvider } from './interface/registerProvider';
// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export async function activate(context: vscode.ExtensionContext): Promise<void> {

    console.log('Congratulations, your extension "code-story" is now active!');
    component.bindContext(context);

    require('./initialize');
    let providers = component.getAll(RegisterProvider);
    for (const provider of providers){
        await provider.register();
    }
}

// this method is called when your extension is deactivated
export function deactivate() {
}