export interface IDataFormat {
    fileName?: string;
    fileType: string;
    count: number;
    time: number;
}


export enum METHOD {
    ADD = 'ADD',
    DEL = 'DEL'
};

export enum TYPE {
    PY = 'py',
    TS = 'ts',
    CPP = 'cpp',
}