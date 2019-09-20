import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { MatStepper } from '@angular/material/stepper';

import { TranslateService } from '../../translate/translate.service';
import { QXIDMLFilesListData } from '../../Interface/idml-interface';
import { FileListDataService } from 'src/app/Service/file-list-data.service';

@Component({
  selector: 'qrk-scan-files',
  templateUrl: './scan-files.component.html',
  styleUrls: ['./scan-files.component.scss']
})
export class ScanFilesComponent implements OnInit, OnDestroy {
  @Input() stepper: MatStepper;

  private scanResultsEvent: any;
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

  constructor(
    private translateService: TranslateService,
    private fileListService: FileListDataService) { }

  ngOnInit() {
    this.headingText = this.translateService.localize('ids-lbl-scan-files-maintext');
    this.imgSrc = 'assets\\images\\img-smart-scan.png';

    this.showCancelButton = false;
    this.hideImage = false;
    this.hideScanView = false;
    this.showResultWindow = false;
    this.showFilesListView = false;
    this.hideHeading = false;
    this.subscribeEvents();
  }

  ngOnDestroy() {
    this.unsubscribeEvents();
  }

  showSearchingWindow() {
    this.headingText = this.translateService.localize('ids-lbl-searching-files');
    this.imgSrc = 'assets\\images\\img-searching.png';

    this.showFilesListView = false;
    this.showResultWindow = false;
    this.hideScanView = true;
    this.showCancelButton = true;
  }

  performSystemScan() {
    this.showSearchingWindow();
    this.fileListService.callXPressFileEnumeration('');
  }

  performCustomScan() {
    let folderUrl: string;

    if (window as any) {
      folderUrl = (window as any).app.dialogs.openFolderDialog();
    }
    this.showSearchingWindow();
    this.fileListService.callXPressFileEnumeration(folderUrl);
  }

  subscribeEvents() {
    console.log('subscribe called');
    this.scanResultsEvent = this.fileListService.showSystemScanResultEvent.subscribe(this.getFilesSearchResultHandler.bind(this));
  }

  unsubscribeEvents() {
    if (this.scanResultsEvent) {
      this.scanResultsEvent.unsubscribe();
      this.scanResultsEvent = undefined;
    }
  }

  getFilesSearchResultHandler() {
    this.headingText = this.translateService.localize('ids-lbl-files-found');

    this.hideScanView = true;
    this.hideImage = true;
    this.showResultWindow = true;
    this.showFilesListView = false;

    this.fileListService.shouldRespondWithSearchData = true;
    this.numOfFiles = this.fileListService.getFilesCount();
    this.numOfINDDFiles = this.fileListService.getINDDFilesCount();
    this.numOfIDMLFiles = this.fileListService.getIDMLFilesCount();
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
