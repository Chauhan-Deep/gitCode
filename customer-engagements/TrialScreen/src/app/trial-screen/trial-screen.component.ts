import { Component, OnInit, HostListener } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { HttpClient, HttpResponse} from '@angular/common/http';

import { TranslateService } from '../translate/translate.service';

@Component({
  selector: 'qrk-trial-screen',
  templateUrl: './trial-screen.component.html',
  styleUrls: ['./trial-screen.component.scss']
})
export class TrialScreenComponent implements OnInit {
  daysRemaining;
  offerURLStr;
  safeOfferURL;
  numOfDays: number;
  isOnline: boolean;

  constructor(private translateService: TranslateService, private domSanitizer: DomSanitizer, private httpClient: HttpClient) { }

  ngOnInit() {
    this.isOnline = (<any>window).navigator.onLine;
    const days = ((<any>window).XPress) ?
      (<any>window).XPress.api.invokeApi('XTGetPendingDaysOfTrialMode', '').numOfDays : 29;
    if (days > 1) {
      this.daysRemaining = this.translateService.localize('days').replace('^1', days);
    } else {
      this.daysRemaining = this.translateService.localize('day').replace('^1', days);
    }

    this.offerURLStr = 'https://accounts.quark.com/InAppOffers/' + this.translateService.currentLanguage + '/' + days + '.html';

    this.httpClient.get('assets/settings.json').subscribe(
      data  => {
        let testURL = data['testURL'];

        if (testURL) {
          this.offerURLStr = testURL;
        }
        this.initOfferURL();
      },
      (error: Response) => {
        this.initOfferURL();
      },
    );

    this.numOfDays = parseInt(days, 10);
  }

  initOfferURL() {
    this.safeOfferURL = this.domSanitizer.bypassSecurityTrustResourceUrl(this.offerURLStr);
    this.httpClient.head(this.offerURLStr).subscribe(
      response => {
      },
      (error: Response) => {
        this.isOnline = false;
      }
    );
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
