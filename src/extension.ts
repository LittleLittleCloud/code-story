'use strict';
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as component from './common/component';
import { RegisterProvider } from './interface/registerProvider';
import { StatusProvider } from './providers/statusProvider';
import { RecordHandler } from './recordHandler';
import { DataHandler } from './dataHandler';
import { GoogleDriveProvider } from './providers/googleDriveProvider';
import { EDBUG } from './common/util';
import { TotalSumProvider } from './providers/totalSumProvider';
import { SumPerDayProvider } from './providers/sumPerDayProvider';
import { LangPieChartProvider } from './providers/langPieChartProvider';
// import { LocalServerProvider } from './providers/localServerProvider';
// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export async function activate(context: vscode.ExtensionContext): Promise<void> {
    console.log('Congratulations, your extension "code-story" is now active!');
    component.bindContext(context);

    require('./initialize');
    component.get(StatusProvider).register();
    component.get(DataHandler).register();
    component.get(RecordHandler).register();
    component.get(GoogleDriveProvider).register();
    component.get(TotalSumProvider).register();
    component.get(SumPerDayProvider).register();
    component.get(LangPieChartProvider).register();
    // component.get(LocalServerProvider).register();
}

// this method is called when your extension is deactivated
export function deactivate() {
}