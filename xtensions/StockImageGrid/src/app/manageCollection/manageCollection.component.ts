import { Component, OnInit, Input, ChangeDetectorRef,ViewChild, ElementRef, ViewEncapsulation } from '@angular/core';
import { ContextMenuService, ContextMenuComponent } from 'ngx-contextmenu';

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'app-managecollection',
  templateUrl: './manageCollection.component.html',
  styleUrls: ['./manageCollection.component.css']
})
export class ManageCollectionComponent implements OnInit {
  @Input() collectionData: any;
  public disableBasicMenu = false;

  constructor(private contextMenuService: ContextMenuService) {
  }

  ngOnInit() {
  }

  deleteCollection() {
    let deleteCollectionsJson: string;
    const arrayToString = JSON.stringify(this.collectionData);

    deleteCollectionsJson = '{\"DeleteCollection\":';
    deleteCollectionsJson += arrayToString;
    deleteCollectionsJson += '}';
    const stockImageXTID = 1431525457;
    if ((window as any).XPress) {
      (window as any).XPress.api.invokeXTApi(stockImageXTID, 'XTSendMessage', deleteCollectionsJson);
    }
  }
  editCollection() {
    let editCollectionsJson: string;
    const arrayToString = JSON.stringify(this.collectionData);

    editCollectionsJson = '{\"EditCollection\":';
    editCollectionsJson += arrayToString;
    editCollectionsJson += '}';
    const stockImageXTID = 1431525457;
    if ((window as any).XPress) {
      (window as any).XPress.api.invokeXTApi(stockImageXTID, 'XTSendMessage', editCollectionsJson);
    }
  }

  public onContextMenu($event: MouseEvent, item: any): void {
    this.contextMenuService.show.next({ event: $event, item: item });
    $event.preventDefault();
  }

  public showMessage(message: any): void {
    this.collectionData.mIsDefaultCollection = this.collectionData.mIsDefaultCollection === 'true' ? 'false' : 'true';
    let editCollectionsJson: string;
    const arrayToString = JSON.stringify(this.collectionData);

    editCollectionsJson = '{\"DefaultCollection\":';
    editCollectionsJson += arrayToString;
    editCollectionsJson += '}';
    const stockImageXTID = 1431525457;
    if ((window as any).XPress) {
      (window as any).XPress.api.invokeXTApi(stockImageXTID, 'XTSendMessage', editCollectionsJson);
    }
  }
}
