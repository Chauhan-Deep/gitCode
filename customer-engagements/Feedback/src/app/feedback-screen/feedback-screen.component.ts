import { Component, OnInit, ElementRef, HostListener, ViewChild, OnDestroy, AfterViewInit } from '@angular/core';

import { SalesforceService } from '../salesforce/salesforce.service';
import { NotificationService } from '../notification/notification.service';

@Component({
  selector: 'qrk-feedback-screen',
  templateUrl: './feedback-screen.component.html',
  styleUrls: ['./feedback-screen.component.scss']
})
export class FeedbackScreenComponent implements OnInit, OnDestroy, AfterViewInit {
  imageOpacity = 1;
  loaderDisplay = 'none';
  ratingNumbers;
  disabled = true;

  headerMessage;
  mainHeader;
  disclaimer;

  private _userRating;
  private _token;
  private _isEscapeOnEl = false;

  @ViewChild('nps') npsEl;
  @ViewChild('textArea') textAreaEl;
  @ViewChild('email') emailTextEl;
  @ViewChild('contactCheckbox') contactCheckboxEl;

  constructor(private salesforceService: SalesforceService,
    private notificationService: NotificationService,
    private el: ElementRef) {
    this.headerMessage = 'headerMessage';
    this.mainHeader = 'mainHeader';
    this.disclaimer = 'disclaimer';
  }

  ngOnInit() {
    this.ratingNumbers = Array(11).fill(1).map((x, i) => i);
    window.addEventListener('online', this.showConnectionStatus.bind(this));
    window.addEventListener('offline', this.showConnectionStatus.bind(this));
    this.emailTextEl.nativeElement.disabled = true;
  }

  ngAfterViewInit() {
    this.el.nativeElement.getElementsByClassName('privacy-statement')[0].addEventListener('click', this.openPrivacyPolicy.bind(this));
  }

  showConnectionStatus() {
    if (navigator.onLine) {
      if (this._userRating !== '') {
        this.disabled = false;
      }
      this.notificationService.hide();
    } else {
      this.disabled = true;
      this.notificationService.alwaysShow('notification-offline');
    }
  }

  ngOnDestroy() {
    window.removeEventListener('online', this.showConnectionStatus.bind(this));
    window.removeEventListener('offline', this.showConnectionStatus.bind(this));
  }

  selectCheckbox(event) {
    const checkboxEls = this.npsEl.nativeElement.getElementsByClassName('npsCheckbox');
    for (let i = 0; i < checkboxEls.length; i++) {
      if (event.currentTarget !== checkboxEls[i]) {
        checkboxEls[i].checked = false;
      }
    }
    if (event.currentTarget.checked) {
      this.disabled = false;
      this._userRating = event.currentTarget.value;
    } else {
      this._userRating = '';
      this.disabled = true;
    }
  }

  showError() {
    this.notificationService.hide();
    if (this.emailTextEl.nativeElement.value.length) {
      if (this.emailTextEl.nativeElement.validity.patternMismatch) {
        this.notificationService.show('invalid-email-error');
      }
    } else {
      this.notificationService.show('empty-email-error');
    }

    this.emailTextEl.nativeElement.focus();
    return false;
  }

  contactMe(event) {
    const emailEl = this.emailTextEl.nativeElement;

    if (!this.contactCheckboxEl.nativeElement.checked) {
      emailEl.disabled = true;
    } else {
      emailEl.disabled = false;
      emailEl.focus();
    }
  }

  submitFeedback(event) {
    this.loaderDisplay = 'block';
    this.notificationService.hide();
    if (navigator.onLine) {
      this.salesforceService.getToken().subscribe(this.getTokenSuccessHandler.bind(this), this.submitFailureHandler.bind(this));
    }
    event.preventDefault();
  }

  getTokenSuccessHandler(success) {
    console.log(success.access_token);
    this._token = success.access_token;
    if (((<any>window).XPress)) {
      const productInfo = (<any>window).XPress.api.invokeApi('XTGetProductInfo', '');
      this.salesforceService.getSerialNumber(success.access_token, productInfo.fullSerialNumber)
        .subscribe(this.getSerialNumberSuccessHandler.bind(this), this.submitFailureHandler.bind(this));
    }
  }

  getSerialNumberSuccessHandler(success) {
    console.log(success);
    if (((<any>window).XPress)) {
      const productInfo = (<any>window).XPress.api.invokeApi('XTGetProductInfo', '');

      try {
        let userEmail = '';

        if (!this.emailTextEl.nativeElement.disabled) {
          userEmail = this.emailTextEl.nativeElement.value;
        }
        this.salesforceService.sendFeedback(this._token, this._userRating, userEmail,
          this.textAreaEl.nativeElement.value, productInfo.version, success.records[0].Id, productInfo.name, productInfo.build)
          .subscribe(this.submitSuccessHandler.bind(this), this.submitFailureHandler.bind(this));
      } catch (error) {
        this.submitFailureHandler(error);
      }
    }
  }

  submitSuccessHandler(success) {
    console.log(success);
    this.loaderDisplay = 'none';
    if ((<any>window).app) {
      setTimeout(() => {
        (<any>window).app.dialogs.closeDialog();
      },
        1000);
    }
  }

  submitFailureHandler(error) {
    if (navigator.onLine) {
      this.notificationService.alwaysShow('notification-failure');
    } else {
      this.notificationService.alwaysShow('notification-offline');
    }
    console.log(error);
    this.loaderDisplay = 'none';
  }

  closeDialog() {
    if ((<any>window).app) {
      (<any>window).app.dialogs.closeDialog();
    }
  }

  @HostListener('window:keydown.escape', ['$event'])
  onEscape(event) {
    if (this._isEscapeOnEl) {
      this._isEscapeOnEl = false;
      this.textAreaEl.nativeElement.blur();
      this.emailTextEl.nativeElement.blur();
    } else {
      this.closeDialog();
    }
  }

  onBlur(event) {
    this._isEscapeOnEl = true;
  }

  openPrivacyPolicy() {
    const privacyPolicyUrl = 'http://www.quark.com/en/About_Quark/Legal/Privacy_Policy.aspx';

    if ((<any>window).app) {
      (<any>window).app.launchApp(privacyPolicyUrl);
    } else {
      window.open(privacyPolicyUrl, '_blank');
    }
  }
}
