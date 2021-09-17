import { Component, Input, Output,EventEmitter, OnInit  } from '@angular/core';

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
}