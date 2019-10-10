import { Component, OnInit, Input, ViewChild, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { MatStepper } from '@angular/material/stepper';

import { QxTreeComponent, QxTreeNodeOptions, QxTreeEmitEvent, QxCheckboxComponent, CheckboxState, QxTreeNode } from '@quark/xpressng';

import { TranslateService } from '../../translate/translate.service';
import { FileListDataService } from '../../Service/file-list-data.service';
import { QXIDMLFilesListData, QXIDFileDetailsData } from '../../Interface/idml-interface';

@Component({
  selector: 'qrk-list-view',
  templateUrl: './list-view.component.html',
  styleUrls: ['./list-view.component.scss']
})
export class ListViewComponent implements OnInit, OnDestroy {
  @ViewChild('qxTreeComponent', { static: false }) qxTreeComponent: QxTreeComponent;
  @ViewChild('allFilesCheckboxButton', { static: false }) allFilesCheckboxButton: QxCheckboxComponent;
  @ViewChild('overWriteCheckboxButton', { static: false }) overwriteCheckboxButton: QxCheckboxComponent;

  @Input() stepper: MatStepper;
  @Input() allowCheckable: boolean;
  @Input() loadSearchData: boolean;

  populateTreeViewEvent: any;
  selectAllState: CheckboxState;
  checkedKeysList: string[];
  treeNodeOptions: QxTreeNodeOptions[] = [];
  filesCountString: string;
  numOfINDDFiles: number;
  numOfIDMLFiles: number;
  numOfFiles: number;
  totalNumOfFiles: number;
  numOfPassedFiles: number;
  numOfFailedFiles: number;
  inddKey: string;
  idmlKey: string;

  constructor(
    private translateService: TranslateService,
    private changeDetectorRef: ChangeDetectorRef,
    private fileListService: FileListDataService) { }

  ngOnInit() {
    this.selectAllState = CheckboxState.UNCHECKED;
    this.treeNodeOptions = [];
    this.checkedKeysList = [];
    this.inddKey = 'indd';
    this.idmlKey = 'idml';
    this.numOfFailedFiles = 0;
    this.numOfPassedFiles = 0;
    this.fileListService.shouldRespondWithSearchData = this.loadSearchData;
    this.subscribeEvents();
    if (this.loadSearchData) {
      this.initializeTreeData();
    }
  }

  ngOnDestroy() {
    this.unsubscribeEvents();
  }

  unsubscribeEvents() {
    if (this.populateTreeViewEvent) {
      this.populateTreeViewEvent.unsubscribe();
      this.populateTreeViewEvent = undefined;
    }
  }

  subscribeEvents(): void {
    this.populateTreeViewEvent = this.fileListService.showFinalResultEvent.subscribe(this.initializeDataForConvertedFiles.bind(this));
  }

  initializeDataForConvertedFiles(): void {
    this.loadSearchData = false;
    this.initializeTreeData();
  }
  initializeTreeData(): void {

    const tempTreeNodeOptions: QxTreeNodeOptions[] = [];

    const idmlTreeNodeChildren: QxTreeNodeOptions[] = [];
    const inddTreeNodeChildren: QxTreeNodeOptions[] = [];
    const treeFilesEnumData: QXIDMLFilesListData = this.fileListService.getFileList();

    this.totalNumOfFiles = this.fileListService.getFilesCount();
    treeFilesEnumData.indd.forEach((childItem, index): void => {
      const treeNodeChildrenData: QxTreeNodeOptions = {
        title: childItem.name, key: 'indd_' + index,
        pathURL: childItem.path, isLeaf: true
      };
      if (!this.loadSearchData) {
        childItem.status ? this.numOfPassedFiles++ : this.numOfFailedFiles++;
        treeNodeChildrenData.fileConverted = childItem.status;
        if (childItem.qxpPath !== undefined) {
          treeNodeChildrenData.qxpFileName = childItem.qxpPath.replace(childItem.path, '');
        }
      }
      inddTreeNodeChildren.push(treeNodeChildrenData);
    });

    this.numOfINDDFiles = inddTreeNodeChildren.length;
    treeFilesEnumData.idml.forEach((childItem, index): void => {
      const treeNodeChildrenData: QxTreeNodeOptions = {
        title: childItem.name, key: 'idml_' + index,
        pathURL: childItem.path, isLeaf: true
      };
      if (!this.loadSearchData) {
        childItem.status ? this.numOfPassedFiles++ : this.numOfFailedFiles++;
        treeNodeChildrenData.fileConverted = childItem.status;
        if (childItem.qxpPath !== undefined) {
          treeNodeChildrenData.qxpFileName = childItem.qxpPath.replace(childItem.path, '');
        }
      }
      idmlTreeNodeChildren.push(treeNodeChildrenData);
    });

    let customNodeStr = '(' + inddTreeNodeChildren.length + ')';
    let treeNodeData: QxTreeNodeOptions = {
      title: 'INDD' + customNodeStr, key: this.inddKey,
      expanded: true, pathURL: '', children: inddTreeNodeChildren
    };

    tempTreeNodeOptions.push(treeNodeData);
    customNodeStr = '(' + idmlTreeNodeChildren.length + ')';
    treeNodeData = {
      title: 'IDML' + customNodeStr, key: this.idmlKey,
      expanded: true, pathURL: '', children: idmlTreeNodeChildren
    };

    this.numOfIDMLFiles = idmlTreeNodeChildren.length;
    this.numOfINDDFiles = inddTreeNodeChildren.length;
    this.numOfFiles = this.numOfIDMLFiles + this.numOfINDDFiles;
    this.filesCountString = (this.numOfFiles).toString() + ' ' + this.translateService.localize('ids-lbl-files-found');
    tempTreeNodeOptions.push(treeNodeData);

    //  this is done as if we fill up data member from callback(different thread), then UI change in not detected,
    //  so in order to overcome this problem, create local object to store data instead of filling member object
    //  and then copy data from local object to member object and call 'detectChanges' method of 'changeDetectorRef'
    this.treeNodeOptions = tempTreeNodeOptions;
    this.changeDetectorRef.detectChanges();
  }

  onSelectAllChange(event) {
    const state = this.allFilesCheckboxButton.state;

    this.checkedKeysList = [];
    if (state === CheckboxState.CHECKED) {
      this.checkedKeysList.push(this.inddKey);
      this.checkedKeysList.push(this.idmlKey);
    }
  }

  openFileLocation(treeNode: QxTreeNodeOptions) {
    if ((window as any).XPress) {
      const data = { qxpFilePath: (treeNode.origin.pathURL + treeNode.origin.qxpFileName) };

      (window as any).XPress.api.invokeXTApi(1146372945, 'IDMLImportBrowseToFile', data);
    }
  }

  convertSelectedDocuments() {
    const inddKey = this.inddKey;
    const idmlKey = this.idmlKey;
    const checkedKeyNodes: QxTreeNode[] = this.qxTreeComponent.getCheckedNodeList();
    const treeFilesEnumData = this.fileListService.getFileList();
    let idmlCheckedNodes: QXIDFileDetailsData[] = [];
    let inddCheckedNodes: QXIDFileDetailsData[] = [];
    let allowInDesignUsage: boolean;

    checkedKeyNodes.forEach((node): void => {
      const options: QxTreeNodeOptions = node.origin;
      const key: string = options.key;

      if (key === inddKey) {
        inddCheckedNodes = treeFilesEnumData.indd;
      } else if (key === idmlKey) {
        idmlCheckedNodes = treeFilesEnumData.idml;
      } else {
        const parentNode = node.parentNode;

        if (parentNode != null) {
          const parentKey: string = parentNode.origin.key;
          const fileNode: QXIDFileDetailsData = {
            name: options.title, path: options.pathURL
          };

          if (parentKey === inddKey) {
            inddCheckedNodes.push(fileNode);
          } else if (parentKey === idmlKey) {
            idmlCheckedNodes.push(fileNode);
          }
        }
      }
    });

    if (inddCheckedNodes.length > 0 && ((window as any).app)) {
      allowInDesignUsage = (window as any).app.dialogs.confirm(this.translateService.localize('ids-alert-indesign-usage'),
        (window as any).app.constants.alertTypes.kNoteAlert);
    }

    if (!allowInDesignUsage) {
      // Remove In-Design files and convert only IDML files.
      inddCheckedNodes = [];
    }

    const data = {
      indd: inddCheckedNodes, idml: idmlCheckedNodes
    };
    const overwrite: boolean = this.overwriteCheckboxButton.state === CheckboxState.CHECKED;

    this.stepper.selected.completed = true;
    this.stepper.next();
    this.fileListService.shouldOverwriteExisting = overwrite;
    this.fileListService.callXPressFileConversion(data);
  }

  closeDialog() {
    if ((window as any).XPress) {
      (window as any).app.dialogs.closeDialog();
    }
  }

  exportReport() {
    let folderUrl: string;

    if ((window as any).app) {
      const titleStr: string = this.translateService.localize('ids-lbl-conversion-results');
      const acceptTypes = [{ types: ['html'], typesName: 'HTML' }];

      folderUrl = (window as any).app.dialogs.saveFileDialog(titleStr, '', acceptTypes, 'Results.html');
    }

    if (folderUrl != null) {
      let htmlStr = '<HTML><HEAD><TITLE>Conversion Results</TITLE></HEAD>';

      htmlStr += '<BODY BGCOLOR="#FFFFFF">';
      htmlStr += '<H1>' + this.translateService.localize('ids-lbl-conversion-results') + '</H1>';

      htmlStr += '<UL>';
      htmlStr += '<LI><B>' + this.totalNumOfFiles + ' ' + this.translateService.localize('ids-lbl-files-processed') + '</B></LI>';
      htmlStr += '<LI><B>' + this.numOfPassedFiles + ' ' + this.translateService.localize('ids-lbl-files-passed') + '</B></LI>';
      htmlStr += '<LI><B>' + this.numOfFailedFiles + ' ' + this.translateService.localize('ids-lbl-files-failed') + '</B></LI>';
      htmlStr += '</UL>';
      htmlStr += '<hr>';

      htmlStr += this.generateReportForCollection();
      htmlStr += '</BODY>';
      htmlStr += '</HTML>';
      if ((window as any).fs) {
        (window as any).fs.writeFileSync(folderUrl, htmlStr);
      }
    }
  }

  generateReportForCollection(): string {
    const treeFilesEnumData: QXIDMLFilesListData = this.fileListService.getFileList();
    let itemStr = '';

    treeFilesEnumData.idml.forEach((childItem, index): void => {
      if (childItem.status === true) {
        itemStr += '<h3>';
        itemStr += '<p><FONT color=green>' + this.translateService.localize('ids-lbl-success') + ': ' + '</FONT>' + childItem.name + '</p>';
        itemStr += '</h3>';
        itemStr += '<p><B>' + this.translateService.localize('ids-lbl-source') + ': </B>' + childItem.path + childItem.name + '</p>';
        itemStr += '<p><B>' + this.translateService.localize('ids-lbl-destination') + ': </B>' + childItem.qxpPath + '</p>';
        itemStr += '<hr width=85%>';
      } else {
        itemStr += '<h3>';
        itemStr += '<p><FONT color=red>' + this.translateService.localize('ids-lbl-files-failed')
          + ': ' + '</FONT>' + childItem.name + '</p>';
        itemStr += '<p><FONT color=red>' + this.translateService.localize('ids-lbl-files-failed') + '</FONT></p>';
        itemStr += '</h3>';
        itemStr += '<p><B>' + this.translateService.localize('ids-lbl-source') + ': </B>' + childItem.path + childItem.name + '</p>';
        itemStr += '<hr width=85%>';
      }
    });

    treeFilesEnumData.indd.forEach((childItem, index): void => {
      if (childItem.status === true) {
        itemStr += '<h3>';
        itemStr += '<p><FONT color=green>' + this.translateService.localize('ids-lbl-success')
          + ': ' + '</FONT>' + childItem.name + '</p>';
        itemStr += '</h3>';
        itemStr += '<p><B>' + this.translateService.localize('ids-lbl-source') + ': </B>' + childItem.path + childItem.name + '</p>';
        itemStr += '<p><B>' + this.translateService.localize('ids-lbl-destination') + ': </B>' + childItem.qxpPath + '</p>';
        itemStr += '<hr width=85%>';
      } else {
        itemStr += '<h3>';
        itemStr += '<p><FONT color=red>' + this.translateService.localize('ids-lbl-files-failed')
          + ': ' + '</FONT>' + childItem.name + '</p>';
        itemStr += '<p><FONT color=red>' + this.translateService.localize('ids-lbl-files-failed') + '</FONT></p>';
        itemStr += '</h3>';
        itemStr += '<p><B>' + this.translateService.localize('ids-lbl-source') + ': </B>' + childItem.path + childItem.name + '</p>';
        itemStr += '<hr width=85%>';
      }
    });
    return itemStr;
  }
}
