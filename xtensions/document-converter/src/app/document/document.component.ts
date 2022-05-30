import { Component, OnInit, Input } from '@angular/core';
import { TranslateService } from '../translate/translate.service';

@Component({
  selector: 'app-document',
  templateUrl: './document.component.html',
  styleUrls: ['./document.component.css']
})
export class DocumentComponent implements OnInit {
  @Input() documentData: any;
  isWindows = navigator.platform.toLowerCase() === 'win32';

  constructor(private translateService: TranslateService) { }

  ngOnInit() {
  }

  DocumentNameClicked() {
    let documentPathStr: string;

    if (this.isWindows) {
      documentPathStr = this.documentData.mDocumentPath;
    } else {
      const tempStr: string  = this.documentData.mDocumentPath.replace(/\\/g, '\\\\');
      documentPathStr = tempStr.replace(/\"/g, '\\\"');
    }
    const documentPathJson: string = '{\"OpenDocument\":\"' + documentPathStr + '\"}';
    const documentConverterXTID = 1128552529;

    if ((window as any).XPress) {
      (window as any).XPress.api.invokeXTApi(documentConverterXTID, 'XTSendMessage', documentPathJson);
    }
  }

  ShowInFolderClicked() {
    let documentPathStr: string;

    if (this.isWindows) {
      documentPathStr = this.documentData.mDocumentPath;
    } else {
      const tempStr: string  = this.documentData.mDocumentPath.replace(/\\/g, '\\\\');
      documentPathStr = tempStr.replace(/\"/g, '\\\"');
    }
    const documentPathJson: string = '{\"ClickedDocPath\":\"' + documentPathStr + '\"}';
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
    let displayText: string;

    if (this.isWindows) {
      displayText = this.translateService.localize('ids-lbl-show-in-folder');
    } else {
      displayText = this.translateService.localize('ids-lbl-show-in-finder');
    }
    return displayText;
  }
}
