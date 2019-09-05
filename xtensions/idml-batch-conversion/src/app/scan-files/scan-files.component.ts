import { Component, Input, OnInit } from '@angular/core';
import { MatStepper } from '@angular/material/stepper';
import { TranslateService } from '../translate/translate.service';


export interface QxFileNodeOptions {
  name: string;
  path: string;
}
export interface QxIDMLTreeNodeOptions {
  indd?: QxFileNodeOptions[];
  idml?: QxFileNodeOptions[];
}

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
  hideFilesListView: boolean;
  filesEnumData: QxIDMLTreeNodeOptions[];
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
    this.hideFilesListView = true;
    this.hideHeading = false;
  }

  showSearchingWindow() {
    this.headingText = this.translateService.localize('ids-lbl-searching-files');
    this.imgSrc = '\\assets\\images\\img-searching.png';

    this.hideFilesListView = true;
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
      this.getFilesSearchResultHandler(this.filesEnumData);
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
      this.getFilesSearchResultHandler(this.filesEnumData);
    }
  }

  getFilesSearchResultHandler(response) {
    console.log('SearchResults: ' + response);

    clearInterval(this.interval);
    this.headingText = this.translateService.localize('ids-lbl-files-found');

    this.hideScanView = true;
    this.hideImage = true;
    this.showResultWindow = true;
    this.hideFilesListView = true;

    this.numOfFiles = response.indd.length + response.idml.length;
    this.numOfINDDFiles = response.indd.length;
    this.numOfIDMLFiles = response.idml.length;

    this.interval = setInterval(() => {
      this.startTimer();
    }, 200);
  }

  startTimer() {
    this.hideScanView = true;
    this.hideImage = true;
    this.showCancelButton = false;
    this.showResultWindow = false;
    this.hideHeading = true;
    this.hideFilesListView = false;
  }
}
