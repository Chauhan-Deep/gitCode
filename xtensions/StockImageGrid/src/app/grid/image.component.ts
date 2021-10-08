import { Component, Input, Output, EventEmitter, OnInit, HostListener  } from '@angular/core';

@Component({
  selector: 'app-image-component',
  templateUrl: './image.component.html',
  styleUrls: ['./image.component.css']
})

export class ImageComponent implements OnInit {
  @Input() imageData: any;

  constructor() {
  }

  ngOnInit(): void {
  }

  ImageInfoIconClicked() {
    let imageInfoJson: string;

    imageInfoJson = '{\"imageInfo\":[{\"photographarURL\":\"' + this.imageData.mPhotographarURL + '\",'
        + '\"imageProvider\":\"'    + this.imageData.mImageProvider    + '\",'
        + '\"photographarName\":\"' + this.imageData.mPhotographarName + '\",'
        + '\"imageHTMLURL\":\"'     + this.imageData.mImageHTMLURL     + '\",'
        + '\"isUserPresent\":\"'    + this.imageData.mIsUserPresent    + '\",'
        + '\"userID\":\"'           + this.imageData.mUserID           + '\",'
        + '\"userHTMLURL\":\"'      + this.imageData.mUserHTMLURL      + '\",'
        + '\"imageDescription\":\"' + this.imageData.mImageDescription + '\",'
        + '\"imageFileType\":\"'    + this.imageData.imageFileType     + '\",'
        + '\"imageWidth\":\"'       + this.imageData.mImageWidth       + '\",'
        + '\"imageHeight\":\"'      + this.imageData.mImageHeight      + '\"}]}';
    window.chrome.webview.postMessage(imageInfoJson);
  }

  @HostListener('dragstart', ['$event']) public onDragStart(event: DragEvent) {
    event.preventDefault();

    let downloadjson: string;

    downloadjson = '{\"dropImage\":[{\"url\":\"' + this.imageData.mDownloadURL + '\",'
        + '\"imageprovider\":\"' + this.imageData.mImageProvider + '\",' + '\"imageid\":\"'
        + this.imageData.mImageID + '\", ' + '\"previewURL\":\"' + this.imageData.mPreviewImage + '\"}]}';

    window.chrome.webview.postMessage(downloadjson);
  }
}
