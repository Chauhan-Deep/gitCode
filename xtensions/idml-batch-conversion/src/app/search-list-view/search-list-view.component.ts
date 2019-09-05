import { Component, OnInit, Input } from '@angular/core';
import { QxTreeNodeOptions, QxTreeEmitEvent } from '@quark/xpressng';
import { QxIDMLTreeNodeOptions, QxFileNodeOptions } from '../scan-files/scan-files.component';

@Component({
  selector: 'qrk-search-list-view',
  templateUrl: './search-list-view.component.html',
  styleUrls: ['./search-list-view.component.scss']
})
export class SearchListViewComponent implements OnInit {

  treeNodeOptions: QxTreeNodeOptions[] = [];
  @Input() treeFilesEnumData: QxIDMLTreeNodeOptions;

  constructor() {

  }

  ngOnInit() {
    this.treeNodeOptions = [];
    this.initializeTreeData();
  }

  initializeTreeData(): void {
    const self = this;

    {
      const parentInddKey = 0;
      const parentIdmlKey = 1;
      const idmlTreeNodeChildren: QxTreeNodeOptions[] = [];
      const inddTreeNodeChildren: QxTreeNodeOptions[] = [];

      self.treeFilesEnumData.indd.forEach((childItem, key): void => {
        const keyVal = 2 + key;
        const treeNodeChildrenData: QxTreeNodeOptions = {
          title: childItem.name, key: keyVal.toString(),
          customNode: childItem.path, isLeaf: true
        };

        inddTreeNodeChildren.push(treeNodeChildrenData);
      });
      self.treeFilesEnumData.idml.forEach((childItem, key): void => {
        const keyVal = inddTreeNodeChildren.length + key;
        const treeNodeChildrenData: QxTreeNodeOptions = {
          title: childItem.name, key: keyVal.toString(),
          customNode: childItem.path, isLeaf: true
        };

        idmlTreeNodeChildren.push(treeNodeChildrenData);
      });

      let customNodeStr = '(' + (inddTreeNodeChildren.length).toString() + ')';
      let treeNodeData: QxTreeNodeOptions = {
        title: 'INDD' + customNodeStr, key: parentInddKey.toString(),
        expanded: true, customNode: '', children: inddTreeNodeChildren
      };

      self.treeNodeOptions.push(treeNodeData);
      customNodeStr = ')' + (idmlTreeNodeChildren.length).toString() + ')';
      treeNodeData = {
        title: 'IDML' + customNodeStr, key: parentIdmlKey.toString(),
        expanded: true, customNode: '', children: idmlTreeNodeChildren
      };
      self.treeNodeOptions.push(treeNodeData);
    }
  }

  qxEvent(event: QxTreeEmitEvent): void {
    console.log(event);
  }

  qxExpandChange(event: QxTreeEmitEvent): void {
    console.log(event);
  }

  qxCheck(event: QxTreeEmitEvent): void {
    console.log(event);
  }
}
