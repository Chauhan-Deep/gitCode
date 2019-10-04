import { Injectable, EventEmitter } from '@angular/core';

import { QXIDMLFilesListData, QXIDFileDetailsData } from '../Interface/idml-interface';

@Injectable({
  providedIn: 'root'
})

export class FileListDataService {
  private filesList: QXIDMLFilesListData;
  private convertFilesList: QXIDMLFilesListData = {
    indd: [],
    idml: []
  };
  private convertINDDIndex = 0;
  private convertIDMLIndex = 0;
  private fileCount = 0;
  private fileConversionIndex = 0;
  shouldOverwriteExisting = false;
  shouldRespondWithSearchData = true;
  updateProgressBarEvent = new EventEmitter<any>();
  showFinalResultEvent = new EventEmitter<any>();
  showSystemScanResultEvent = new EventEmitter<any>();

  constructor() { }

  getINDDFilesCount(): number {
    return this.filesList.indd.length;
  }

  getIDMLFilesCount(): number {
    return this.filesList.idml.length;
  }

  getConversionIndex(): number {
    return this.fileConversionIndex;
  }

  getConversionListCount(): number {
    return this.convertFilesList.indd.length + this.convertFilesList.idml.length;
  }

  getFilesCount(): number {
    if (this.shouldRespondWithSearchData) {
      return this.fileCount;
    } else {
      return this.convertFilesList.indd.length + this.convertFilesList.idml.length;
    }
    return this.fileCount;
  }

  getFileList(): QXIDMLFilesListData {
    if (this.shouldRespondWithSearchData) {
      return this.filesList;
    } else {
      return this.convertFilesList;
    }
  }

  getFileConversionResult(): QXIDMLFilesListData {
    return this.filesList;
  }

  inddConversionResultHandler(response) {
    const jsonResponse = JSON.parse(response);

    this.fileConversionIndex++;
    if (this.convertFilesList.indd.length > 0) {
      let object = this.convertFilesList.indd[this.convertINDDIndex];

      object.qxpPath = jsonResponse.qxpPath;
      object.status = jsonResponse.status;
      this.convertFilesList.indd[this.convertINDDIndex] = object;
      this.convertINDDIndex++;

      if (this.convertINDDIndex < this.convertFilesList.indd.length) {
        object = this.convertFilesList.indd[this.convertINDDIndex];
        object.overwrite = this.shouldOverwriteExisting;
        this.updateProgressBarEvent.emit(object);
        if ((window as any).XPress) {
          (window as any).XPress.api.invokeXTApi(1146372945,
            'IDMLImportConvertINDDAndIDMLFilesToQXP', object, this.inddConversionResultHandler.bind(this));
        }
      } else if (this.convertIDMLIndex < this.convertFilesList.idml.length) {
        this.convertIDMLIndex = 0;
        object = this.convertFilesList.idml[this.convertIDMLIndex];
        object.overwrite = this.shouldOverwriteExisting;
        this.updateProgressBarEvent.emit(object);
        if ((window as any).XPress) {
          (window as any).XPress.api.invokeXTApi(1146372945,
            'IDMLImportConvertINDDAndIDMLFilesToQXP', object, this.idmlConversionResultHandler.bind(this));
        }
      } else {
        this.shouldRespondWithSearchData = false;
        this.showFinalResultEvent.emit();
      }
    }
  }

  idmlConversionResultHandler(response) {
    const jsonResponse = JSON.parse(response);

    this.fileConversionIndex++;
    if (this.convertFilesList.idml.length > 0) {
      let object = this.convertFilesList.idml[this.convertIDMLIndex];

      object.qxpPath = jsonResponse.qxpPath;
      object.status = jsonResponse.status;
      this.convertFilesList.idml[this.convertIDMLIndex] = object;
      this.convertIDMLIndex++;

      if (this.convertIDMLIndex < this.convertFilesList.idml.length) {
        object = this.convertFilesList.idml[this.convertIDMLIndex];
        object.overwrite = this.shouldOverwriteExisting;
        this.updateProgressBarEvent.emit(object);
        if ((window as any).XPress) {
          (window as any).XPress.api.invokeXTApi(1146372945,
            'IDMLImportConvertINDDAndIDMLFilesToQXP', object, this.idmlConversionResultHandler.bind(this));
        }
      } else {
        this.shouldRespondWithSearchData = false;
        this.showFinalResultEvent.emit();
      }
    }
  }

  scanResultHandler(response) {
    this.filesList = JSON.parse(response);
    this.fileCount = this.filesList.indd.length + this.filesList.idml.length;
    this.showSystemScanResultEvent.emit();
  }

  callXPressFileEnumeration(folderUrl: string): void {
    if ((window as any).XPress) {

      const data = folderUrl === '' ? {} : { searchDirectory: folderUrl };

      (window as any).XPress.api.invokeXTApi(1146372945,
        'IDMLImportEnumerateINDDAndIDMLFiles', data, this.scanResultHandler.bind(this));
    }
  }

  callXPressFileConversion(data: QXIDMLFilesListData) {
    this.convertFilesList.indd = data.indd;
    this.convertFilesList.idml = data.idml;

    let object: QXIDFileDetailsData;

    if ((window as any).XPress) {
      this.fileConversionIndex++;
      if (this.convertFilesList.indd.length > 0) {
        this.convertINDDIndex = 0;
        object = this.convertFilesList.indd[this.convertINDDIndex];
        object.overwrite = this.shouldOverwriteExisting;
        this.updateProgressBarEvent.emit(object);
        (window as any).XPress.api.invokeXTApi(1146372945,
          'IDMLImportConvertINDDAndIDMLFilesToQXP', object, this.inddConversionResultHandler.bind(this));
      } else if (this.convertFilesList.idml.length > 0) {
        this.convertIDMLIndex = 0;
        object = this.convertFilesList.idml[this.convertIDMLIndex];
        object.overwrite = this.shouldOverwriteExisting;
        this.updateProgressBarEvent.emit(object);
        (window as any).XPress.api.invokeXTApi(1146372945,
          'IDMLImportConvertINDDAndIDMLFilesToQXP', object, this.idmlConversionResultHandler.bind(this));
      }
    }
  }
}
