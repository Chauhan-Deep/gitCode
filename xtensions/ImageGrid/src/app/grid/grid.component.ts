import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-grid',
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.css']
})
export class GridComponent implements OnInit {
  images : string[] = [];

  constructor() 
  {
    window?.chrome?.webview?.addEventListener('message', (event : any) => {
      if ("PreviewImage" in event.data) {
       this.images = [];
       
      for (const x in event.data.PreviewImage) {
        this.images.push(event.data.PreviewImage[x]);
      }
    }
    });
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
