import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-managecollections',
  templateUrl: './managecollections.component.html',
  styleUrls: ['./managecollections.component.css']
})
export class ManageCollectionsComponent implements OnInit {

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
