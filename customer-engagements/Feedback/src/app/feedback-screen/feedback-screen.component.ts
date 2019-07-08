import { Component, OnInit, ElementRef, HostListener, ViewChild, OnDestroy, AfterViewInit } from '@angular/core';

import { NotificationService } from '../notification/notification.service';

enum FEEDBACK {
  SUBMITTED = 1,
  NEVER_SHOW,
  PENDING,
  NOT_SUBMITTED
}

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
  wrapperVisibility = 'hidden';

  headerMessage;
  mainHeader;
  disclaimer;

  private _userRating;
  private _recordId;
  private _accountId;
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
    this.showConnectionStatus();
    this.el.nativeElement.getElementsByClassName('privacy-statement')[0].addEventListener('click', this.openPrivacyPolicy.bind(this));

    setTimeout(() => {
      const disclaimerTop = this.el.nativeElement.getElementsByClassName('nps__disclaimer')[0].offsetTop;
      const sendTop = this.el.nativeElement.getElementsByClassName('npsSubmit')[0].offsetTop;
      const sendHeight = this.el.nativeElement.getElementsByClassName('npsSubmit')[0].offsetHeight;

      const difference = disclaimerTop - (sendTop + sendHeight);

      if (difference > 50) {
        this.el.nativeElement.getElementsByClassName('npsForm')[0].classList.add('npsFormBig');
      } else if (difference > 25) {
        this.el.nativeElement.getElementsByClassName('npsForm')[0].classList.add('npsFormMedium');
      }
      this.wrapperVisibility = 'visible';
    });

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
      this._accountId = responseJson.records[0].Account__c;
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
      if (navigator.onLine && ((<any>window).XPress)) {
        this.notificationService.hide();
        this.loaderDisplay = 'block';
        let userEmail = '';

        if (!this.emailTextEl.nativeElement.disabled) {
          userEmail = this.emailTextEl.nativeElement.value;
        }
        const userName = (<any>window).XPress.api.invokeApi('XTGetUserName', '').name;
        const platformName = (<any>window).XPress.api.invokeApi('XTGetPlatform', '').name;

        const body = {
          'Comments__c': this.textAreaEl.nativeElement.value,
          'Product_Version__c': this._productInfo.version,
          'User_Detail__c': userName,
          'Product_Score__c': this._userRating,
          'Build_Number__c': this._productInfo.build,
          'License__c': this._recordId ? this._recordId : -1,
          'Account__c': this._accountId ? this._accountId : -1,
          'Contact_Email__c': userEmail,
          'Platform__c': platformName,
          'name': this._productInfo.name
        };

        const feedbackBodyString = JSON.stringify(body);
        this._feedbackData['feedback'] = body;

        this.saveUserFeedback(FEEDBACK.NOT_SUBMITTED);

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
      let doHandle = true;
      if (responseJson.salesforce_error) {
        let error = JSON.parse(responseJson.salesforce_error);

        error = error[0];
        if (error.errorCode === 'INVALID_SESSION_ID') {
          doHandle = false;
          this._doSubmit = true;
          this.loaderDisplay = 'block';
          this.getAccessToken();
        } else if (error.errorCode === 'JSON_PARSER_ERROR') {
          this.handleSubmitResult(false);
        } else {
          this.handleSubmitResult(true);
        }
      }
      if (doHandle) {
        if (responseJson.success) {
          this.handleSubmitResult(false);
        } else {
          this.handleSubmitResult(true);
        }
      }
    } else {
      if (navigator.onLine) {
        this.handleSubmitResult(true);
      }
    }
  }

  handleSubmitResult(showError) {
    this.loaderDisplay = 'none';
    if (showError) {
      this.saveUserFeedback(FEEDBACK.NOT_SUBMITTED);
      this.notificationService.alwaysShow('notification-failure');
    } else {
      this.saveUserFeedback(FEEDBACK.SUBMITTED);
    }
    setTimeout(() => {
      (<any>window).app.dialogs.closeDialog();
    },
      1000);
  }

  showConnectionStatus() {
    this.loaderDisplay = 'none';
    if (navigator.onLine) {
      if (this._userRating && this._userRating !== '') {
        this.disabled = false;
      } else {
        this.disabled = true;
      }
      this.notificationService.hide();
      if (!this.emailTextEl.nativeElement.disabled) {
        this.validateEmail();
      }
    } else {
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
      this.disabled = navigator.onLine ? false : true;
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
      const regexPattern = new RegExp('^[a-zA-Z](\\.?[a-zA-Z0-9_-]+)*@[a-zA-Z0-9]+(?:\\.[a-zA-Z0-9-]{2,})+$');

      if (!regexPattern.test(this.emailTextEl.nativeElement.value)) {
        this.notificationService.alwaysShow('invalid-email-error');
        this.emailTextEl.nativeElement.focus();
        return true;
      }
    } else {
      this.notificationService.alwaysShow('empty-email-error');
      this.emailTextEl.nativeElement.focus();
      return true;
    }

    return false;
  }

  contactMe(event) {
    const emailEl = this.emailTextEl.nativeElement;

    if (!this.contactCheckboxEl.nativeElement.checked) {
      emailEl.disabled = true;
      this.notificationService.hide();
      this.showConnectionStatus();
    } else {
      emailEl.disabled = false;
      emailEl.focus();
    }
  }

  closeDialog(submitted: FEEDBACK = FEEDBACK.NOT_SUBMITTED) {
    if ((<any>window).app) {
      if (submitted === FEEDBACK.NEVER_SHOW && this.getQueryString('autoPopup')) {
        this.saveUserFeedback(submitted);
      } else if (submitted === FEEDBACK.NOT_SUBMITTED) {
        this.saveUserFeedback(submitted);
      }
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
        this.closeDialog(FEEDBACK.NEVER_SHOW);
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
      'days_rule': 5,
      'total_retries': 5,
      'retries': 0
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
    let privacyPolicyUrl = 'https://www.quark.com/lang_code/About_Quark/Legal/Privacy_Policy.aspx';

    if ((<any>window).app) {
      const langCode = ((<any>window).app.language.code).split('-')[0];

      if (langCode === 'fr' || langCode === 'de') {
        privacyPolicyUrl = privacyPolicyUrl.replace('lang_code', langCode);
      } else if (langCode === 'ja') {
        privacyPolicyUrl = privacyPolicyUrl.replace('lang_code', 'jp');
      } else {
        privacyPolicyUrl = privacyPolicyUrl.replace('/lang_code', '');
      }

      (<any>window).app.launchApp(privacyPolicyUrl);
    } else {
      window.open(privacyPolicyUrl.replace('/lang_code', ''), '_blank');
    }
  }

  getQueryString(field) {
    const url = new URL(window.location.href);
    const query_string = url.search;
    const search_params = new URLSearchParams(query_string);

    return search_params.get(field);
  }
}
