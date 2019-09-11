import { Component, Input, OnInit } from '@angular/core';
import { MatStepper } from '@angular/material/stepper';
import { TranslateService } from '../translate/translate.service';


import { TranslateService } from '../translate/translate.service';
import { QxIDMLTreeNodeOptions } from '../util-interface';

@Component({
  selector: 'qrk-scan-files',
  templateUrl: './scan-files.component.html',
  styleUrls: ['./scan-files.component.scss']
})
export class ScanFilesComponent implements OnInit {
  @Input() stepper: MatStepper;

  imgSrc: string;
  headingText: string;
  hideHeading: boolean;
  hideImage: boolean;
  hideScanView: boolean;
  showResultWindow: boolean;
  showCancelButton: boolean;
  numOfFiles: number;
  numOfINDDFiles: number;
  numOfIDMLFiles: number;
  showFilesListView: boolean;
  filesEnumData: QxIDMLTreeNodeOptions;
  interval;

  constructor(
    private translateService: TranslateService) { }

  ngOnInit() {
    this.headingText = this.translateService.localize('ids-lbl-scan-files-maintext');
    this.imgSrc = '\\assets\\images\\img-smart-scan.png';

    this.showCancelButton = false;
    this.hideImage = false;
    this.hideScanView = false;
    this.showResultWindow = false;
    this.showFilesListView = false;
    this.hideHeading = false;
  }

  showSearchingWindow() {
    this.headingText = this.translateService.localize('ids-lbl-searching-files');
    this.imgSrc = '\\assets\\images\\img-searching.png';

    this.showFilesListView = false;
    this.showResultWindow = false;
    this.hideScanView = true;
    this.showCancelButton = true;
  }

  performSystemScan() {
    const data = {};

    this.showSearchingWindow();
    if (window as any) {
      this.filesEnumData = (window as any).XPress.api.invokeXTApi(1146372945,
        'IDMLImportEnumerateINDDAndIDMLFiles', data);
      this.getFilesSearchResultHandler();
    }
  }

  performCustomScan() {
    let folderUrl: string;

    if (window as any) {
      folderUrl = (window as any).app.dialogs.openFolderDialog();
    }
    this.showSearchingWindow();
    if (window as any) {
      const data = { searchDirectory: folderUrl };

      this.filesEnumData = (window as any).XPress.api.invokeXTApi(1146372945,
        'IDMLImportEnumerateINDDAndIDMLFiles', data);
      this.getFilesSearchResultHandler();
    }
  }

  getFilesSearchResultHandler() {
    clearInterval(this.interval);
    this.headingText = this.translateService.localize('ids-lbl-files-found');

    this.hideScanView = true;
    this.hideImage = true;
    this.showResultWindow = true;
    this.showFilesListView = false;

    this.numOfFiles = this.filesEnumData.indd.length + this.filesEnumData.idml.length;
    this.numOfINDDFiles = this.filesEnumData.indd.length;
    this.numOfIDMLFiles = this.filesEnumData.idml.length;

    setTimeout(() => {
      this.showFileListView();
    }, 2000);
  }

  showFileListView() {
    this.hideScanView = true;
    this.hideImage = true;
    this.showCancelButton = false;
    this.showResultWindow = false;
    this.hideHeading = true;
    this.showFilesListView = true;
  }
}
