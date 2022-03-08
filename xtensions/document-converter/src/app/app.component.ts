import { Component, OnInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'document-converter';
  private _XT_SENDMESSAGE: number;

  ngOnInit() {
    if ((window as any).app) {
      this._XT_SENDMESSAGE = (window as any).XPress.registerQXPCallbackHandler(0, 1636, this.SendMessageCallBackHandler.bind(this));
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
    }
  }

  browseButtonClicked() {
    const documentConverterXTID = 1128552529;

    if ((window as any).XPress) {
      (window as any).XPress.api.invokeXTApi(documentConverterXTID, 'XTSendMessage', 'BrowseButtonClicked');
    }
  }
}
