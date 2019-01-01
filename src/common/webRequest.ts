import * as http from 'http';
import * as vscode from 'vscode';
export interface IRequestParam {
    endpoint: string;
    method: string;
    port?: number;
    path: string;
}

export async function sendRequest<T>(param: IRequestParam): Promise<T> {
    return new Promise<T>((resolve, rej) => {
        http.get({
            method: param.method,
            port: param.port,
            path: param.path
        }, async (res) => {
            const { statusCode } = res;

            let error;
            if (statusCode !== 200) {
                error = new Error('Request Failed')
            }

            if (error) {
                await vscode.window.showErrorMessage(error);
                res.resume();
                rej(error);
            }

            res.setEncoding('utf8');
                let rawData = '';
            res.on('data', (chunk) => { rawData += chunk; });
            res.on('end', () => {
                try {
                    resolve(<T><unknown>rawData);
                } catch (e) {
                    rej(e);
                }
            })
            .on('error', (e) => {
                    rej(e);
                });
        });
    });

}