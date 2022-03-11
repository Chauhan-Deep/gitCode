import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-collecton-list',
  templateUrl: './collection-list.component.html',
  styleUrls: ['./collection-list.component.css']
})
export class CollectionsComponent implements OnInit {
  collections: string[] = ['Flowers', 'Tree', 'Water-Fall', 'Flowers1', 'Tree1', 'Water-Fall1', 'Flower2s', 'Tree2', 'Water-Fall2'];

  constructor() { }

  ngOnInit() {
  }

}
