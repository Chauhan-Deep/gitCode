import { Component, OnInit, OnDestroy, ChangeDetectorRef, AfterViewChecked } from '@angular/core';

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

  constructor(private cdRef: ChangeDetectorRef) {
    this.appisLoading = true;
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
        (document.getElementById('qxButton') as HTMLInputElement).disabled = false;
      } else if (jsonResponseData.DocumentConvertorPhase === 'InitDocumentConvertorPhase') {
        (document.getElementById('qxButton') as HTMLInputElement).disabled = true;
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
    }
  }
}

export class DocumentData {
  mDocumentPath?: string;
  mDocumentName?: string;
  mDocumentStatus?: string;
}
