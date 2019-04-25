import { Component, OnInit, HostListener } from '@angular/core';

import { TranslateService } from '../translate/translate.service';

@Component({
  selector: 'qrk-trial-screen',
  templateUrl: './trial-screen.component.html',
  styleUrls: ['./trial-screen.component.scss']
})
export class TrialScreenComponent implements OnInit {
  daysRemaining;
  numOfDays: number;

  constructor(private translateService: TranslateService) { }

  ngOnInit() {
    const days = ((<any>window).XPress) ?
      (<any>window).XPress.api.invokeApi('XTGetPendingDaysOfTrialMode', '').numOfDays : 29;
    if (days > 1) {
      this.daysRemaining = this.translateService.localize('days').replace('^1', days);
    } else {
      this.daysRemaining = this.translateService.localize('day').replace('^1', days);
    }
    this.numOfDays = parseInt(days, 10);
  }

  buyNow() {
    const buyUrl = 'https://www.quark.com/qxp-trial-purchase?utm_source=' +
      encodeURIComponent('QXP_App&utm_medium=PopUp&utm_campaign=Trial_Conversion&utm_content=Countdown.v1');

    if ((<any>window).app) {
      (<any>window).app.launchApp(buyUrl);
    } else {
      window.open(buyUrl, '_blank');
    }
  }

  closeDialog() {
    if ((<any>window).app) {
      (<any>window).app.dialogs.closeDialog();
    }
  }

  activateLicense() {
    if ((<any>window).XPress) {
      (<any>window).app.dialogs.closeDialog();
      (<any>window).XPress.api.invokeGuiApi('XTShowEditLicenseDialog', '');
    }
  }

  @HostListener('window:keydown.escape', ['$event'])
  onEscape(event) {
    this.closeDialog();
  }
}
