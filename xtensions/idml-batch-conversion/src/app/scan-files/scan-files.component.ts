import { Component, Input, OnInit } from '@angular/core';
import { MatStepper } from '@angular/material/stepper';

@Component({
  selector: 'qrk-scan-files',
  templateUrl: './scan-files.component.html',
  styleUrls: ['./scan-files.component.scss']
})
export class ScanFilesComponent implements OnInit {
  @Input() stepper: MatStepper;
  smartScanWindow: boolean;
  searchingWindow: boolean;
  searchResultWindow: boolean;
  filesListView: boolean;
  numOfFiles: number;
  numOfINDDFiles: number;
  numOfIDMLFiles: number;
  SUCCESS = 1;

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

  constructor() {
    this.smartScanWindow = true;
    this.searchingWindow = false;
    this.searchResultWindow = false;
    this.filesListView = false;
  }

  ngOnInit() {
  }

  showSearchingWindow() {
    this.smartScanWindow = false;
    this.searchingWindow = true;
    this.searchResultWindow = false;
    this.filesListView = false;
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

    this.smartScanWindow = false;
    this.searchingWindow = false;
    this.searchResultWindow = true;
    this.filesListView = false;
    // if (JSON.parse(response).request_status === this.SUCCESS) {
    this.numOfFiles = response[0].files.length + response[1].files.length;
    this.numOfINDDFiles = response[0].files.length;
    this.numOfIDMLFiles = response[1].files.length;
    // }
  }
}
