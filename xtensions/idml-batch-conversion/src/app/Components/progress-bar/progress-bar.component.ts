import { Component, Input, OnInit, AfterContentInit, OnDestroy } from '@angular/core';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatStepper } from '@angular/material/stepper';

import { TranslateService } from '../../translate/translate.service';
import { FileListDataService } from '../../Service/file-list-data.service';
import { QXIDFileDetailsData } from '../../Interface/idml-interface';

@Component({
  selector: 'qrk-progress-bar',
  templateUrl: './progress-bar.component.html',
  styleUrls: ['./progress-bar.component.scss']
})

export class ProgressBarComponent implements OnInit, OnDestroy, AfterContentInit {
  @Input() stepper: MatStepper;

  private initiateProgressBar: any;
  private updateProgressBarEvent: any;
  private showFinalResultEvent: any;

  filePath: string;
  fileConversionRate: string;
  currentFileConversionRate: string;
  progressValue: number;
  totalFiles: number;
  currentFileIndex: number;

  constructor(
    private translateService: TranslateService,
    private fileListService: FileListDataService) { }

  ngOnInit() {
    this.subscribeEvents();
  }

  subscribeEvents() {
    this.updateProgressBarEvent = this.fileListService.updateProgressBarEvent.subscribe(this.updateProgressBar.bind(this));
    this.showFinalResultEvent = this.fileListService.showFinalResultEvent.subscribe(this.showFinalResult.bind(this));
  }

  unsubscribeEvents() {
    if (this.updateProgressBarEvent) {
      this.updateProgressBarEvent.unsubscribe();
      this.updateProgressBarEvent = undefined;
    }
    if (this.showFinalResultEvent) {
      this.showFinalResultEvent.unsubscribe();
      this.showFinalResultEvent = undefined;
    }
  }

  ngOnDestroy() {
    this.unsubscribeEvents();
  }

  ngAfterContentInit() {
    this.fileConversionRate = this.translateService.localize('ids-lbl-progress-bar-file-converion-text');
  }

  updateProgressBar(data: QXIDFileDetailsData) {
    this.currentFileIndex = this.fileListService.getConversionIndex();
    this.filePath = data.path + data.name;
    this.updateConversionRateMsg();
    this.getProgressValue();
  }

  showFinalResult() {
    this.progressValue = 100; // full conversion
    // show next screen after 1 second of showing full conversion in progress bar
    setTimeout(() => {
      this.stepper.selected.completed = true;
      this.stepper.next();
    }, 1000);
  }

  updateConversionRateMsg() {
    this.totalFiles = this.fileListService.getConversionListCount();
    this.fileConversionRate = this.fileConversionRate.replace('^2', this.totalFiles.toString());
    this.currentFileConversionRate = this.fileConversionRate.replace('^1', this.currentFileIndex.toString());
  }

  getProgressValue() {
    this.progressValue = ((this.currentFileIndex - 1) * 100) / this.totalFiles; // 100% conversion for n-1 files
    this.progressValue += (50 / this.totalFiles); // 50% conversion for nth file
  }

  cancelConversion() {
    this.fileListService.cancelDocumentsConversion(true);
  }
}
