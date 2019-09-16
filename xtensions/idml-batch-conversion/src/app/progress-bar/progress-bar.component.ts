import { Component, Input, OnInit, AfterContentInit, OnDestroy } from '@angular/core';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatStepper } from '@angular/material/stepper';

import { TranslateService } from '../translate/translate.service';
import { FileConversionService } from '../file-conversion.service';
import { QxIDMLFileConversionData } from '../util-interface';

@Component({
  selector: 'qrk-progress-bar',
  templateUrl: './progress-bar.component.html',
  styleUrls: ['./progress-bar.component.scss']
})

export class ProgressBarComponent implements OnInit, OnDestroy, AfterContentInit {
  @Input() stepper: MatStepper;

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
    private fileConversionService: FileConversionService) { }

  ngOnInit() {
    this.subscribeEvents();
  }

  subscribeEvents() {
    this.updateProgressBarEvent = this.fileConversionService.updateProgressBarEvent.subscribe(this.updateProgressBar.bind(this));
    this.showFinalResultEvent = this.fileConversionService.showFinalResultEvent.subscribe(this.showFinalResult.bind(this));
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
    this.totalFiles = this.fileConversionService.getFilesCount();
    this.fileConversionRate = this.translateService.localize('ids-lbl-progress-bar-file-converion-text');
    this.fileConversionRate = this.fileConversionRate.replace('^2', this.totalFiles.toString());

  }

  updateProgressBar(data: QxIDMLFileConversionData) {
    this.currentFileIndex = data.fileCount;
    this.filePath = data.fileUrl;
    this.updateConversionRateMsg();
    this.getProgressValue();
  }

  showFinalResult() {
    this.stepper.next();
  }

  updateConversionRateMsg() {
    this.currentFileConversionRate = this.fileConversionRate.replace('^1', this.currentFileIndex.toString());
  }

  getProgressValue() {
    this.progressValue = (this.currentFileIndex * 100) / this.totalFiles;
  }
}
