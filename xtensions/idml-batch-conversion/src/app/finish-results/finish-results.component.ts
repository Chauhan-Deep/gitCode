import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';

import { QxTreeNodeOptions } from '@quark/xpressng';

import { TranslateService } from '../translate/translate.service';
import { FileConversionService } from '../file-conversion.service';
import { QxIDMLTreeNodeOptions } from '../util-interface';

@Component({
  selector: 'qrk-finish-results',
  templateUrl: './finish-results.component.html',
  styleUrls: ['./finish-results.component.scss']
})

export class FinishResultsComponent implements OnInit, OnDestroy {
  private populateTreeViewEvent: any;

  treeNodeOptions: QxTreeNodeOptions[] = [];
  filesCountString: string;
  numOfFailedFiles: number;
  numOfPassedFiles: number;
  totalNumOfFiles: number;
  treeFilesEnumData: QxIDMLTreeNodeOptions;

  constructor(
    private translateService: TranslateService,
    private changeDetectorRef: ChangeDetectorRef,
    private fileConversionService: FileConversionService) {
    this.subscribeEvents();
  }

  ngOnInit() {
    this.treeNodeOptions = [];
  }

  subscribeEvents() {
    this.populateTreeViewEvent = this.fileConversionService.showFinalResultEvent.subscribe(this.initializeTreeData.bind(this));
  }

  unsubscribeEvents() {
    if (this.populateTreeViewEvent) {
      this.populateTreeViewEvent.unsubscribe();
      this.populateTreeViewEvent = undefined;
    }
  }

  ngOnDestroy() {
    this.unsubscribeEvents();
  }

  initializeTreeData(): void {
    const tempTreeNodeOptions: QxTreeNodeOptions[] = [];

    const parentInddKey = 0;
    const parentIdmlKey = 1;
    const idmlTreeNodeChildren: QxTreeNodeOptions[] = [];
    const inddTreeNodeChildren: QxTreeNodeOptions[] = [];

    this.numOfFailedFiles = 0;
    this.numOfPassedFiles = 0;

    this.totalNumOfFiles = this.fileConversionService.getFilesCount();
    this.treeFilesEnumData = this.fileConversionService.getFileConversionResult();

    this.treeFilesEnumData.indd.forEach((childItem, key): void => {
      const keyVal = 2 + key;
      const treeNodeChildrenData: QxTreeNodeOptions = {
        title: childItem.name, key: keyVal.toString(),
        pathURL: childItem.path, fileConverted: childItem.status, isLeaf: true
      };
      childItem.status ? this.numOfPassedFiles++ : this.numOfFailedFiles++;
      inddTreeNodeChildren.push(treeNodeChildrenData);
    });

    this.treeFilesEnumData.idml.forEach((childItem, key): void => {
      const keyVal = inddTreeNodeChildren.length + key + 2;
      const treeNodeChildrenData: QxTreeNodeOptions = {
        title: childItem.name, key: keyVal.toString(),
        pathURL: childItem.path, fileConverted: childItem.status, isLeaf: true
      };
      childItem.status ? this.numOfPassedFiles++ : this.numOfFailedFiles++;
      idmlTreeNodeChildren.push(treeNodeChildrenData);
    });

    let customNodeStr = '(' + (inddTreeNodeChildren.length).toString() + ')';
    let treeNodeData: QxTreeNodeOptions = {
      title: 'INDD' + customNodeStr, key: parentInddKey.toString(),
      expanded: true, pathURL: '', children: inddTreeNodeChildren
    };

    tempTreeNodeOptions.push(treeNodeData);
    customNodeStr = '(' + (idmlTreeNodeChildren.length).toString() + ')';
    treeNodeData = {
      title: 'IDML' + customNodeStr, key: parentIdmlKey.toString(),
      expanded: true, pathURL: '', children: idmlTreeNodeChildren
    };

    this.filesCountString = (this.totalNumOfFiles).toString() + this.translateService.localize('ids-lbl-files-found');
    tempTreeNodeOptions.push(treeNodeData);

    //  this is done as if we fill up data member from callback(different thread), then UI change in not detected,
    //  so in order to overcome this problem, create local object to store data instead of filling member object
    //  and then copy data from local object to member object and call 'detectChanges' method of 'changeDetectorRef'

    this.treeNodeOptions = tempTreeNodeOptions;
    this.changeDetectorRef.detectChanges();
  }
}
