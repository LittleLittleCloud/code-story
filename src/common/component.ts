import { Container, injectable } from "inversify";
import * as vscode from 'vscode';
import "reflect-metadata";
import {ExtensionContext} from './extensionContext';
const container = new Container({autoBindInjectable: true, defaultScope: 'Singleton'});

export function Singleton(target: Function){
    injectable()(target);
    container.bind(target).toSelf().inSingletonScope();
}

// tslint:disable-next-line:function-name
export function Export(source: Function | symbol): (target) => void {
    return (target): void => {
        if (!container.isBound(target)) {
            Singleton(target);
        }
        container.bind(source).toConstantValue(container.get(target));
    };
}

export function getAll<T>(cls:{ prototype: T }):T[]{
    return container.getAll(cls);
}

export function get<T>(cls:{ prototype: T }):T{
    return container.get(cls);
}

export function bindContext(context: vscode.ExtensionContext): void {
    container.bind(ExtensionContext).toConstantValue(context);
}

export function getContext(): vscode.ExtensionContext {
    return container.get(ExtensionContext);
}