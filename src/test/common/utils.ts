import * as fs from 'fs';
import * as path from 'path';
import { EDBUG } from '../../common/util';

export async function CreateFile(fileName: string, ROOTPATH=''): Promise<void> {
    const filePath = path.join(ROOTPATH!, fileName);
    fs.writeFile(filePath, '', {}, (err) => {
        EDBUG(err.message);
    });
}