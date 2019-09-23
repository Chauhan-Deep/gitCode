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
