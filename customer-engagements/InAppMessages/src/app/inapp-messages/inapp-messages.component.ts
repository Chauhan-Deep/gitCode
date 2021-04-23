import { Component, OnInit, HostListener, ViewChild, ElementRef, ViewContainerRef } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { HttpClient, HttpResponse} from '@angular/common/http';

import { TranslateService } from '../translate/translate.service';

@Component({
  selector: 'qrk-inapp-messages',
    templateUrl: './inapp-messages.component.html',
    styleUrls: ['./inapp-messages.component.scss']
})
export class InAppMessagesComponent implements OnInit {
@ViewChild('iframeX', { read: ElementRef })
iframeX: ElementRef;
isRemindMeCheckChecked = false;
isDontShowCheckChecked = false;

  daysRemaining;
  offerURLStr;
  safeOfferURL;
  numOfDays: number;
  isOnline: boolean;
  arrived: boolean;

  numOfDaysStr;
  digit1 = 0;
  digit2 = 0;
  dateStrId = '';

  constructor(private translateService: TranslateService, private domSanitizer: DomSanitizer, private httpClient: HttpClient) { }


  onload(iframeElement) {
    console.log('onload --------------------');

    console.log('onload = ' + iframeElement.contentWindow.document.readyState);
    const hostElement = this.iframeX;

   // setTimeout(() => {
     if (iframeElement.contentWindow.document.readyState === 'complete') {
      iframeElement.contentWindow.document.getElementById('digit-1').innerText = this.digit1;
      iframeElement.contentWindow.document.getElementById('digit-2').innerText = this.digit1;

      iframeElement.contentWindow.document.getElementById('digit-3').innerText = this.digit2;
      iframeElement.contentWindow.document.getElementById('digit-4').innerText = this.digit2;
      // iframeElement.contentWindow.document.getElementById("modal-one").setAttribute("style","padding:0px;");

      if (iframeElement.contentWindow.document.getElementById('expiryDate') != null) {
        console.log('expiryDate.innerText set..'); // function called
        iframeElement.contentWindow.document.getElementById('expiryDate').innerText = this.dateStrId;
      }

      if (iframeElement.contentWindow.document.getElementById('daysDigits') != null) {
        console.log('daysDigits.daysDigits set..'); // function called
        iframeElement.contentWindow.document.getElementById('daysDigits').innerText = this.numOfDaysStr;
      }
     }

     console.log('days = ' + this.numOfDays); // function called
     console.log('this.digit1 = ' + this.digit1); // function called
     console.log('this.digit2 = ' + this.digit2); // function called
     console.log('expiryDate = ' + this.dateStrId); // function called

   // }, 20);
  }

  ngOnInit() {
    const days = ((<any>window).XPress) ?
      (<any>window).XPress.api.invokeApi('XTGetAppMaintenanceExpiryDays', '').numOfDays : 29;

      this.numOfDaysStr = days;
      const dateStr = ((<any>window).XPress) ?
      (<any>window).XPress.api.invokeApi('XTGetAppMaintenanceExpiryDateString', '').dateString : '_';

      this.dateStrId = dateStr;
      console.log('days =' + days); // function called
      console.log('dateString =' + this.dateStrId); // function called

    if (days > 1) {
      this.daysRemaining = this.translateService.localize('days').replace('^1', days);
    } else {
      this.daysRemaining = this.translateService.localize('day').replace('^1', days);
    }

    let urlDays = days;
    if (days >= 0) {
      let noOfdays: number  = days;
      this.digit2 = noOfdays % 10;
      noOfdays = Math.floor(noOfdays / 10);
      this.digit1 = noOfdays % 10;

      if (days <= 60 && days > 45) {
        urlDays = 60;
      } else if (days <= 45 && days > 30) {
        urlDays = 45;
      } else if (days <= 30 && days > 15) {
        urlDays = 30;
      } else if (days <= 15 && days > 7) {
        urlDays = 15;
      } else {
        urlDays = days;
      }
    }

    this.offerURLStr = 'https://www.quark.com/inapp-message/' + this.translateService.currentLanguage + '/' + urlDays + 'days.html';
    if (urlDays === 0) {
      this.offerURLStr = 'https://www.quark.com/inapp-message/'  + this.translateService.currentLanguage + '/expired.html';
   }

    console.log('offerURLStr =' + this.offerURLStr); // function called

    this.httpClient.get('assets/settings.json').subscribe(
      data  => {
        const testURL = data['testURL'];

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
        this.isOnline = true;
        this.arrived = true;
      },
      (error: Response) => {
        this.isOnline = false;
        this.arrived = true;
      }
    );
  }

  RemindMeCheckValue(e) {
    if (e.target.checked) {
      if ((<any>window).app) {
       const key = 'RemindMeAgain';
       const value = '1';
        const apiParams = {
          key,
          value
      };
        (<any>window).XPress.api.invokeGuiApi('XTSetInAppPreferenceKeyValue', apiParams);
      }
    } else {
      if ((<any>window).app) {
        const key = 'RemindMeAgain';
        const value = '0';
         const apiParams = {
           key,
           value
       };
       (<any>window).XPress.api.invokeGuiApi('XTSetInAppPreferenceKeyValue', apiParams);
      }
    }
  }

  DontShowCheckValue(e) {
    if (e.target.checked) {
      if ((<any>window).app) {
       const key = 'DontShowAgain';
       const value = '1';
        const apiParams = {
          key,
          value
      };
        (<any>window).XPress.api.invokeGuiApi('XTSetInAppPreferenceKeyValue', apiParams);
      }
    } else {
      if ((<any>window).app) {
        const key = 'DontShowAgain';
        const value = '0';
         const apiParams = {
           key,
           value
       };
       (<any>window).XPress.api.invokeGuiApi('XTSetInAppPreferenceKeyValue', apiParams);
      }
    }
  }

  remindMeAction(e) {
    this.isRemindMeCheckChecked = !this.isRemindMeCheckChecked;
    if (this.isRemindMeCheckChecked) {
      if ((<any>window).app) {
       const key = 'RemindMeAgain';
       const value = '1';
        const apiParams = {
          key,
          value
      };
        (<any>window).XPress.api.invokeGuiApi('XTSetInAppPreferenceKeyValue', apiParams);
      }
    } else {
      if ((<any>window).app) {
        const key = 'RemindMeAgain';
        const value = '0';
         const apiParams = {
           key,
           value
       };
       (<any>window).XPress.api.invokeGuiApi('XTSetInAppPreferenceKeyValue', apiParams);
      }
    }
  }

  dontShowAction(e) {
    this.isDontShowCheckChecked = !this.isDontShowCheckChecked;

    if (this.isDontShowCheckChecked) {
      if ((<any>window).app) {
       const key = 'DontShowAgain';
       const value = '1';
        const apiParams = {
          key,
          value
      };
        (<any>window).XPress.api.invokeGuiApi('XTSetInAppPreferenceKeyValue', apiParams);
      }
    } else {
      if ((<any>window).app) {
        const key = 'DontShowAgain';
        const value = '0';
         const apiParams = {
           key,
           value
       };
       (<any>window).XPress.api.invokeGuiApi('XTSetInAppPreferenceKeyValue', apiParams);
      }
    }
  }

  closeDialog() {
    if ((<any>window).app) {
      (<any>window).app.dialogs.closeDialog();
    }
  }

  @HostListener('window:keydown.escape', ['$event'])
  onEscape(event) {
    this.closeDialog();
  }
}
