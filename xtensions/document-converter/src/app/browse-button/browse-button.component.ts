import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-browse-button',
  templateUrl: './browse-button.component.html',
  styleUrls: ['./browse-button.component.css']
})
export class BrowseButtonComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  onClick() {
    const documentConverterXTID = 1128552529;

    if ((window as any).XPress) {
      (window as any).XPress.api.invokeXTApi(documentConverterXTID, 'XTSendMessage', 'BrowseButtonClicked');
    }
  }
}
