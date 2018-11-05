export interface DataFormat{
    method:METHOD;
    fileName?:string;
    fileType:TYPE;
    count:number;
};

enum METHOD{
    ADD='ADD',
    DEL='DEL'
};

enum TYPE{
    PY='py',
    TS='ts',
    CPP='cpp',
}