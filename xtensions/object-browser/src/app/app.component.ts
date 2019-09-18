import { Component, ViewChild, NgZone, ChangeDetectorRef } from '@angular/core';
import { QxTreeModule } from '@quark/xpressng';
import { QxTreeComponent, QxTreeNode, QxTreeNodeOptions, QxTreeEmitEvent, QxTreeBeforeDropEvent } from '@quark/xpressng';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})


export class AppComponent {
  ngZone: NgZone;

  constructor(_ngZone: NgZone, private ref: ChangeDetectorRef) {
    this.ngZone = _ngZone;
  }

  @ViewChild('qxTreeComponent', { static: false }) qxTreeComponent: QxTreeComponent;

  isDragStarted = false;
  draggedNodeKey = "";
  title = 'object-browser';
  private _XT_CHGDOCSTAT: number;
  private _XT_FLEX_POST_ATTATCH_ITEM: number;
  private _XT_FLEX_POST_DETATCH_ITEM: number;
  private _XT_FLEX_POST_REPARENT_ITEM: number;
  private _XT_POST_DELETEITEM: number;
  private _XT_UNDO: number;
  private _XT_REDO: number;

  boxNodes = [
    {
      title: 'Root',
      key: '1',
      expanded: true,
      selected: false,
      children: []
    }
  ];

  traverse_it(obj) {
    for (var prop in obj) {
      if (typeof obj[prop] == 'object') {
        // object
        this.traverse_it(obj[prop]);
      } else {
        // something else
        if (prop == "title") {
          console.log(obj[prop]);
        }
      }
    }
  }

  ngOnInit() {
    console.log("ngOnInit");

    let boxID = (<any>window).app.activeBoxes().boxIDs[0];
    console.log("boxID=" + boxID);
    let count = (<any>window).app.components.flex.getFlexChildCount(boxID);
    console.log("count=" + count);
    let rootboxID = (<any>window).app.components.flex.getFlexRoot(boxID);
    let boxName = (<any>window).app.components.flex.getBoxName(rootboxID);
    boxName = boxName.charAt(0).toUpperCase() + boxName.slice(1);
    this.boxNodes[0].title = boxName;
    this.boxNodes[0].key = rootboxID;
    this.AddChidren(this.boxNodes[0].children, rootboxID);
    this.RegisterQXPCallBacks();
  }

  AddChid(nodes, flexboxID) {
    let childCount = (<any>window).app.components.flex.getFlexChildCount(flexboxID);
    let boxName = (<any>window).app.components.flex.getBoxName(flexboxID);
    boxName = boxName.charAt(0).toUpperCase() + boxName.slice(1);
    var title = boxName;
    var childdata = {
      'title': title,
      'key': flexboxID,
      'expanded': true,
      "children": [],
      "selected": false,
      "isLeaf": (childCount == undefined) || childCount == 0
    };
    nodes.push(childdata);

    if (childCount > 0) {
      this.AddChidren(childdata.children, flexboxID);
    }
  }

  AddChidren(nodes, flexboxID) {
    let childCount = (<any>window).app.components.flex.getFlexChildCount(flexboxID);
    for (var j = 0; j < childCount; j++) {
      let childboxID = (<any>window).app.components.flex.getFlexChildAtIndex(flexboxID, j);
      this.AddChid(nodes, childboxID);
    }
  }

  qxEvent(event: QxTreeEmitEvent): void {

    console.log("-----------------------------------qxEvent----------------------------------");
    console.log(event.node.title);
    this.boxNodes[0].title = event.node.title;
    (<any>window).app.components.flex.setcurbox(event.node.key);
    let boxID = (<any>window).app.activeBoxes().boxIDs[0];
    this.ngZone.run(() => {
      let node = this.qxTreeComponent.getTreeNodeByKey(boxID);
      if (node) {
        if (node.isSelectable) {
          node.isSelected = true;
        }
      }
    });
  }

  async RebuildModel() {
    var t0 = performance.now();

    let boxID = (<any>window).app.activeBoxes().boxIDs[0];
    let rootboxID = (<any>window).app.components.flex.getFlexRoot(boxID);
    if (rootboxID) {
      let boxName = (<any>window).app.components.flex.getBoxName(rootboxID);
      boxName = boxName.charAt(0).toUpperCase() + boxName.slice(1);
      let boxNodesUpdated = [];
      boxNodesUpdated.push({ title: boxName, key: rootboxID, expanded: true, selected: false, children: [] });
      this.AddChidren(boxNodesUpdated[0].children, rootboxID);
      let afterTime = Date.now;
      // Update the model reference
      this.boxNodes = boxNodesUpdated;

      let node = this.qxTreeComponent.getTreeNodeByKey(boxID);
      if (node) {
        if (node.isSelectable) {
          node.isSelected = true;
        }
      }
      this.ref.detectChanges();

      var t1 = performance.now();
      console.log("Call to RebuildModel took " + (t1 - t0) + " milliseconds.");
    }
  }

  RegisterQXPCallBacks() {
    if ((<any>window).app) {
      console.log("register RegisterQXPCallBacks...");
      this._XT_CHGDOCSTAT = (<any>window).XPress.registerQXPCallbackHandler(0, 668, this.docStateChangeHandler.bind(this));
      this._XT_FLEX_POST_ATTATCH_ITEM = (<any>window).XPress.registerQXPCallbackHandler(0, 1542, this.PostAttachItemCallBackHandler.bind(this));
      this._XT_FLEX_POST_DETATCH_ITEM = (<any>window).XPress.registerQXPCallbackHandler(0, 1544, this.PostDetachItemCallBackHandler.bind(this));
      this._XT_FLEX_POST_REPARENT_ITEM = (<any>window).XPress.registerQXPCallbackHandler(0, 1548, this.PostReparentItemCallBackHandler.bind(this));
      this._XT_POST_DELETEITEM = (<any>window).XPress.registerQXPCallbackHandler(0, 1188, this.PostDeleteItemCallBackHandler.bind(this));

      // Undo/Redo
      this._XT_UNDO = (<any>window).XPress.registerQXPCallbackHandler(0, 488, this.UndoItemCallBackHandler.bind(this));
      this._XT_REDO = (<any>window).XPress.registerQXPCallbackHandler(0, 489, this.RedoItemCallBackHandler.bind(this));
    }
  }

  docStateChangeHandler(response) {
    console.log("docStateChange called from XPress..." + response);
    if ((<any>window).app.activeBoxes()) {
      let boxID = (<any>window).app.activeBoxes().boxIDs[0];
      this.ngZone.run(() => {
        let node = this.qxTreeComponent.getTreeNodeByKey(boxID);
        if (node) {
          if (node.isSelectable) {
            node.isSelected = true;
          }
        }
      });
    }
  }

  PostAttachItemCallBackHandler(response) {
    console.log('PostAttachItemCallBackHandler' + response)
    if ((<any>window).app.activeBoxes()) {
      let boxID = (<any>window).app.activeBoxes().boxIDs[0];
      (async () => {
        this.RebuildModel();
      })();
    }
  }

  PostDetachItemCallBackHandler(response) {
    console.log('PostDetachItemCallBackHandler' + response)
    if ((<any>window).app.activeBoxes()) {
      let boxID = (<any>window).app.activeBoxes().boxIDs[0];
      (async () => {
        this.RebuildModel();
      })();
    }
  }

  PostReparentItemCallBackHandler(response) {
    console.log('PostReparentItemCallBackHandler' + response)
    if ((<any>window).app.activeBoxes()) {
      let boxID = (<any>window).app.activeBoxes().boxIDs[0];
      (async () => {
        this.RebuildModel();
      })();
    }
  }

  PostDeleteItemCallBackHandler(response) {
    console.log('PostDeleteItemCallBackHandler' + response)
    if ((<any>window).app.activeBoxes()) {
      let boxID = (<any>window).app.activeBoxes().boxIDs[0];
      (async () => {
        this.RebuildModel();
      })();
    }
  }

  UndoItemCallBackHandler(response) {
    console.log('UndoItemCallBackHandler' + response)
    if ((<any>window).app.activeBoxes()) {
      let boxID = (<any>window).app.activeBoxes().boxIDs[0];
      (async () => {
        this.RebuildModel();
      })();
    }
  }

  RedoItemCallBackHandler(response) {
    console.log('RedoItemCallBackHandler' + response)
    if ((<any>window).app.activeBoxes()) {
      let boxID = (<any>window).app.activeBoxes().boxIDs[0];
      (async () => {
        this.RebuildModel();
      })();
    }
  }

  ngOnDestroy() {
    console.log("ngOnDestroy...");
    (<any>window).XPress.deRegisterQXPCallbackHandler(0, 668, this._XT_CHGDOCSTAT);
    (<any>window).XPress.deRegisterQXPCallbackHandler(0, 1542, this._XT_FLEX_POST_ATTATCH_ITEM);
    (<any>window).XPress.deRegisterQXPCallbackHandler(0, 1544, this._XT_FLEX_POST_DETATCH_ITEM);
    (<any>window).XPress.deRegisterQXPCallbackHandler(0, 1548, this._XT_FLEX_POST_REPARENT_ITEM);
    (<any>window).XPress.deRegisterQXPCallbackHandler(0, 1188, this._XT_POST_DELETEITEM);
    // undo/Redo
    (<any>window).XPress.deRegisterQXPCallbackHandler(0, 488, this._XT_UNDO);
    (<any>window).XPress.deRegisterQXPCallbackHandler(0, 489, this._XT_REDO);
  }

  // Drag-Drop

  OnDragStart(event: QxTreeEmitEvent): void {
    console.log("OnDragStart=" + event.node.title);
    this.draggedNodeKey = event.node.key;
    this.isDragStarted = true;
  }
  OnDragEnter(event: QxTreeEmitEvent): void {
    //console.log("OnDragEnter=" + event.node.title);
  }
  OnDragOver(event: QxTreeEmitEvent): void {
    //console.log("OnDragOver=" + event.node.title);
  }
  OnDragLeave(event: QxTreeEmitEvent): void {
    // console.log("OnDragLeave=" + event.node.title);
  }
  OnDrop(event: QxTreeEmitEvent): void {
    console.log("OnDrop=" + event.node.title);
    if (this.isDragStarted) {
      let draggedParentboxID = (<any>window).app.components.flex.getFlexParent(this.draggedNodeKey);

      if (event.node.isLeaf) {
        let isContainerBox = (<any>window).app.components.flex.isFlexContainer(event.node.key);
        if (isContainerBox) {
          let dropNodeParentID = (<any>window).app.components.flex.getFlexParent(this.draggedNodeKey);
          (<any>window).app.components.flex.flexRemoveChild(dropNodeParentID, this.draggedNodeKey);
          (<any>window).app.components.flex.flexAddChild(event.node.key, this.draggedNodeKey, 0);
        }
        else {
          let dropNodeParentID = (<any>window).app.components.flex.getFlexParent(event.node.key);
          let index = (<any>window).app.components.flex.getFlexChildIndex(dropNodeParentID, event.node.key);
          (<any>window).app.components.flex.flexRemoveChild(draggedParentboxID, this.draggedNodeKey);
          (<any>window).app.components.flex.flexAddChild(dropNodeParentID, this.draggedNodeKey, index);
        }
      }
      else {
        (<any>window).app.components.flex.flexRemoveChild(draggedParentboxID, this.draggedNodeKey);
        (<any>window).app.components.flex.flexAddChild(event.node.key, this.draggedNodeKey, 0);
      }
    }
  }
  OnDragEnd(event: QxTreeEmitEvent): void {
    console.log("OnDragEnd=" + event.node.title);
    this.isDragStarted = false;
  }
}