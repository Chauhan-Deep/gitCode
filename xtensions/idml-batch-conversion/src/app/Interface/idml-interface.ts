export interface QXIDFileDetailsData {
    name: string;
    path: string;
    status?: boolean;
}

export interface QXIDMLFilesListData {
    indd?: QXIDFileDetailsData[];
    idml?: QXIDFileDetailsData[];
}

export interface QxIDMLFileConversionData {
    fileCount: number;
    fileUrl: string;
}
