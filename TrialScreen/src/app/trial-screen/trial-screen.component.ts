import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';

@Component({
  selector: 'qrk-trial-screen',
  templateUrl: './trial-screen.component.html',
  styleUrls: ['./trial-screen.component.scss']
})
export class TrialScreenComponent implements OnInit {
  @ViewChild('continueTrialBtn')
  continueBtnElRef: ElementRef;
  @ViewChild('overlay')
  overlayElRef: ElementRef;

  daysRemaining = 29;

  constructor() { }

  ngOnInit() {
    this.daysRemaining = ((<any>window).XPress) ? (<any>window).XPress.api.invokeApi('XTGetPendingDaysOfTrialMode', '').numOfDays : 29;
  }

  isLoaded() {
    this.overlayElRef.nativeElement.style.top = this.continueBtnElRef.nativeElement.offsetTop -
      this.overlayElRef.nativeElement.offsetHeight + 8 + 'px';
  }

  buyNow() {
    if ((<any>window).app) {
      (<any>window).app.launchApp('https://shop.quark.com/default.aspx');
    } else {
      window.open('https://shop.quark.com/default.aspx', '_blank');
    }
  }

  continueTrial() {
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
