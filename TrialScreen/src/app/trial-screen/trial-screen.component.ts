import { Component, OnInit } from '@angular/core';

import { TranslateService } from '../translate/translate.service';

@Component({
  selector: 'qrk-trial-screen',
  templateUrl: './trial-screen.component.html',
  styleUrls: ['./trial-screen.component.scss']
})
export class TrialScreenComponent implements OnInit {
  daysRemaining;

  constructor(private translateService: TranslateService) { }

  ngOnInit() {
    const days = ((<any>window).XPress) ?
      (<any>window).XPress.api.invokeApi('XTGetPendingDaysOfTrialMode', '').numOfDays : 29;
    this.daysRemaining = this.translateService.localize('days').replace('^1', days);
  }

  buyNow() {
    if ((<any>window).app) {
      (<any>window).app.launchApp(
        'https://www.quark.com/qxp-trial-purchase' +
        '?utm_source=QXP_App&utm_medium=PopUp&utm_campaign=Trial_Conversion&utm_content=Countdown.v1');
    } else {
      window.open(
        'https://www.quark.com/qxp-trial-purchase' +
        '?utm_source=QXP_App&utm_medium=PopUp&utm_campaign=Trial_Conversion&utm_content=Countdown.v1',
        '_blank');
    }
  }

  closeDialog() {
    if ((<any>window).app) {
      (<any>window).app.dialogs.closeDialog();
    }
  }

  activateLicense() {
    if ((<any>window).XPress) {
      (<any>window).XPress.api.invokeGuiApi('XTShowEditLicenseDialog', '');
      (<any>window).app.dialogs.closeDialog();
    }
  }
}
