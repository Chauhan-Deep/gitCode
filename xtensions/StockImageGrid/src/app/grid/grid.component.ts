import { Component, OnInit, ChangeDetectorRef, NgZone } from '@angular/core';

@Component({
  selector: 'app-grid',
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.css']
})
export class GridComponent implements OnInit {
  images: ImageData[] = [];
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
      (window as any).XPress.api.invokeXTApi(stockImageXTID, 'XTSendMessage', 'AppIsRunning');
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
      if (jsonResponse.message === 'PreviewImages') {
          this.images = [];
          window.scrollTo(0, 0);
          // To appease TSLint
          Object.keys(jsonResponseData).map(key2 => {
            this.images.push(jsonResponseData[key2]);
          });
          this.ref.detectChanges();
        }
      if (jsonResponse.message === 'PreviewNextPageImages') {
          // To appease TSLint
          Object.keys(jsonResponseData).map(key2 => {
            this.images.push(jsonResponseData[key2]);
          });
          this.ref.detectChanges();
        }
      if (jsonResponse.message === 'QXPThemeColor') {
          document.body.style.backgroundColor = jsonResponseData[0].qxpTheme;
        }
    }
  }
}

export class ImageData {
  mPreviewImage?: string;
  mImageID?: string;
  mUserID?: string;
  imageFileType?: string;
  mUserHTMLURL?: string;
  mImageHTMLURL?: string;
  mImageHeight?: string;
  mImageWidth?: string;
  mImageDescription?: string;
  mPhotographarURL?: string;
  mPhotographarName?: string;
  mDownloadURL?: string;
  mIsUserPresent?: string;
  mImageProvider?: string;
  mIsFavourite?: boolean;
}

// add chrome to the Window context so typescript stops complaining
declare global {
  interface Window {
    chrome: any;
  }
}
