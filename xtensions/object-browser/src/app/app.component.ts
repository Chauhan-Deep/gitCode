import { Component, ViewChild, NgZone, ChangeDetectorRef, OnInit, OnDestroy, HostListener } from '@angular/core';
import { QxTreeModule, QxTreeNodeComponent } from '@quark/xpressng';
import { QxTreeComponent, QxTreeNode, QxTreeNodeOptions, QxTreeEmitEvent, QxTreeBeforeDropEvent } from '@quark/xpressng';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})


export class AppComponent implements OnInit, OnDestroy {

  constructor(ngZone: NgZone, private ref: ChangeDetectorRef) {
    this.ngZone = ngZone;
  }
  ngZone: NgZone;

  @ViewChild('qxTreeComponent', { static: false }) qxTreeComponent: QxTreeComponent;


  mInterval;

  mlayoutID = -1;
  mCurPage = -1;
  isDirty = false;
  isDragStarted = false;
  draggedNodeKey = '';
  title = 'object-browser';
  private _XT_CHGDOCSTAT: number;
  private _XT_FLEX_POST_ATTATCH_ITEM: number;
  private _XT_FLEX_POST_DETATCH_ITEM: number;
  private _XT_FLEX_POST_REPARENT_ITEM: number;
  private _XT_POST_DELETEITEM: number;
  private _XT_PROJECT_READ_COMPLETE: number;
  private _XT_CLOSE: number;
  private _XT_UNDO: number;
  private _XT_REDO: number;
  private _XT_FLEX_POST_REORDER_ITEM: number;
  private _XT_POST_PICTURE_IMPORT: number;
  private _XT_POSTPICCONTENT_DELETE: number;
  private _XT_BOX_ATTRIBUTE_CHANGE: number;

  boxNodes = [
    {
      title: 'Root',
      key: '1',
      expanded: true,
      selected: false,
      children: []
    }
  ];
  @HostListener('window:unload', ['$event'])
  unloadHandler(event) {
    if (this.mInterval) {
      clearInterval(this.mInterval);
    }
  }

  traverse_it(obj) {
    for (const prop in obj) {
      if (typeof obj[prop] === 'object') {
        // object
        this.traverse_it(obj[prop]);
      } else {
        // something else
        if (prop === 'title') {
          console.log(obj[prop]);
        }
      }
    }
  }

  ngOnInit() {
    console.log('ngOnInit');

    this.RebuildModel();
    this.RegisterQXPCallBacks();
  }

  AddChid(nodes, flexboxID) {
    const childCount = (window as any).app.components.flex.getFlexChildCount(flexboxID);
    let boxName = (window as any).app.components.flex.getBoxName(flexboxID);
    boxName = boxName.charAt(0).toUpperCase() + boxName.slice(1);
    const childdata = {
      title: boxName,
      key: flexboxID,
      expanded: true,
      children: [],
      selected: false,
      isLeaf: (childCount === undefined) || childCount === 0
    };
    nodes.push(childdata);

    if (childCount > 0) {
      this.AddChidren(childdata.children, flexboxID);
    }
  }

  AddChidren(nodes, flexboxID) {
    const childCount = (window as any).app.components.flex.getFlexChildCount(flexboxID);
    for (let j = 0; j < childCount; j++) {
      const childboxID = (window as any).app.components.flex.getFlexChildAtIndex(flexboxID, j);
      this.AddChid(nodes, childboxID);
    }
  }

  OnRightCLick(event: QxTreeEmitEvent): void {
    console.log('-OnRightCLick-');
    (window as any).app.components.flex.setcurbox(event.node.key);
    if (event.node.isSelectable) {
      event.node.isSelected = true;
    }

    (window as any).app.components.flex.showContextMenu(event.node.key,
        ((event.event) as MouseEvent).screenX,
        ((event.event) as MouseEvent).screenY);
  }


  qxEvent(event: QxTreeEmitEvent): void {
    console.log('-----------------------------------qxEvent----------------------------------');
    console.log(event.node.title);
    this.boxNodes[0].title = event.node.title;
    (window as any).app.components.flex.setcurbox(event.node.key);
    const boxID = (window as any).app.activeBoxes().boxIDs[0];
    (window as any).app.components.flex.updateMenu(false);
    if (boxID) {
      const node = this.qxTreeComponent.getTreeNodeByKey(boxID);
      if (node) {
        if (node.isSelectable) {
          node.isSelected = true;
        }
      }
    }
  }

  OnMouseOver(event: QxTreeEmitEvent): void {
    (window as any).app.components.flex.highlightMouseOver(event.node.key);
  }

  // async RebuildModel() {
  //   const t0 = performance.now();

  //   const boxID = (window as any).app.activeBoxes().boxIDs[0];
  //   const rootboxID = (window as any).app.components.flex.getFlexRoot(boxID);
  //   if (rootboxID) {
  //     let boxName = (window as any).app.components.flex.getBoxName(rootboxID);
  //     boxName = boxName.charAt(0).toUpperCase() + boxName.slice(1);
  //     const boxNodesUpdated = [];
  //     boxNodesUpdated.push({ title: boxName, key: rootboxID, expanded: true, selected: false, children: [] });
  //     this.AddChidren(boxNodesUpdated[0].children, rootboxID);
  //     const t1 = performance.now();
  //     console.log('Call to make tree took ' + (t1 - t0) + ' milliseconds.');

  //     // Update the model reference
  //     this.boxNodes = boxNodesUpdated;

  //     const node = this.qxTreeComponent.getTreeNodeByKey(boxID);
  //     if (node) {
  //       if (node.isSelectable) {
  //         node.isSelected = true;
  //       }
  //     }
  //     this.ref.detectChanges();

  //     const t2 = performance.now();
  //     console.log('Call to RebuildModel took ' + (t2 - t0) + ' milliseconds.');
  //   }
  // }

  async RebuildModel() {
    const t0 = performance.now();
    const activeboxes = (window as any).app.activeBoxes();
    if (activeboxes) {
      const boxId = (window as any).app.activeBoxes().boxIDs[0];
      if (boxId) {
        const newModel = (window as any).app.components.flex.getFlexDataModel(boxId);
        const t1 = performance.now();
        console.log('Call to make tree took ' + (t1 - t0) + ' milliseconds.');

        // Update the model reference
        this.boxNodes = newModel;
        this.ref.detectChanges();
        const t2 = performance.now();
        console.log('Call to RebuildModel took ' + (t2 - t0) + ' milliseconds.');
      }
    } else {
      const newModel = (window as any).app.components.flex.getFlexDataModel(0);
      const t1 = performance.now();
      console.log('Call to make tree took ' + (t1 - t0) + ' milliseconds.');

      // Update the model reference
      this.boxNodes = newModel;
      this.ref.detectChanges();
      const t2 = performance.now();
      console.log('Call to RebuildModel took ' + (t2 - t0) + ' milliseconds.');
    }
  }

  PeriodicRefresh(text: string): void {
    console.log('PeriodicRefresh');

    const layout = (window as any).app.activeLayout();
    const layoutID = layout.layoutID;
    const curPage = layout.getCurrentPage();

    if (this.mlayoutID === layoutID) {
      if (layoutID !== -1) {
        if (this.mCurPage !== curPage) {
          this.isDirty = true;
          this.mCurPage = curPage;
        }
      }
    } else {
      this.isDirty = true;
      this.mlayoutID = layoutID;
    }
    const selectedboxes = (window as any).app.activeBoxes();
    if (selectedboxes) {
      const boxId = (window as any).app.activeBoxes().boxIDs[0];
      if (boxId) {
        const rootBoxID = (window as any).app.components.flex.getFlexRoot(boxId);
        if (this.boxNodes[0].key !== rootBoxID) {
            this.isDirty = true;
        }
      }
    }

    if (this.isDirty) {
      console.log('PeriodicRefresh is Dirty');
      (async () => {
        this.RebuildModel();
      })();
      this.isDirty = false;
      (window as any).app.components.flex.updateMenu(false);
    }
    const activeboxes = (window as any).app.activeBoxes();
    if (activeboxes) {
      const boxID = (window as any).app.activeBoxes().boxIDs[0];

      if (boxID) {
        const selectedNode = this.qxTreeComponent.getTreeNodeByKey(boxID);
        if (selectedNode) {
          if (selectedNode.isSelectable && !selectedNode.isSelected) {
              let node = selectedNode;
              while (node != null) {
                node.isExpanded = true;
                node = node.parentNode;
              }
              selectedNode.isSelected = true;
              setTimeout(() => this.scrollToVisible(selectedNode), 0);
          }
        }
      }
    }
  }

  scrollToVisible(selectedNode: QxTreeNode) {
    if (selectedNode.children.length > 0) {
      const dcom = (selectedNode.component);
      (dcom as any).elRef.nativeElement.scrollIntoView(true);

    } else {
      const dcom = (selectedNode.component);
      (dcom as any).elRef.nativeElement.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
        inline: 'center'
      });
    }
  }

  RegisterQXPCallBacks() {
    if ((window as any).app) {
      console.log('register RegisterQXPCallBacks...');
      this._XT_CHGDOCSTAT = (window as any).XPress.registerQXPCallbackHandler(0, 668, this.docStateChangeHandler.bind(this));
      this._XT_FLEX_POST_ATTATCH_ITEM
        = (window as any).XPress.registerQXPCallbackHandler(0, 1542, this.PostAttachItemCallBackHandler.bind(this));
      this._XT_FLEX_POST_DETATCH_ITEM
        = (window as any).XPress.registerQXPCallbackHandler(0, 1544, this.PostDetachItemCallBackHandler.bind(this));
      this._XT_FLEX_POST_REPARENT_ITEM
        = (window as any).XPress.registerQXPCallbackHandler(0, 1548, this.PostReparentItemCallBackHandler.bind(this));
      this._XT_POST_DELETEITEM
        = (window as any).XPress.registerQXPCallbackHandler(0, 1188, this.PostDeleteItemCallBackHandler.bind(this));
      this._XT_FLEX_POST_REORDER_ITEM
        = (window as any).XPress.registerQXPCallbackHandler(0, 1546, this.PostReorderItemCallBackHandler.bind(this));

        // picture
      this._XT_POST_PICTURE_IMPORT
        = (window as any).XPress.registerQXPCallbackHandler(0, 586, this.PostPictureImportCallBackHandler.bind(this));
      this._XT_POSTPICCONTENT_DELETE
        = (window as any).XPress.registerQXPCallbackHandler(0, 857, this.PostPictureContentDeleteBackHandler.bind(this));
      this._XT_BOX_ATTRIBUTE_CHANGE
        = (window as any).XPress.registerQXPCallbackHandler(0, 1615, this.PostBoxAttributeChangeBackHandler.bind(this));

      // Undo/Redo
      this._XT_UNDO = (window as any).XPress.registerQXPCallbackHandler(0, 488, this.UndoItemCallBackHandler.bind(this));
      this._XT_REDO = (window as any).XPress.registerQXPCallbackHandler(0, 489, this.RedoItemCallBackHandler.bind(this));

      // open/Close doc
      this._XT_PROJECT_READ_COMPLETE = (window as any).XPress.registerQXPCallbackHandler(0, 1065, this.OpenDocCallBackHandler.bind(this));
      this._XT_CLOSE = (window as any).XPress.registerQXPCallbackHandler(0, 32, this.CloseDocCallBackHandler.bind(this));
    }
    this.mInterval = setInterval(() => this.PeriodicRefresh('Repeat'), 10);
  }

  docStateChangeHandler(response) {
    console.log('docStateChange called from XPress...' + response);
  }

  PostPictureImportCallBackHandler(response) {
    console.log('PostPictureImportCallBackHandler' + response);
    this.isDirty = true;
  }

  PostPictureContentDeleteBackHandler(response) {
    console.log('PostPictureContentDeleteBackHandler' + response);
    this.isDirty = true;
  }

  PostBoxAttributeChangeBackHandler(response) {
    console.log('PostBoxAttributeChangeBackHandler' + response);
    this.isDirty = true;
  }

  PostAttachItemCallBackHandler(response) {
    console.log('PostAttachItemCallBackHandler' + response);
    this.isDirty = true;
  }

  PostDetachItemCallBackHandler(response) {
    console.log('PostDetachItemCallBackHandler' + response);
    this.isDirty = true;
  }

  PostReparentItemCallBackHandler(response) {
    console.log('PostReparentItemCallBackHandler' + response);
    this.isDirty = true;
  }

  PostReorderItemCallBackHandler(response) {
    console.log('PostReorderItemCallBackHandler' + response);
    this.isDirty = true;
  }

  PostDeleteItemCallBackHandler(response) {
    console.log('PostDeleteItemCallBackHandler' + response);
    this.isDirty = true;
  }

  UndoItemCallBackHandler(response) {
    console.log('UndoItemCallBackHandler' + response);
    this.isDirty = true;
  }

  RedoItemCallBackHandler(response) {
    console.log('RedoItemCallBackHandler' + response);
    this.isDirty = true;
  }
  OpenDocCallBackHandler(response) {
    console.log('OpenDocCallBackHandler' + response);
    this.isDirty = true;
  }
  CloseDocCallBackHandler(response) {
    console.log('CloseDocCallBackHandler' + response);
    this.isDirty = true;
  }

  ngOnDestroy() {
    if (this.mInterval) {
      clearInterval(this.mInterval);
    }
    console.log('ngOnDestroy...');


    (window as any).XPress.deRegisterQXPCallbackHandler(0, 668, this._XT_CHGDOCSTAT);
    (window as any).XPress.deRegisterQXPCallbackHandler(0, 1542, this._XT_FLEX_POST_ATTATCH_ITEM);
    (window as any).XPress.deRegisterQXPCallbackHandler(0, 1544, this._XT_FLEX_POST_DETATCH_ITEM);
    (window as any).XPress.deRegisterQXPCallbackHandler(0, 1548, this._XT_FLEX_POST_REPARENT_ITEM);
    (window as any).XPress.deRegisterQXPCallbackHandler(0, 1188, this._XT_POST_DELETEITEM);
    (window as any).XPress.deRegisterQXPCallbackHandler(0, 1546, this._XT_FLEX_POST_REORDER_ITEM);
    // Picture
    (window as any).XPress.deRegisterQXPCallbackHandler(0, 586, this._XT_POST_PICTURE_IMPORT);
    (window as any).XPress.deRegisterQXPCallbackHandler(0, 857, this._XT_POSTPICCONTENT_DELETE);
    (window as any).XPress.deRegisterQXPCallbackHandler(0, 1615, this._XT_BOX_ATTRIBUTE_CHANGE);

    // undo/Redo
    (window as any).XPress.deRegisterQXPCallbackHandler(0, 488, this._XT_UNDO);
    (window as any).XPress.deRegisterQXPCallbackHandler(0, 489, this._XT_REDO);
    // open/close doc
    (window as any).XPress.deRegisterQXPCallbackHandler(0, 1065, this._XT_PROJECT_READ_COMPLETE);
  }

  // Drag-Drop

  OnDragStart(event: QxTreeEmitEvent): void {
    console.log('OnDragStart=' + event.node.title);
    this.draggedNodeKey = event.node.key;
    this.isDragStarted = true;
  }
  OnDragEnter(event: QxTreeEmitEvent): void {
    // console.log("OnDragEnter=" + event.node.title);
  }
  OnDragOver(event: QxTreeEmitEvent): void {
    // console.log("OnDragOver=" + event.node.title);
  }
  OnDragLeave(event: QxTreeEmitEvent): void {
    // console.log("OnDragLeave=" + event.node.title);
  }
  OnDrop(event: QxTreeEmitEvent): void {
    console.log('OnDrop=' + event.node.title);
    if (this.isDragStarted) {
      const relPos = ((event.node.component) as any).dragPos;
      (window as any).app.components.flex.performDragDrop(this.draggedNodeKey, event.node.key, relPos);
      this.SelectBox(this.draggedNodeKey);
    }
  }
  OnDragEnd(event: QxTreeEmitEvent): void {
    console.log('OnDragEnd=' + event.node.title);
    this.isDragStarted = false;
  }

  SelectBox(key: string) {
    (window as any).app.components.flex.setcurbox(key);
    const boxID = (window as any).app.activeBoxes().boxIDs[0];
    if (boxID) {
      const node = this.qxTreeComponent.getTreeNodeByKey(boxID);
      if (node) {
        if (node.isSelectable) {
          node.isSelected = true;
        }
      }
    }
  }
}
