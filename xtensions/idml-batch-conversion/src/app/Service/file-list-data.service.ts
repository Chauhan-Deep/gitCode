import { Injectable, EventEmitter } from '@angular/core';

import { TranslateService } from '../translate/translate.service';

import { QXIDMLFilesListData, QXIDFileDetailsData, ErrorCode, IDMLImportXTID } from '../Interface/idml-interface';

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
  private ignoreINDDFiles = false;
  private isConversionCancelled = false;
  shouldOverwriteExisting = false;
  shouldRespondWithSearchData = true;
  updateProgressBarEvent = new EventEmitter<any>();
  showFinalResultEvent = new EventEmitter<any>();
  showSystemScanResultEvent = new EventEmitter<any>();

  constructor(private translateService: TranslateService) { }

  cancelDocumentsConversion(cancel: boolean): void {
    this.isConversionCancelled = cancel;
  }
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
    if (!this.shouldRespondWithSearchData) {
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

  convertInDesignFileToQXP(isIndd: boolean, fileIndex: number) {
    const object = isIndd ? this.convertFilesList.indd[fileIndex] : this.convertFilesList.idml[fileIndex];

    object.overwrite = this.shouldOverwriteExisting;
    this.updateProgressBarEvent.emit(object);
    if ((window as any).XPress) {
      (window as any).XPress.api.invokeXTApi(IDMLImportXTID,
        'IDMLImportConvertINDDAndIDMLFilesToQXP', object,
        isIndd ? this.inddConversionResultHandler.bind(this) : this.idmlConversionResultHandler.bind(this));
    }
  }

  showFinalResultsScreen() {
    this.shouldRespondWithSearchData = false;
    this.showFinalResultEvent.emit();
  }

  inddConversionResultHandler(response) {
    const jsonResponse = JSON.parse(response);
    let isIndd = true;

    if ((jsonResponse.status === ErrorCode.ERR_INDESIGN_NOTFOUND
      || jsonResponse.status === ErrorCode.ERR_INDESIGN_ERROR)
      && ((window as any).app)) {
      this.ignoreINDDFiles = true;

      if (jsonResponse.status === ErrorCode.ERR_INDESIGN_NOTFOUND) {
        this.ignoreINDDFiles = (window as any).app.dialogs.confirm(this.translateService.localize('ids-alert-indesign-not-available'),
          (window as any).app.constants.alertTypes.kNoteAlert);
      }

      if (this.ignoreINDDFiles) {
        this.fileConversionIndex = this.convertFilesList.indd.length;
        this.convertINDDIndex = this.convertFilesList.indd.length;
        this.convertFilesList.indd.forEach((childItem): void => {
          childItem.status = false;
        });

        this.callXPressFileConversion(this.convertFilesList);
      }
    } else {
      this.fileConversionIndex++;
      if (this.convertFilesList.indd.length > 0) {
        const object = this.convertFilesList.indd[this.convertINDDIndex];

        object.qxpPath = jsonResponse.qxpPath;
        object.status = (jsonResponse.status === ErrorCode.ERR_SUCCESS);
        this.convertFilesList.indd[this.convertINDDIndex] = object;
        this.convertINDDIndex++;

        if (this.isConversionCancelled) {
          this.convertIDMLIndex = 0;
          this.changeDocumentsStatusForCancelled();
          return;
        }
        if (this.convertINDDIndex < this.convertFilesList.indd.length) {
          isIndd = true;
          this.convertInDesignFileToQXP(isIndd, this.convertINDDIndex);
        } else if (this.convertIDMLIndex < this.convertFilesList.idml.length) {
          isIndd = false;
          this.convertIDMLIndex = 0;
          this.convertInDesignFileToQXP(isIndd, this.convertIDMLIndex);
        } else {
          this.showFinalResultsScreen();
        }

      }
    }
  }

  idmlConversionResultHandler(response) {
    const jsonResponse = JSON.parse(response);

    this.fileConversionIndex++;
    if (this.convertFilesList.idml.length > 0) {
      const object = this.convertFilesList.idml[this.convertIDMLIndex];

      object.qxpPath = jsonResponse.qxpPath;
      object.status = (jsonResponse.status === ErrorCode.ERR_SUCCESS);
      this.convertFilesList.idml[this.convertIDMLIndex] = object;
      this.convertIDMLIndex++;

      if (this.isConversionCancelled) {
        this.changeDocumentsStatusForCancelled();
        return;
      }
      if (this.convertIDMLIndex < this.convertFilesList.idml.length) {
        this.convertInDesignFileToQXP(false, this.convertIDMLIndex);
      } else {
        this.showFinalResultsScreen();
      }

    }
  }

  changeDocumentsStatusForCancelled(): void {
    if (this.isConversionCancelled) {
      const inddIndex = this.convertINDDIndex;
      const idmlIndex = this.convertIDMLIndex;

      this.convertFilesList.indd.forEach((childItem, index): void => {
        if (index >= inddIndex) {
          childItem.status = false;
        }
      });
      this.convertFilesList.idml.forEach((childItem, index): void => {
        if (index >= idmlIndex) {
          childItem.status = false;
        }
      });
      this.showFinalResultsScreen();
      return;
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

      (window as any).XPress.api.invokeXTApi(IDMLImportXTID,
        'IDMLImportEnumerateINDDAndIDMLFiles', data, this.scanResultHandler.bind(this));
    }
  }

  callXPressFileConversion(data: QXIDMLFilesListData) {
    this.convertFilesList.indd = data.indd;
    this.convertFilesList.idml = data.idml;

    if ((window as any).XPress) {
      this.fileConversionIndex++;
      if (!this.ignoreINDDFiles && this.convertFilesList.indd.length > 0) {
        this.convertINDDIndex = 0;
        this.convertInDesignFileToQXP(true, this.convertINDDIndex);
      } else if (this.convertFilesList.idml.length > 0) {
        this.convertIDMLIndex = 0;
        this.convertInDesignFileToQXP(false, this.convertIDMLIndex);
      } else {
        this.showFinalResultsScreen();
      }

    }
  }
}
