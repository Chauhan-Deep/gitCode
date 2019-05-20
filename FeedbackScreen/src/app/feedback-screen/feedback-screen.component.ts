import { Component, OnInit, HostListener, ViewChild, OnDestroy } from '@angular/core';

import { SalesforceService } from '../salesforce/salesforce.service';
import { NotificationService } from '../notification/notification.service';

@Component({
  selector: 'qrk-feedback-screen',
  templateUrl: './feedback-screen.component.html',
  styleUrls: ['./feedback-screen.component.scss']
})
export class FeedbackScreenComponent implements OnInit, OnDestroy {
  imageOpacity = 1;
  loaderDisplay = 'none';
  ratingNumbers;
  disabled = true;

  private _userRating;
  private _token;

  @ViewChild('nps') npsEl;
  @ViewChild('textArea') textAreaEl;
  @ViewChild('email') emailTextEl;

  constructor(private salesforceService: SalesforceService, private notificationService: NotificationService) { }

  ngOnInit() {
    this.ratingNumbers = Array(11).fill(1).map((x, i) => i);
    window.addEventListener('online', this.showConnectionStatus.bind(this));
    window.addEventListener('offline', this.showConnectionStatus.bind(this));
  }

  showConnectionStatus() {
    if (navigator.onLine) {
      if (this._userRating !== '') {
        this.disabled = false;
      }
      this.notificationService.hide();
    } else {
      this.disabled = true;
      this.notificationService.alwaysShow('No Internet Connection');
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

  submitFeedback(event) {
    this.loaderDisplay = 'block';
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
        this.salesforceService.sendFeedback(this._token, this._userRating, this.textAreaEl.nativeElement.value,
          this.emailTextEl.nativeElement.value, productInfo.version, success.records[0].Id, productInfo.name)
          .subscribe(this.submitSuccessHandler.bind(this), this.submitFailureHandler.bind(this));
      } catch (error) {
        this.submitFailureHandler(error);
      }
    }
  }

  submitSuccessHandler(success) {
    console.log(success);
    this.loaderDisplay = 'none';
    this.notificationService.show('Your feedback is submitted succesfully');
    if ((<any>window).app) {
      setTimeout(() => {
        (<any>window).app.dialogs.closeDialog();
      },
        1000);
    }
  }

  submitFailureHandler(error) {
    if (navigator.onLine) {
      this.notificationService.alwaysShow('Failed to submit your feedback.');
    } else {
      this.notificationService.alwaysShow('No Internet Connection.');
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
    this.closeDialog();
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
