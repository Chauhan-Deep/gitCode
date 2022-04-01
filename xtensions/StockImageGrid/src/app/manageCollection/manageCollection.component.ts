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
}
