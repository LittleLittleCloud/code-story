import * as vscode from 'vscode';

export abstract class ExtensionContext implements vscode.ExtensionContext{
    abstract get subscriptions():  { dispose(): any }[];
    abstract get workspaceState(): vscode.Memento;
    abstract get globalState(): vscode.Memento;
    abstract get extensionPath(): string;
    public abstract asAbsolutePath(relativePath: string): string;
    abstract get storagePath(): string | undefined;
    abstract get logPath(): string;
}