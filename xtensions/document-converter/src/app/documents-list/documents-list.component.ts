import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-documents-list',
  templateUrl: './documents-list.component.html',
  styleUrls: ['./documents-list.component.css']
})
export class DocumentsListComponent implements OnInit {
  documents: string[] = ['Document 1.qxp', 'Document 2.qxp', 'Document 3.qxp',
                         'Document 4.qxp', 'Document 5.qxp', 'Document 6.qxp',
                         'Document 7.qxp', 'Document 8.qxp', 'Document 9.qxp'];

  constructor() { }

  ngOnInit() {
  }

}
