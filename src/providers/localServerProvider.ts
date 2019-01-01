import * as express from 'express';
import * as component from '../common/component';
import { RegisterProvider } from '../interface/registerProvider';
import * as vscode from 'vscode';
import * as portfinder from 'portfinder';

var app = require('./../../server/app');

@component.Export(RegisterProvider)
export class LocalServerProvider {
    public readonly hostName: string = 'localhost';
    public app: express.Application;

    private startPort: number;

    private portValue: number;


    public async register(): Promise<void> {
        this.app = app;
        this.startPort = vscode.workspace.getConfiguration('codeStory').get('startPort');
        component.getContext().subscriptions.push(
            vscode.workspace.onDidChangeConfiguration(async () => {
                this.startPort = vscode.workspace.getConfiguration('codeStory').get('startPort');
            })
        );
        this.portValue = await portfinder.getPortPromise({ port: this.startPort });
        this.app.listen(this.port, this.hostName);
    }

    get port(): number {
        return this.portValue;
    }

    get host(): string {
        return `${this.hostName}:${this.port}`;
    }
}