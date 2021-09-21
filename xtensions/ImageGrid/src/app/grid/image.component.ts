import { Component, Input, Output,EventEmitter, OnInit, HostListener  } from '@angular/core';

@Component({
  selector: 'image-component',
  templateUrl: './image.component.html',
  styleUrls: ['./image.component.css']
})

export class ImageComponent implements OnInit {
  @Input() imageData: any;

  constructor() 
  {   
  }

  ngOnInit(): void {
  }

  @HostListener("dragstart", ["$event"]) public onDragStart(event:DragEvent) {
    event.preventDefault();
    
    let downloadjson : string = "";
    
    downloadjson = "{\"dropImage\":[{\"url\":\"" + this.imageData.mDownloadURL + "\"," + "\"imageprovider\":\"" + this.imageData.mImageProvider + "\"," + "\"imageid\":\"" + this.imageData.mImageID + "\"}]}";

    console.log(JSON.parse(downloadjson));

    window?.chrome?.webview?.postMessage(downloadjson);
   }
}