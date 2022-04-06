import { Component, OnInit, ChangeDetectorRef, NgZone, HostListener } from '@angular/core';

@Component({
  selector: 'app-collecton-list',
  templateUrl: './collection-list.component.html',
  styleUrls: ['./collection-list.component.css']
})
export class CollectionsComponent implements OnInit {
  imageCollectionData: ImageCollectionData[] = [];

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
      (window as any).XPress.api.invokeXTApi(stockImageXTID, 'XTSendMessage', 'AddImageToCollectionLoaded');
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
    if (jsonResponse.message === 'CollectionImageData') {
      this.imageCollectionData = [];
      window.scrollTo(0, 0);
      // To appease TSLint
      Object.keys(jsonResponseData).map(key2 => {
        this.imageCollectionData.push(jsonResponseData[key2]);
      });
      this.ref.detectChanges();
    }
    if (jsonResponse.message === 'NewCollectionData') {
      Object.keys(jsonResponseData).map(key2 => {
        this.imageCollectionData.push(jsonResponseData[key2]);
      });
      this.ref.detectChanges();
    }
  }
  }
  closeOKDialog() {
    let addImageToCollectionsJson: string;
    const arrayToString = JSON.stringify(this.imageCollectionData);

    addImageToCollectionsJson = '{\"AddImageInCollectionsOK\":';
    addImageToCollectionsJson += arrayToString;
    addImageToCollectionsJson += '}';
    const stockImageXTID = 1431525457;
    if ((window as any).XPress) {
      (window as any).XPress.api.invokeXTApi(stockImageXTID, 'XTSendMessage', addImageToCollectionsJson);
    }
  }
  closeCancelDialog() {
    const stockImageXTID = 1431525457;
    if ((window as any).XPress) {
      (window as any).XPress.api.invokeXTApi(stockImageXTID, 'XTSendMessage', 'AddImageToCollectionDialogCanceled');
    }
  }
  handleButtonClicked() {
    let addImageToCollectionsJson: string;
    const arrayToString = JSON.stringify(this.imageCollectionData);

    addImageToCollectionsJson = '{\"AddNewCollectionForImage\":';
    addImageToCollectionsJson += arrayToString;
    addImageToCollectionsJson += '}';
    const stockImageXTID = 1431525457;
    if ((window as any).XPress) {
      (window as any).XPress.api.invokeXTApi(stockImageXTID, 'XTSendMessage', addImageToCollectionsJson);
    }
  }
  @HostListener('document:keydown.enter', ['$event']) onKeydownEnterHandler(event: KeyboardEvent) {
    this.closeOKDialog();
  }
  @HostListener('document:keydown.escape', ['$event']) onKeydownHandler(event: KeyboardEvent) {
    this.closeCancelDialog();
  }
}

export class ImageCollectionData {
  mCollectionName?: string;
  mImageState?: string;
  mOldState?: string;
  mCollectionState?: string;
}

// add chrome to the Window context so typescript stops complaining
declare global {
  interface Window {
    chrome: any;
  }
}
