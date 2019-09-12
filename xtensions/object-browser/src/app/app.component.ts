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
  private _XT_CHGDOCSTAT:number;
  private _XT_FLEX_POST_ATTATCH_ITEM: number;
  private _XT_FLEX_POST_DETATCH_ITEM: number;
  private _XT_POST_DELETEITEM: number;

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
    this.docStateChange();
    this.updateTree();
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

  async RefreshTree() {
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
      this.ref.detectChanges();

      var t1 = performance.now();
      console.log("Call to doSomething took " + (t1 - t0) + " milliseconds.");
    }
  }

  docStateChange() {
    const callbackListener = (response) => {
      response = JSON.parse(response);
      console.log("docStateChange called from XPress...");
      let boxID = (<any>window).app.activeBoxes().boxIDs[0];
      this.ngZone.run(() => {
        let node = this.qxTreeComponent.getTreeNodeByKey(boxID);
        if (node) {
          if (node.isSelectable) {
            node.isSelected = true;
          }
        }
      });
      return;
    }

    if ((<any>window).app) {
      console.log("registerQXPCallbackHandler...");
      this._XT_CHGDOCSTAT = (<any>window).XPress.registerQXPCallbackHandler(0, 668, callbackListener);
    }
  }

  updateTree() {
    const callbackListener = (response) => {
      response = JSON.parse(response);
      console.log("add/delete called from XPress...");
      let boxID = (<any>window).app.activeBoxes().boxIDs[0];
      (async () => {
        this.RefreshTree();
      })();
      this.ngZone.run(() => {
        let node = this.qxTreeComponent.getTreeNodeByKey(boxID);
        if (node) {
          if (node.isSelectable) {
            node.isSelected = true;
          }
        }
      });
      return;
    }

    if ((<any>window).app) {
      console.log("registerQXPCallbackHandler...");
      this._XT_FLEX_POST_ATTATCH_ITEM = (<any>window).XPress.registerQXPCallbackHandler(0, 1542, callbackListener);
      this._XT_FLEX_POST_DETATCH_ITEM = (<any>window).XPress.registerQXPCallbackHandler(0, 1544, callbackListener);
      this._XT_POST_DELETEITEM = (<any>window).XPress.registerQXPCallbackHandler(0, 1188, callbackListener);
    }
  }

  ngOnDestroy() {
    (<any>window).XPress.deRegisterQXPCallbackHandler(0, 668, this._XT_CHGDOCSTAT);
    (<any>window).XPress.deRegisterQXPCallbackHandler(0, 1542, this._XT_FLEX_POST_ATTATCH_ITEM);
    (<any>window).XPress.deRegisterQXPCallbackHandler(0, 1544, this._XT_FLEX_POST_DETATCH_ITEM);
    (<any>window).XPress.deRegisterQXPCallbackHandler(0, 1188, this._XT_POST_DELETEITEM);
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
        let dropNodeParentID = (<any>window).app.components.flex.getFlexParent(event.node.key);
        let index = (<any>window).app.components.flex.getFlexChildIndex(dropNodeParentID, event.node.key);
        (<any>window).app.components.flex.flexRemoveChild(draggedParentboxID, this.draggedNodeKey);
        (<any>window).app.components.flex.flexAddChild(dropNodeParentID, this.draggedNodeKey, index);
      }
      else {
        (<any>window).app.components.flex.flexRemoveChild(draggedParentboxID, this.draggedNodeKey);
        (<any>window).app.components.flex.flexAddChild(event.node.key, this.draggedNodeKey, 0);
      }
    }
    this.isDragStarted = false;
  }
  OnDragEnd(event: QxTreeEmitEvent): void {
    console.log("OnDragEnd=" + event.node.title);
  }
}