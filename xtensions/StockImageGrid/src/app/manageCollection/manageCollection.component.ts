import { Component, OnInit, Input, ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-managecollection',
  templateUrl: './manageCollection.component.html',
  styleUrls: ['./manageCollection.component.css']
})
export class ManageCollectionComponent implements OnInit {
  @Input() collectionData: any;

  constructor(private ref: ChangeDetectorRef) {
  }

  ngOnInit() {
  }

  deleteCollection() {
    this.collectionData.mMarkDeleted = 'true';
    this.ref.detectChanges();
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
}
