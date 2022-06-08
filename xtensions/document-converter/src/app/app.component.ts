import { Component, OnInit, OnDestroy, ChangeDetectorRef, AfterViewChecked } from '@angular/core';

import { TranslateService } from './translate/translate.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy, AfterViewChecked {
  title = 'document-converter';
  private _XT_SENDMESSAGE: number;
  documents: DocumentData[] = [];
  appisLoading: boolean;
  browseButtonDisabled: boolean;

  constructor(private cdRef: ChangeDetectorRef, private translateService: TranslateService) {
    let browserLang = 'en-US';

    if ((window as any).app) {
      browserLang = (window as any).app.language.code;
    }

    this.translateService.use(browserLang);
    this.appisLoading = true;
    this.browseButtonDisabled = false;
  }

  ngOnInit() {
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

  ngAfterViewChecked() {
    if (this.appisLoading) {
      const documentConverterXTID = 1128552529;

      if ((window as any).XPress) {
        (window as any).XPress.api.invokeXTApi(documentConverterXTID, 'XTSendMessage', 'AppIsRunning');
      }
    }
  }

  ngOnDestroy() {
    (window as any).XPress.deRegisterQXPCallbackHandler(0, 1636, this._XT_SENDMESSAGE);
  }

  SendMessageCallBackHandler(response) {
    const jsonResponse = JSON.parse(response);
    const jsonResponseData = JSON.parse(jsonResponse.data);

    if (jsonResponse.message === 'UpdateUI') {
      if (jsonResponseData.DocumentConvertorPhase === 'DeInitDocumentConvertorPhase') {
           this.browseButtonDisabled = false;
           this.cdRef.detectChanges();
      } else if (jsonResponseData.DocumentConvertorPhase === 'InitDocumentConvertorPhase') {
           this.browseButtonDisabled = true;
           this.cdRef.detectChanges();
      }
    } else if (jsonResponse.message === 'AddToList') {
      this.documents.unshift(jsonResponseData);
      this.cdRef.detectChanges();
    } else if (jsonResponse.message === 'AppIsLoadedPopulateList' && (this.appisLoading)) {
      this.appisLoading = false;
      this.documents = jsonResponseData;
      this.cdRef.detectChanges();
    } else if (jsonResponse.message === 'RefreshList') {
      this.documents = jsonResponseData;
      this.cdRef.detectChanges();
    }
  }

  browseButtonClicked() {
    const documentConverterXTID = 1128552529;

    if ((window as any).XPress) {
      (window as any).XPress.api.invokeXTApi(documentConverterXTID, 'XTSendMessage', 'BrowseButtonClicked');
      this.browseButtonDisabled = true;
      this.cdRef.detectChanges();
    }
  }
}

export class DocumentData {
  mDocumentPath?: string;
  mDocumentName?: string;
  mDocumentStatus?: string;
}
