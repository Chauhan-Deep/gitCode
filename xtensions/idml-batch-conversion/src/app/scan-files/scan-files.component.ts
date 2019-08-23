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
    this.numOfFiles = 27;
    this.numOfINDDFiles = 10;
    this.numOfIDMLFiles = 17;
  }

  performCustomScan() {
    this.showSearchingWindow();
    this.numOfFiles = 27;
    this.numOfINDDFiles = 10;
    this.numOfIDMLFiles = 17;
  }
}
