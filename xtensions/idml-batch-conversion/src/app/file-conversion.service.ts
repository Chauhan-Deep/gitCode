import { Injectable, EventEmitter } from '@angular/core';

import { QxIDMLTreeNodeOptions } from './util-interface';

@Injectable({
  providedIn: 'root'
})

export class FileConversionService {
  filesConversionResult: QxIDMLTreeNodeOptions;
  fileCount = 0;

  updateProgressBarEvent = new EventEmitter<any>();
  showFinalResultEvent = new EventEmitter<any>();

  constructor() { }

  callXPressFileConversion(data: QxIDMLTreeNodeOptions) {
    if ((window as any).app) {
      const notificationName = 'IDMLFileConversion';
      this.fileCount = data.indd.length + data.idml.length;

      (window as any).XPress.registerNotificationHandler(notificationName, this.notificationObserver.bind(this));

      (window as any).XPress.api.invokeXTApi(1146372945,
        'IDMLImportConvertINDDAndIDMLFilesToQXP', data, this.resultHandler.bind(this));

    }
  }

  getFilesCount(): number {
    return this.fileCount;
  }

  getFileConversionResult(): QxIDMLTreeNodeOptions {
    return this.filesConversionResult;
  }

  resultHandler(response) {
    this.filesConversionResult = JSON.parse(response);
    this.showFinalResultEvent.emit();
  }

  notificationObserver(response) {
    const jsonResponse = JSON.parse(response);
    this.updateProgressBarEvent.emit(jsonResponse);
  }

}
