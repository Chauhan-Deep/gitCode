import { Component, OnInit, ChangeDetectorRef, NgZone, HostListener } from '@angular/core';

@Component({
  selector: 'app-managecollecton-list',
  templateUrl: './manageCollection-list.component.html',
  styleUrls: ['./manageCollection-list.component.css']
})
export class ManageCollectionsListComponent implements OnInit {
  collectionsData: CollectionsData[] = [];

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
    if ((window as any).XPress) {
      (window as any).XPress.api.invokeXTApi(stockImageXTID, 'XTSendMessage', 'ManageCollectionsLoaded');
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
  {
    if (jsonResponse.message === 'CollectionsData') {
      this.collectionsData = [];
      window.scrollTo(0, 0);
      // To appease TSLint
      Object.keys(jsonResponseData).map(key2 => {
        this.collectionsData.push(jsonResponseData[key2]);
      });
      this.ref.detectChanges();
    }
    if (jsonResponse.message === 'ManageNewCollectionData') {
      Object.keys(jsonResponseData).map(key2 => {
        this.collectionsData.push(jsonResponseData[key2]);
      });
      this.ref.detectChanges();
    }
    if (jsonResponse.message === 'ManageEditCollectionData') {
      for (const cData of this.collectionsData) {
        if (cData.mCollectionName === jsonResponseData[0].mCollectionName) {
          cData.mEditedCollectionName = jsonResponseData[0].mEditedCollectionName;
          this.ref.detectChanges();

          break;
        }
      }
    }
    if (jsonResponse.message === 'EditCollectionData') {
      let manageCollectionsJson: string;
      const arrayToString = JSON.stringify(this.collectionsData);

      manageCollectionsJson = '{\"EditCollectionDataList\":';
      manageCollectionsJson += arrayToString;
      manageCollectionsJson += '}';
      const stockImageXTID = 1431525457;
      if ((window as any).XPress) {
        (window as any).XPress.api.invokeXTApi(stockImageXTID, 'XTSendMessage', manageCollectionsJson);
      }
    }
  }
  }
  closeOKDialog() {
    let manageCollectionsJson: string;
    const arrayToString = JSON.stringify(this.collectionsData);

    manageCollectionsJson = '{\"ManageCollectionsOK\":';
    manageCollectionsJson += arrayToString;
    manageCollectionsJson += '}';
    const stockImageXTID = 1431525457;
    if ((window as any).XPress) {
      (window as any).XPress.api.invokeXTApi(stockImageXTID, 'XTSendMessage', manageCollectionsJson);
    }
  }
  closeCancelDialog() {
    const stockImageXTID = 1431525457;
    if ((window as any).XPress) {
      (window as any).XPress.api.invokeXTApi(stockImageXTID, 'XTSendMessage', 'ManageCollectionsDialogCanceled');
    }
  }
  handleButtonClicked() {
    let manageCollectionsJson: string;
    const arrayToString = JSON.stringify(this.collectionsData);

    manageCollectionsJson = '{\"ManageNewCollection\":';
    manageCollectionsJson += arrayToString;
    manageCollectionsJson += '}';
    const stockImageXTID = 1431525457;
    if ((window as any).XPress) {
      (window as any).XPress.api.invokeXTApi(stockImageXTID, 'XTSendMessage', manageCollectionsJson);
    }
  }
  @HostListener('document:keydown.enter', ['$event']) onKeydownEnterHandler(event: KeyboardEvent) {
    this.closeOKDialog();
  }
  @HostListener('document:keydown.escape', ['$event']) onKeydownHandler(event: KeyboardEvent) {
    this.closeCancelDialog();
  }
}

export class CollectionsData {
  mCollectionName?: string;
  mEditedCollectionName?: string;
  mMarkDeleted?: string;
  mIsNewCollection?: string;
}

// add chrome to the Window context so typescript stops complaining
declare global {
  interface Window {
    chrome: any;
  }
}
