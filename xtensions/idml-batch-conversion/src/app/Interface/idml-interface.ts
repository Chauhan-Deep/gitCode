export interface QXIDFileDetailsData {
    name: string;
    path: string;
    status?: boolean;
    qxpPath?: string;
    overwrite?: boolean;
}

export interface QXIDMLFilesListData {
    indd?: QXIDFileDetailsData[];
    idml?: QXIDFileDetailsData[];
}

export enum ErrorCode {
    ERR_FAILURE = -1,
    ERR_SUCCESS = 0,
    ERR_INDESIGN_NOTFOUND = 1,
    ERR_INDESIGN_ERROR = 2
}
