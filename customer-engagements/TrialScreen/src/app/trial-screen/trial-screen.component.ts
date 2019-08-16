import { Component, OnInit, HostListener } from '@angular/core';

import { TranslateService } from '../translate/translate.service';

@Component({
  selector: 'qrk-trial-screen',
  templateUrl: './trial-screen.component.html',
  styleUrls: ['./trial-screen.component.scss']
})
export class TrialScreenComponent implements OnInit {
  thankYouMessage;

  constructor(private translateService: TranslateService) { }

  ngOnInit() {
    this.thankYouMessage = this.translateService.localize('thankYouMsg').replace('^1', '<img src="assets/images/qxp-logo.png" />');
  }

  closeDialog() {
    if ((<any>window).app) {
      (<any>window).XPress.api.invokeGuiApi('XTQuitXPress', '');
    }
  }

  activateLicense() {
    if ((<any>window).XPress) {
      (<any>window).XPress.api.invokeGuiApi('XTShowEditLicenseDialog', '');
      (<any>window).app.dialogs.closeDialog();
    }
  }

  @HostListener('window:keydown.escape', ['$event'])
  onEscape(event) {
    this.closeDialog();
  }
}
