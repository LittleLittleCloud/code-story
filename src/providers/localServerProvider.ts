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

    private getReport(): string {
        return `<!DOCTYPE html>
        <html lang="en">
        <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Cat Coding</title>
        </head>
        <body>
            <h1 id="Report">0</h1>

            <script>
                (function() {
                    const vscode = acquireVsCodeApi();
                    var listContainer = document.createElement('div');
                    // Add it to the page
                    document.getElementsByTagName('body')[0].appendChild(listContainer);
                    
                    // Make the list
                    var listElement = document.createElement('ul');
                    listContainer.appendChild(listElement);
                    
                    const counter = document.getElementById('lines-of-code-counter');

                    let count = 0;
                    setInterval(() => {
                        counter.textContent = count++;

                        // Alert the extension when our cat introduces a bug
                        if (Math.random() < 0.001 * count) {
                            vscode.postMessage({
                                command: 'alert',
                                text: '🐛  on line ' + count
                            })
                        }
                    }, 100);
                }())
            </script>
        </body>
        </html>`;
    }
}