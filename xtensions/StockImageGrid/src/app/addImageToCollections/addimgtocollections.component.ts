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
}

// add chrome to the Window context so typescript stops complaining
declare global {
  interface Window {
    chrome: any;
  }
}
