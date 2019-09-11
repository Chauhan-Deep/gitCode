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
  private CHGDOCSTATCallbackHandlerID: number;

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
    this.boxNodes[0].title = boxName;
    this.boxNodes[0].key = rootboxID;
    this.AddChidren(this.boxNodes[0].children, rootboxID);
    this.docStateChange();
  }

  AddChid(nodes, flexboxID) {
    let childCount = (<any>window).app.components.flex.getFlexChildCount(flexboxID);
    let boxName = (<any>window).app.components.flex.getBoxName(flexboxID);
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
    this.draggedNodeKey = event.node.key;
    console.log("-----------------------------------qxEvent----------------------------------");
    console.log(event.node.title);
    this.boxNodes[0].title = event.node.title;
    (<any>window).app.components.flex.setcurbox(event.node.key);
    //this.RefreshTree();
  }

  RefreshTree() {
    var t0 = performance.now();

    let boxID = (<any>window).app.activeBoxes().boxIDs[0];
    let rootboxID = (<any>window).app.components.flex.getFlexRoot(boxID);
    if (rootboxID) {
      let boxName = (<any>window).app.components.flex.getBoxName(rootboxID);
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
      let boxID = (<any>window).app.activeBoxes().boxIDs[0];
      this.RefreshTree();
      this.ngZone.run(() => {
        let node = this.qxTreeComponent.getTreeNodeByKey(boxID);
        if (node) {
          if (node.isSelectable) {
            node.isSelected = true;
          }
        }
      });
    }

    if ((<any>window).app) {
      this.CHGDOCSTATCallbackHandlerID = (<any>window).XPress.registerQXPCallbackHandler(0, 668, callbackListener);
    }
  }

  ngOnDestroy() {
    (<any>window).XPress.deRegisterQXPCallbackHandler(0, 668, this.CHGDOCSTATCallbackHandlerID);
  }

  // Drag-Drop

  OnDragStart(event: QxTreeEmitEvent): void {
    console.log("OnDragStart=" + event.node.title);
  }
  OnDragEnter(event: QxTreeEmitEvent): void {
    this.isDragStarted = true;
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
    this.RefreshTree();
  }
  OnDragEnd(event: QxTreeEmitEvent): void {
    console.log("OnDragEnd=" + event.node.title);
  }
}