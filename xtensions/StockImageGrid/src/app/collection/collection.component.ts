import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-collection',
  templateUrl: './collection.component.html',
  styleUrls: ['./collection.component.css']
})
export class CollectionComponent implements OnInit {
  @Input() collectionImageData: any;

  constructor() { }

  ngOnInit() {
  }

  changeImageState() {
    if (this.collectionImageData.mImageState === '2') {
      this.collectionImageData.mImageState = '3';
    } else if (this.collectionImageData.mImageState === '1') {
      this.collectionImageData.mImageState = '2';
    }
  }
}
