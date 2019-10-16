import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { MatStepper } from '@angular/material/stepper';

import { TranslateService } from '../../translate/translate.service';
import { FileListDataService } from 'src/app/Service/file-list-data.service';
import { CloseDialogService } from 'src/app/Service/close-dialog.service';

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
    private fileListService: FileListDataService,
    private closeDialogService: CloseDialogService) { }

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

  showSearchingWindow(folderUrl: string) {
    this.headingText = this.translateService.localize('ids-lbl-searching-files');
    this.imgSrc = 'assets\\images\\img-searching.png';

    this.showFilesListView = false;
    this.showResultWindow = false;
    this.hideScanView = true;
    this.closeDialogService.hideClose();
    setTimeout(() => {
      this.fileListService.callXPressFileEnumeration(folderUrl);
    }, 1000);
  }

  performSystemScan() {
    this.showSearchingWindow('');
  }

  performCustomScan() {
    let folderUrl: string;

    if ((window as any).app) {
      folderUrl = (window as any).app.dialogs.openFolderDialog();
    }
    if (folderUrl != null) {
      this.showSearchingWindow(folderUrl);
    }
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
    this.headingText = this.translateService.localize('ids-lbl-scancompleted');

    this.hideScanView = true;
    this.hideImage = true;
    this.showResultWindow = true;
    this.showFilesListView = false;
    this.showCancelButton = true;

    this.closeDialogService.showClose();
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

  closeWindow() {
    this.closeDialogService.closeDialog();
  }
}
