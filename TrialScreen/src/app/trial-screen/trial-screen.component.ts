import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'qrk-trial-screen',
  templateUrl: './trial-screen.component.html',
  styleUrls: ['./trial-screen.component.scss']
})
export class TrialScreenComponent implements OnInit {
  daysRemaining = 29;

  ngOnInit() {
    this.daysRemaining = ((<any>window).XPress) ?
      (<any>window).XPress.api.invokeApi('XTGetPendingDaysOfTrialMode', '').numOfDays : this.daysRemaining;
  }

  buyNow() {
    if ((<any>window).app) {
      (<any>window).app.launchApp(
        'https://shop.quark.com/default.aspx?utm_source=QXP_App&utm_medium=PopUp&utm_campaign=Trial_Conversion&utm_content=Countdown.v1');
    } else {
      window.open(
        'https://shop.quark.com/default.aspx?utm_source=QXP_App&utm_medium=PopUp&utm_campaign=Trial_Conversion&utm_content=Countdown.v1',
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
