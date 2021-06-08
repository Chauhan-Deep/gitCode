import { Component, OnInit, HostListener, ViewChild, ElementRef, ViewContainerRef } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { HttpClient, HttpResponse } from '@angular/common/http';

import { TranslateService } from '../translate/translate.service';

@Component({
  selector: 'qrk-inapp-messages',
  templateUrl: './inapp-messages.component.html',
  styleUrls: ['./inapp-messages.component.scss']
})
export class InAppMessagesComponent implements OnInit {
  @ViewChild('iframeX', { read: ElementRef })
  iframeX: ElementRef;
  isDontShowCheckChecked = false;

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
    if (this.numOfDaysStr >= 0) {
      if (iframeElement.contentWindow.document.readyState === 'complete') {
        if (iframeElement.contentWindow.document.getElementById('digit-1') != null) {
          iframeElement.contentWindow.document.getElementById('digit-1').innerText = this.digit1;
        }
        if (iframeElement.contentWindow.document.getElementById('digit-2') != null) {
          iframeElement.contentWindow.document.getElementById('digit-2').innerText = this.digit1;
        }

        if (iframeElement.contentWindow.document.getElementById('digit-3') != null) {
          iframeElement.contentWindow.document.getElementById('digit-3').innerText = this.digit2;
        }
        if (iframeElement.contentWindow.document.getElementById('digit-4') != null) {
          iframeElement.contentWindow.document.getElementById('digit-4').innerText = this.digit2;
        }
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
    }

    console.log('days = ' + this.numOfDays); // function called
    console.log('this.digit1 = ' + this.digit1); // function called
    console.log('this.digit2 = ' + this.digit2); // function called
    console.log('expiryDate = ' + this.dateStrId); // function called

    // }, 20);
  }

  ngOnInit() {
    const majorversion = ((<any>window).XPress) ?
      (<any>window).XPress.api.invokeApi('XTGetProductInfo', '').majorversion : 17;
    const minorversion = '0';

    const days = ((<any>window).XPress) ?
      (<any>window).XPress.api.invokeApi('XTGetAppMaintenanceExpiryDays', '').numOfDays : 29;

    this.numOfDaysStr = days;
    const dateStr = ((<any>window).XPress) ?
      (<any>window).XPress.api.invokeApi('XTGetAppMaintenanceExpiryDateString', '').dateString : '_';

    this.dateStrId = dateStr;
    console.log('days =' + days); // function called
    console.log('dateString =' + this.dateStrId); // function called

    let urlDays = days;
    let noOfdays: number = days;
    this.digit2 = noOfdays % 10;
    noOfdays = Math.floor(noOfdays / 10);
    this.digit1 = noOfdays % 10;

    if (majorversion < 17) {
      if (days > 60) {
        urlDays = 60;
      } else if (days <= 60 && days > 30) {
        urlDays = 60;
      } else if (days <= 30 && days > 15) {
        urlDays = 30;
      } else if (days <= 15 && days > 3) {
        urlDays = 15;
      } else if (days <= 3 && days >= 0) {
        urlDays = 3;
      } else if (days < 0 && days > -5) {
        urlDays = -2;
      } else if (days <= -5) {
        urlDays = -5;
      }
    } else if (majorversion >= 17) {
      if (days > 60) {
        urlDays = 60;
      } else if (days <= 60 && days > 30) {
        urlDays = 60;
      } else if (days <= 30 && days > 15) {
        urlDays = 30;
      } else if (days <= 15 && days > 3) {
        urlDays = 15;
      } else if (days <= 3 && days >= 0) {
        urlDays = 3;
      } else if (days < 0 && days > -10) {
        urlDays = -2;
      } else if (days <= -10 && days > -20) {
        urlDays = -10;
      } else if (days <= -20) {
        urlDays = -20;
      }
    }

    console.log('urlDays =' + urlDays); // function called
    console.log('majorversion =' + majorversion); // function called

    if (majorversion < 17) {
      this.offerURLStr = 'https://www.quark.com/inapp-message/' + this.translateService.currentLanguage + '/' + urlDays + 'days.html';
      if (urlDays === -2) {
        this.offerURLStr = 'https://www.quark.com/inapp-message/' + this.translateService.currentLanguage + '/2daysexpired.html';
      } else if (urlDays === -5) {
        this.offerURLStr = 'https://www.quark.com/inapp-message/' + this.translateService.currentLanguage + '/5daysexpired.html';
      }
    }

    if (majorversion >= 17) {
      const versionStr = 'v' + majorversion + '.' + minorversion;

      this.offerURLStr = 'https://www.quark.com/inapp-message/'
          + versionStr + '/' + this.translateService.currentLanguage + '/' + urlDays + 'days.html';
      if (urlDays === -2) {
        this.offerURLStr = 'https://www.quark.com/inapp-message/'
          + versionStr + '/' + this.translateService.currentLanguage + '/2daysexpired.html';
      } else if (urlDays === -10) {
        this.offerURLStr = 'https://www.quark.com/inapp-message/'
          + versionStr + '/' + this.translateService.currentLanguage + '/10daysexpired.html';
      } else if (urlDays === -20) {
        this.offerURLStr = 'https://www.quark.com/inapp-message/'
          + versionStr + '/' + this.translateService.currentLanguage + '/20daysexpired.html';
      }
    }

    console.log('offerURLStr =' + this.offerURLStr); // function called

    this.httpClient.get('assets/settings.json').subscribe(
      data => {
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
