import { Component, OnInit, Input, ViewChild } from '@angular/core';

import { QxTreeComponent, QxTreeNodeOptions, QxTreeEmitEvent, QxCheckboxComponent, CheckboxState, QxTreeNode } from '@quark/xpressng';

import { TranslateService } from '../translate/translate.service';
import { QxIDMLTreeNodeOptions, QxFileNodeOptions } from '../util-interface';

@Component({
  selector: 'qrk-search-list-view',
  templateUrl: './search-list-view.component.html',
  styleUrls: ['./search-list-view.component.scss']
})
export class SearchListViewComponent implements OnInit {
  @ViewChild('qxTreeComponent', { static: false }) qxTreeComponent: QxTreeComponent;
  @ViewChild('totalFilesCheckboxButton', { static: false }) totalFilesCheckboxButton: QxCheckboxComponent;
  @Input() treeFilesEnumData: QxIDMLTreeNodeOptions;

  selectAllState: CheckboxState;
  checkedKeysList: string[];
  treeNodeOptions: QxTreeNodeOptions[] = [];
  filesCountString: string;
  numOfINDDFiles: number;
  numOfIDMLFiles: number;
  numOfFiles: number;
  filesEnumData: QxIDMLTreeNodeOptions[];

  constructor(private translateService: TranslateService) { }

  ngOnInit() {
    const parentInddKey = 0;
    const parentIdmlKey = 1;

    this.selectAllState = CheckboxState.UNCHECKED;
    this.treeNodeOptions = [];
    this.checkedKeysList = [];
    this.initializeTreeData();
    this.checkedKeysList.push(parentInddKey.toString());
    this.checkedKeysList.push(parentIdmlKey.toString());
  }

  initializeTreeData(): void {
    const parentInddKey = 0;
    const parentIdmlKey = 1;
    const idmlTreeNodeChildren: QxTreeNodeOptions[] = [];
    const inddTreeNodeChildren: QxTreeNodeOptions[] = [];

    this.treeFilesEnumData.indd.forEach((childItem, key): void => {
      const keyVal = 2 + key;
      const treeNodeChildrenData: QxTreeNodeOptions = {
        title: childItem.name, key: keyVal.toString(),
        pathURL: childItem.path, isLeaf: true
      };

      inddTreeNodeChildren.push(treeNodeChildrenData);
    });

    this.numOfINDDFiles = inddTreeNodeChildren.length;
    this.treeFilesEnumData.idml.forEach((childItem, key): void => {
      const keyVal = this.numOfINDDFiles + key + 2;
      const treeNodeChildrenData: QxTreeNodeOptions = {
        title: childItem.name, key: keyVal.toString(),
        pathURL: childItem.path, isLeaf: true
      };

      idmlTreeNodeChildren.push(treeNodeChildrenData);
    });

    let customNodeStr = '(' + (inddTreeNodeChildren.length).toString() + ')';
    let treeNodeData: QxTreeNodeOptions = {
      title: 'INDD' + customNodeStr, key: parentInddKey.toString(),
      expanded: true, pathURL: '', children: inddTreeNodeChildren
    };

    this.treeNodeOptions.push(treeNodeData);
    customNodeStr = ')' + (idmlTreeNodeChildren.length).toString() + ')';
    treeNodeData = {
      title: 'IDML' + customNodeStr, key: parentIdmlKey.toString(),
      expanded: true, pathURL: '', children: idmlTreeNodeChildren
    };

    this.numOfIDMLFiles = idmlTreeNodeChildren.length;
    this.numOfINDDFiles = inddTreeNodeChildren.length;
    this.numOfFiles = this.numOfIDMLFiles + this.numOfINDDFiles;
    this.filesCountString = (this.numOfFiles).toString() + this.translateService.localize('ids-lbl-files-found');
    this.treeNodeOptions.push(treeNodeData);
  }

  qxEvent(event: QxTreeEmitEvent): void {
    console.log(event);
  }

  qxCheck(event: QxTreeEmitEvent): void {
    console.log(event);
    console.log('Checked Node:' + this.qxTreeComponent.getCheckedNodeList());
    console.log('Half Checked Node:' + this.qxTreeComponent.getHalfCheckedNodeList());
  }

  onSelectAllChange(event) {
    const state = this.totalFilesCheckboxButton.state;

    // if (state == CheckboxState.CHECKED) {
    //   const parentInddKey = 0;
    //   const parentIdmlKey = 1;

    //   this.checkedKeysList.push(parentInddKey.toString());
    //   this.checkedKeysList.push(parentIdmlKey.toString());
    // }
    // if (state == CheckboxState.UNCHECKED) {
    //   this.checkedKeysList = [];
    // }
  }

  convertSelectedDocuments() {
    const idmlKeyBeginning = this.numOfINDDFiles + 2;
    const checkedKeyNodes: QxTreeNode[] = this.qxTreeComponent.getCheckedNodeList();
    const idmlCheckedNodes: QxFileNodeOptions[] = [];
    const inddCheckedNodes: QxFileNodeOptions[] = [];

    checkedKeyNodes.forEach((treeNode): void => {
      const options: QxTreeNodeOptions = treeNode.origin;
      const key: number = +options.key;

      if (key > 1) {
        if (key < idmlKeyBeginning) {
          const fileNode: QxFileNodeOptions = {
            name: options.title, path: options.pathURL
          };

          inddCheckedNodes.push(fileNode);
        } else {
          const fileNode: QxFileNodeOptions = {
            name: options.title, path: options.pathURL
          };

          idmlCheckedNodes.push(fileNode);
        }
      }
    });

    const data = {
      indd: inddCheckedNodes, idml: idmlCheckedNodes
    };

    if (window as any) {
      this.filesEnumData = (window as any).XPress.api.invokeXTApi(1146372945,
        'IDMLImportConvertINDDAndIDMLFilesToQXP', data);
    }

  }
}
