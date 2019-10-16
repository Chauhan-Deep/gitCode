import { Component, HostListener, OnInit, OnDestroy } from '@angular/core';

import { TranslateService } from './translate/translate.service';
import { CloseDialogService } from './Service/close-dialog.service';

@Component({
  selector: 'qrk-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'idml-batch-conversion';
  requiresCloseButton: boolean;
  showHideCloseButtonEvent: any;

  constructor(
    private translateService: TranslateService,
    private closeDialogService: CloseDialogService) {

    let browserLang = 'en-US';

    if ((window as any).app) {
      browserLang = (window as any).app.language.code;
    }

    this.translateService.use(browserLang);
    this.requiresCloseButton = true;
  }

  ngOnInit() {
    this.subscribeEvents();
  }

  ngOnDestroy() {
    this.unsubscribeEvents();
  }

  unsubscribeEvents() {
    if (this.showHideCloseButtonEvent) {
      this.showHideCloseButtonEvent.unsubscribe();
      this.showHideCloseButtonEvent = undefined;
    }
  }

  subscribeEvents(): void {
    this.showHideCloseButtonEvent = this.closeDialogService.showHideCloseButtonEvent.subscribe(this.showHideCloseButton.bind(this));
  }

  showHideCloseButton(requiresClose) {
    this.requiresCloseButton = requiresClose;
  }

  closeWindow() {
    this.closeDialogService.closeDialog();
  }

  @HostListener('window:keydown.escape', ['$event'])
  onEscape(event) {
    this.closeWindow();
  }
}
