import { Component, Input, OnInit } from '@angular/core';
import { MatStepper } from '@angular/material/stepper';
import { TranslateService } from '../translate/translate.service';


@Component({
  selector: 'qrk-scan-files',
  templateUrl: './scan-files.component.html',
  styleUrls: ['./scan-files.component.scss']
})
export class ScanFilesComponent implements OnInit {
  @Input() stepper: MatStepper;

  imgSrc: string;
  headingText: string;
  hideImage: boolean;
  hideScanView: boolean;
  hideCancelButton: boolean;
  hideResultWindow: boolean;
  filesListView: boolean;
  numOfFiles: number;
  numOfINDDFiles: number;
  numOfIDMLFiles: number;

  dummydata = [{
    title: 'INDD',
    files: [{
      name: 'ABC',
      pathUrl: './ABC'
    },
    {
      name: 'ABC2',
      pathUrl: './ABC2'
    }]
  },
  {
    title: 'IDML',
    files: [{
      name: 'ABC',
      pathUrl: './ABC'
    },
    {
      name: 'ABC2',
      pathUrl: './ABC2'
    },
    {
      name: 'ABC3',
      pathUrl: './ABC3'
    }]
  }];

  constructor(
    private translateService: TranslateService) {  }

  ngOnInit() {
    this.headingText = this.translateService.localize('ids-lbl-scan-files-maintext');
    this.imgSrc = '\\assets\\images\\img-smart-scan.png';

    this.hideCancelButton = true;
    this.hideImage = false;
    this.hideScanView = false;
    this.hideResultWindow = true;
    this.filesListView = false;
  }

  showSearchingWindow() {
    this.headingText = this.translateService.localize('ids-lbl-searching-files');
    this.imgSrc = '\\assets\\images\\img-searching.png';

    this.filesListView = false;
    this.hideResultWindow = true;
    this.hideCancelButton = false;
    this.hideScanView = true;
  }

  performSystemScan() {
    this.showSearchingWindow();
    this.getFilesSearchResultHandler(this.dummydata);
    // (<any>window) ? (<any>window).XPress.api.invokeApi('IDMLStartSystemScan', '', this.getFilesSearchResultHandler) : 0;
  }

  performCustomScan() {
    this.showSearchingWindow();
    // (<any>window) ? (<any>window).XPress.api.invokeApi('IDMLStartSystemScan', '', this.getFilesSearchResultHandler) : 0;
  }

  getFilesSearchResultHandler(response) {
    console.log('SearchResults: ' + response);

    this.headingText = this.translateService.localize('ids-lbl-files-found');

    this.hideScanView = true;
    this.hideImage = true;
    this.hideResultWindow = false;
    this.filesListView = false;

    // if (JSON.parse(response).request_status === this.SUCCESS) {
    this.numOfFiles = response[0].files.length + response[1].files.length;
    this.numOfINDDFiles = response[0].files.length;
    this.numOfIDMLFiles = response[1].files.length;
    // }
  }
}
