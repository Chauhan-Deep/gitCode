import { Component, OnInit, Input, ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-collection',
  templateUrl: './collection.component.html',
  styleUrls: ['./collection.component.css']
})
export class CollectionComponent implements OnInit {
  @Input() collectionImageData: any;

  constructor(private ref: ChangeDetectorRef) {
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
}
