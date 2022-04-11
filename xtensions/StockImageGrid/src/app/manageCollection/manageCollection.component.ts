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
}
