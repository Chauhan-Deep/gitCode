import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-document',
  templateUrl: './document.component.html',
  styleUrls: ['./document.component.css']
})
export class DocumentComponent implements OnInit {
  @Input() documentData: any;

  constructor() { }

  ngOnInit() {
  }

  DocumentNameClicked() {
    const documentPathJson: string = '{\"OpenDocument\":\"' + this.documentData.mDocumentPath + '\"}';
    const documentConverterXTID = 1128552529;

    if ((window as any).XPress) {
      (window as any).XPress.api.invokeXTApi(documentConverterXTID, 'XTSendMessage', documentPathJson);
    }
  }

  ShowInFolderClicked() {
    const documentPathJson: string = '{\"ClickedDocPath\":\"' + this.documentData.mDocumentPath + '\"}';
    const documentConverterXTID = 1128552529;

    if ((window as any).XPress) {
      (window as any).XPress.api.invokeXTApi(documentConverterXTID, 'XTSendMessage', documentPathJson);
    }
  }

  StopConversionClicked() {
    const documentConverterXTID = 1128552529;

    if ((window as any).XPress) {
      (window as any).XPress.api.invokeXTApi(documentConverterXTID, 'XTSendMessage', 'StopConversionClicked');
    }
  }

  DisplayShowInFolderText() {
    const isWindows: boolean = navigator.platform.toLowerCase() === 'win32';
    let displayText: string;

    if (isWindows) {
      displayText = 'Show in folder';
    } else {
      displayText = 'Show in Finder';
    }
    return displayText;
  }
}
