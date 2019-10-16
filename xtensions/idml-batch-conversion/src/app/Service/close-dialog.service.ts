import { Injectable, EventEmitter } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CloseDialogService {
  private canCloseDialog = true;
  showHideCloseButtonEvent = new EventEmitter<any>();

  constructor() { }

  showClose() {
    this.canCloseDialog = true;
    this.emitEvent();
  }

  hideClose() {
    this.canCloseDialog = false;
    this.emitEvent();
  }

  isCloseButtonVisible() {
    return this.canCloseDialog;
  }

  emitEvent() {
    this.showHideCloseButtonEvent.emit(this.canCloseDialog);
  }

  closeDialog() {
    if (this.canCloseDialog && (window as any).XPress) {
      (window as any).app.dialogs.closeDialog();
    }
  }

}
