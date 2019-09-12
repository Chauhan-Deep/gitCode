export interface QxFileNodeOptions {
    name: string;
    path: string;
    status?: boolean;
}

export interface QxIDMLTreeNodeOptions {
    indd?: QxFileNodeOptions[];
    idml?: QxFileNodeOptions[];
}
