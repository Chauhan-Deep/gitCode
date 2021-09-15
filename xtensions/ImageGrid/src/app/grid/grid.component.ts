import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-grid',
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.css']
})
export class GridComponent implements OnInit {
  images : ImageData[] = [];

  constructor() 
  {
    window?.chrome?.webview?.addEventListener('message', (event : any) => {
      if ("PreviewImage" in event.data) {
       this.images = [];       
      for (const x in event.data.PreviewImage) {
        this.images.push(event.data.PreviewImage[x]);
      }
    }

    if ("PreviewNextPageImages" in event.data) { 
        for (const x in event.data.PreviewNextPageImages) {
          this.images.push(event.data.PreviewNextPageImages[x]);
       }
    }
    });
  }

  ngOnInit(): void {
  }

}

export class ImageData {
  mPreviewImage?: string;
  mImageID?: string;
  mUserID?: string;
  imageFileType?: string;
  mUserHTMLURL?:string;
  mImageHTMLURL?:string;
  mImageHeight?:string;
  mImageWidth?:string;
  //mImageDescription?:string;
  mPhotographarURL?:string;
  mPhotographarName?:string;
  mDownloadURL?:string;
  mIsUserPresent?:string;
};

// add chrome to the Window context so typescript stops complaining
declare global {
  interface Window {
    chrome: any;
  }
}
