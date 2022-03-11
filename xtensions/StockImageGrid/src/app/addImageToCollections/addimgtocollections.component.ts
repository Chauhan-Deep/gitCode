import { Component, OnInit, ChangeDetectorRef, NgZone } from '@angular/core';

@Component({
  selector: 'app-addimgtocollections',
  templateUrl: './addimgtocollections.component.html',
  styleUrls: ['./addimgtocollections.component.css']
})
export class AddImageToCollectionsComponent implements OnInit {
  private _XT_SENDMESSAGE: number;
  ngZone: NgZone;

  constructor(ngZone: NgZone, private ref: ChangeDetectorRef) {
    this.ngZone = ngZone;
  }

  ngOnInit(): void {
    const stockImageXTID = 1431525457;
    if ((window as any).app) {
      this._XT_SENDMESSAGE = (window as any).XPress.registerQXPCallbackHandler(0, 1636, this.SendMessageCallBackHandler.bind(this));
    }
    window.addEventListener('dragover', e => {
      e.preventDefault();
      e.dataTransfer.effectAllowed = 'none';
      e.dataTransfer.dropEffect = 'none';
    }, false);
    window.addEventListener('drop', e => {
      e.preventDefault();
      e.dataTransfer.effectAllowed = 'none';
      e.dataTransfer.dropEffect = 'none';
    }, false);
  }
  SendMessageCallBackHandler(response) {
  const jsonResponse = JSON.parse(response);
  const jsonResponseData = JSON.parse(jsonResponse.data);

  }
}

// add chrome to the Window context so typescript stops complaining
declare global {
  interface Window {
    chrome: any;
  }
}
