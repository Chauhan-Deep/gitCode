import { Component, OnInit, ElementRef, HostListener, ViewChild, OnDestroy, AfterViewInit } from '@angular/core';

import { NotificationService } from '../notification/notification.service';

@Component({
  selector: 'qrk-feedback-screen',
  templateUrl: './feedback-screen.component.html',
  styleUrls: ['./feedback-screen.component.scss']
})
export class FeedbackScreenComponent implements OnInit, OnDestroy, AfterViewInit {
  SUCCESS = 1;

  imageOpacity = 1;
  loaderDisplay = 'none';
  ratingNumbers;
  disabled = true;
  isOnline = navigator.onLine;

  headerMessage;
  mainHeader;
  disclaimer;

  private _userRating;
  private _recordId;
  private _isEscapeOnEl = false;
  private _doSubmit = false;
  private _sessionCreated = false;
  private _feedbackData = {};
  private _productInfo;

  @ViewChild('nps') npsEl;
  @ViewChild('textArea') textAreaEl;
  @ViewChild('email') emailTextEl;
  @ViewChild('contactCheckbox') contactCheckboxEl;

  constructor(private notificationService: NotificationService,
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
    this._productInfo = (<any>window).XPress.api.invokeApi('XTGetProductInfo', '');
    this.getAccessToken();
  }

  getAccessToken() {
    if (navigator.onLine && ((<any>window).XPress)) {
      (<any>window).salesforce.getAccessToken(this.getAccessTokenHandler.bind(this));
    } else {
      this._sessionCreated = false;
    }
  }

  getAccessTokenHandler(response) {
    console.log('AccessTokenResponse: ' + response);

    if (JSON.parse(response).request_status === this.SUCCESS) {
      this._sessionCreated = true;
      (<any>window).salesforce.getLicense(this._productInfo.fullSerialNumber, this.getLicenseHandler.bind(this));
    } else {
      this._sessionCreated = false;
      if (this._doSubmit) {
        this.closeDialog();
      }
    }
  }

  getLicenseHandler(response) {
    console.log('GetLicenseResponse: ' + response);
    const responseJson = JSON.parse(response);

    if (responseJson.request_status === this.SUCCESS && responseJson.totalSize > 0) {
      this._recordId = responseJson.records[0].Id;
      if (this._doSubmit) {
        this.submitFeedback(null);
      }
    } else {
      this._sessionCreated = false;
      if (this._doSubmit) {
        this.closeDialog();
      }
    }
  }

  submitFeedback(event) {
    if (this._doSubmit || !this.validateEmail()) {
      this.loaderDisplay = 'block';
      this.notificationService.hide();

      if (navigator.onLine && ((<any>window).XPress)) {
        let userEmail = '';

        if (!this.emailTextEl.nativeElement.disabled) {
          userEmail = this.emailTextEl.nativeElement.value;
        }
        const body = {
          'Comments__c': this.textAreaEl.nativeElement.value,
          'Product_Version__c': this._productInfo.version,
          'User_Detail__c': userEmail,
          'Product_Score__c': this._userRating,
          'Build_Number__c': this._productInfo.build,
          'License__c': this._recordId ? this._recordId : -1,
          'name': this._productInfo.name
        };

        const feedbackBodyString = JSON.stringify(body);
        this._feedbackData['feedback'] = body;

        this.saveUserFeedback(false);

        if (this._sessionCreated) {
          (<any>window).salesforce.sendFeedback(feedbackBodyString, this.sendFeedbackHandler.bind(this));
        } else if (!this._doSubmit) {
          this._doSubmit = true;
          this.getAccessToken();
        } else {
          this.closeDialog();
        }
      }
    }
    if (event) {
      event.preventDefault();
    }
  }

  sendFeedbackHandler(response) {
    console.log('SendFeedbackResponse: ' + response);
    const responseJson = JSON.parse(response);

    if (responseJson.request_status === this.SUCCESS) {
      if (responseJson.salesforce_error) {
        const error = JSON.parse(responseJson.salesforce_error);

        if (error.errorCode === 'INVALID_SESSION_ID') {
          this._doSubmit = true;
          this.loaderDisplay = 'block';
          this.getAccessToken();
        } else {
          this.handleSubmitResult(true);
        }
      }
      if (responseJson.success) {
        this.handleSubmitResult(false);
      } else {
        this.handleSubmitResult(true);
      }
    } else {
      this.handleSubmitResult(true);
    }
  }

  handleSubmitResult(showError) {
    this.loaderDisplay = 'none';
    if (showError) {
      this.saveUserFeedback(false);
      this.notificationService.alwaysShow('notification-failure');
    } else {
      this.saveUserFeedback(true);
    }
    setTimeout(() => {
      (<any>window).app.dialogs.closeDialog();
    },
      1000);
  }

  showConnectionStatus() {
    this.loaderDisplay = 'none';
    if (navigator.onLine) {
      this.isOnline = true;
      if (this._userRating !== '') {
        this.disabled = false;
      }
      this.notificationService.hide();
    } else {
      this.isOnline = false;
      this.disabled = true;
      this.notificationService.alwaysShow('notification-offline');
    }
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

  validateEmail() {
    if (!this.contactCheckboxEl.nativeElement.checked) {
      return false;
    }
    this.notificationService.hide();

    if (this.emailTextEl.nativeElement.value.length) {
      const regexPattern = new RegExp('^[a-zA-Z](\.?[a-zA-Z0-9_-]+)*@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]{2,})+$');

      if (!regexPattern.test(this.emailTextEl.nativeElement.value)) {
        this.notificationService.show('invalid-email-error');
        this.emailTextEl.nativeElement.focus();
        return true;
      }
    } else {
      this.notificationService.show('empty-email-error');
      this.emailTextEl.nativeElement.focus();
      return true;
    }

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

  closeDialog(submitted = false) {
    if ((<any>window).app) {
      this.saveUserFeedback(submitted);
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
      if (this.loaderDisplay !== 'block') {
        this.closeDialog(navigator.onLine);
      }
    }
  }

  saveUserFeedback(submitted) {
    let feedback = this._feedbackData['feedback'];
    if (feedback) {
      feedback['Product_Version__c'] = this._productInfo.version;
    } else {
      feedback = {
        'Product_Version__c': this._productInfo.version
      };
      this._feedbackData['feedback'] = feedback;
    }

    const appdata = {
      'submitted': submitted,
      'version_rule': 2,
      'days_rule': 7
    };
    this._feedbackData['appdata'] = appdata;

    const file = (<any>window).XPress.api.invokeApi('XTGetPreferencesDir', '').dir + '/Feedback.json';
    (<any>window).fs.writeFileSync(file, JSON.stringify(this._feedbackData));
  }

  ngOnDestroy() {
    window.removeEventListener('online', this.showConnectionStatus.bind(this));
    window.removeEventListener('offline', this.showConnectionStatus.bind(this));
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
