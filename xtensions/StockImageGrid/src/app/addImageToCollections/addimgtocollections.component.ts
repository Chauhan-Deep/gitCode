import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-addimgtocollections',
  templateUrl: './addimgtocollections.component.html',
  styleUrls: ['./addimgtocollections.component.css']
})
export class AddImageToCollectionsComponent implements OnInit {

  constructor() {
  }

  ngOnInit(): void {
  }

  handleButtonClicked() {
  }
  closeOKDialog() {
  }
  closeCancelDialog() {
    const stockImageXTID = 1431525457;
    if ((window as any).XPress) {
      (window as any).XPress.api.invokeXTApi(stockImageXTID, 'XTSendMessage', 'AddImageToCollectionDialogCanceled');
    }
  }
}

// add chrome to the Window context so typescript stops complaining
declare global {
  interface Window {
    chrome: any;
  }
}
