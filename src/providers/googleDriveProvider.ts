import * as component from '../common/component';
import { RegisterProvider } from '../interface/registerProvider';
import * as google from 'googleapis';
import * as vscode from 'vscode';
import * as fs from 'fs';
import * as readline from 'readline';
import * as path from 'path';
import { StatusProvider } from './statusProvider';
import { EDBUG } from '../common/util';
import { GoogleAuth, OAuth2Client, Credentials } from 'google-auth-library';

@component.Export(RegisterProvider)
@component.Singleton
export class GoogleDriveProvider {
    private oAuth2Client: OAuth2Client;
    private TOKEN_PATH;
    private CREDENTIALS_PATH;
    public async register() {
        this.TOKEN_PATH = path.join(component.getContext().extensionPath, 'token.json');
        this.CREDENTIALS_PATH = path.join(component.getContext().extensionPath, 'client_id.json');
    }

    public async upload(filePath: string) {
        const oAuth2Client = await this.getOAuth2Client();
        const drive = new google.drive_v3.Drive({
            auth: oAuth2Client
        });
        // const fileSize = fs.statSync(filePath);
        //first find out if record.db exist in drive

        const files = await drive.files.list();
        const record = files.data.files.find(x => x.name === 'record.db');
        if (record !== undefined) {
            drive.files.update(
                {
                    fileId: record.id,
                    media: {
                        body: fs.createReadStream(filePath)
                    },
                },
                (err, res) => {
                    if (err) {
                        EDBUG(err.message);
                        return;
                    }
                    EDBUG('done');
                }
            );
        } else {
            drive.files.create(
                {
                    requestBody: {
                        name: 'record.db'
                    },
                    media: {
                        body: fs.createReadStream(filePath)
                    },
                },
                (err, res) => {
                    if (err) {
                        EDBUG(err.message);
                        return;
                    }
                    EDBUG('done');
                }
            );
        }
    }

    public async download(dstPath: string) {
        const oAuth2Client = await this.getOAuth2Client();
        const drive = new google.drive_v3.Drive({
            auth: oAuth2Client
        });
        const dest = fs.createWriteStream(dstPath);
        const files = await drive.files.list();
        const record = files.data.files.find(x => x.name === 'record.db');
        if (record === undefined) {
            vscode.window.showErrorMessage("fail to find record.db, please upload first");
            return;
        }
        drive.files.get({
            fileId: record.id, alt: 'media',
        }, {
                responseType: 'stream',
            }, (err, res) => {
                if (err) {
                    EDBUG(err.message);
                    return;
                }
                res.data
                .on('error',(error)=>{
                    vscode.window.showErrorMessage(error.message);
                })
                .pipe(dest);

            });
        await new Promise((res, rej) => {
            dest.on('finish', () => res());
            dest.on('error', () => rej('error'));
        });

    }

    private async getOAuth2Client() {
        if (this.oAuth2Client !== undefined) {
            return this.oAuth2Client;
        } else {
            if (!fs.existsSync(this.TOKEN_PATH)) {
                try {
                    await this.login();
                } catch (e) {
                    vscode.window.showErrorMessage(e);
                }
            }
            const token = <Credentials>JSON.parse(fs.readFileSync(this.TOKEN_PATH).toString());
            const credentials = JSON.parse(fs.readFileSync(this.CREDENTIALS_PATH).toString());
            const { client_secret, client_id, redirect_uris } = credentials['installed'];
            this.oAuth2Client = new OAuth2Client(
                client_id,
                client_secret,
                redirect_uris[0]
            );
            this.oAuth2Client.setCredentials(token);
            return this.oAuth2Client;
        }
    }

    private async login() {
        const SCOPES = ['https://www.googleapis.com/auth/drive'];
        const credentials = JSON.parse(fs.readFileSync(this.CREDENTIALS_PATH).toString());
        EDBUG('shit');
        const { client_secret, client_id, redirect_uris } = credentials['installed'];
        const oAuth2Client = new OAuth2Client(
            client_id, client_secret, redirect_uris[0]
        );
        const authUrl = oAuth2Client.generateAuthUrl({
            access_type: 'offline',
            scope: SCOPES,
        });
        vscode.window.showInformationMessage('Authorize code story by visiting this url: ' + authUrl);
        const code = await vscode.window.showInputBox({ prompt: 'Enter the code from that page here', ignoreFocusOut: true });
        oAuth2Client.getToken(code, (err, token) => {
            if (err) {
                throw err;
            }
            // Store the token to disk for later program executions
            fs.writeFile(this.TOKEN_PATH, JSON.stringify(token), (err) => {
                if (err) {
                    console.error(err);
                }
                vscode.window.showInformationMessage('authorize successful');
            });
        });
    }
}