import { Component, OnInit, HostListener } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

import { TranslateService } from '../translate/translate.service';

@Component({
  selector: 'qrk-trial-screen',
  templateUrl: './trial-screen.component.html',
  styleUrls: ['./trial-screen.component.scss']
})
export class TrialScreenComponent implements OnInit {
  daysRemaining;
  offerURL;
  numOfDays: number;
  offerAvailable: boolean;

  constructor(private translateService: TranslateService, private domSanitizer: DomSanitizer) { }

  ngOnInit() {
    this.offerAvailable = (<any>window).navigator.onLine;
    const days = ((<any>window).XPress) ?
      (<any>window).XPress.api.invokeApi('XTGetPendingDaysOfTrialMode', '').numOfDays : 29;
    if (days > 1) {
      this.daysRemaining = this.translateService.localize('days').replace('^1', days);
    } else {
      this.daysRemaining = this.translateService.localize('day').replace('^1', days);
    }

    this.offerURL = this.domSanitizer.bypassSecurityTrustUrl('https://content.quark.com/' +
        this.translateService.currentLanguage + '/' + days + '/offer.png');
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

  offerNotAvailable() {
    this.offerAvailable = false;
  }

  closeDialog() {
    if ((<any>window).app) {
      if (this.numOfDays > 0) {
        (<any>window).app.dialogs.closeDialog();
      } else {
        (<any>window).XPress.api.invokeGuiApi('XTQuitXPress', '');
      }
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
