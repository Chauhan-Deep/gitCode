import { Component, OnInit, Input, ChangeDetectorRef, ViewChild, ElementRef, ViewEncapsulation } from '@angular/core';
import { ContextMenuService, ContextMenuComponent } from 'ngx-contextmenu';

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'app-collection',
  templateUrl: './collection.component.html',
  styleUrls: ['./collection.component.css']
})
export class CollectionComponent implements OnInit {
  @Input() collectionImageData: any;
  public disableBasicMenu = false;
  public items: any[];

  constructor(private contextMenuService: ContextMenuService, private ref: ChangeDetectorRef) {
  }

  ngOnInit() {
  }

  changeImageState() {
    if (this.collectionImageData.mImageState === '2') {
      this.collectionImageData.mImageState = '3';
      this.ref.detectChanges();
    } else if (this.collectionImageData.mImageState === '1' || this.collectionImageData.mImageState === '3') {
      this.collectionImageData.mImageState = '2';
      this.ref.detectChanges();
    }
  }
  public onContextMenu($event: MouseEvent, item: any): void {
    this.contextMenuService.show.next({ event: $event, item: this.collectionImageData });
    $event.preventDefault();
  }

  public showMessage(message: any): void {
    this.collectionImageData.mIsDefaultCollection = this.collectionImageData.mIsDefaultCollection === 'true' ? 'false' : 'true';
    let editCollectionsJson: string;
    const arrayToString = JSON.stringify(this.collectionImageData);

    editCollectionsJson = '{\"DefaultImageCollection\":';
    editCollectionsJson += arrayToString;
    editCollectionsJson += '}';
    const stockImageXTID = 1431525457;
    if ((window as any).XPress) {
      (window as any).XPress.api.invokeXTApi(stockImageXTID, 'XTSendMessage', editCollectionsJson);
    }
  }
}
