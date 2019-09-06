import { Component, ViewChild, NgZone } from '@angular/core';
import { QxTreeModule } from '@quark/xpressng';
import { QxTreeComponent, QxTreeNode, QxTreeNodeOptions, QxTreeEmitEvent, QxTreeBeforeDropEvent } from '@quark/xpressng';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})


export class AppComponent {
  ngZone : NgZone;

  constructor(_ngZone: NgZone) {
    this.ngZone = _ngZone;
  }

  @ViewChild('qxTreeComponent', { static: false }) qxTreeComponent: QxTreeComponent;

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

  traverse_it(obj){
    for(var prop in obj){
        if(typeof obj[prop]=='object'){
            // object
            this.traverse_it(obj[prop]);
        }else{
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
    console.log("boxID="+boxID);
    let count = (<any>window).app.components.flex.getFlexChildCount(boxID);
    console.log("count="+count);
    let boxName = (<any>window).app.components.flex.getBoxName(boxID);
    this.boxNodes[0].title = boxName;
    this.boxNodes[0].key = boxID;
    this.AddChidren(this.boxNodes[0].children, boxID);
    this.docStateChange();
  }

  AddChid(nodes, flexboxID)
  {    
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
  
  AddChidren(nodes, flexboxID)
  {
    let childCount = (<any>window).app.components.flex.getFlexChildCount(flexboxID);
    console.log("childCount");
    for (var j = 0; j < childCount; j++) {
      let childboxID = (<any>window).app.components.flex.getFlexChildAtIndex(flexboxID, j);
      this.AddChid(nodes, childboxID);
    }
  }

  qxEvent(event: QxTreeEmitEvent): void {
    console.log("qxEvent");
    console.log(event.node.title);
    this.boxNodes[0].title = event.node.title;
    (<any>window).app.components.flex.setcurbox(event.node.key);
  }

  docStateChange() { 
      let _this = this;
      const callbackListener = (response) => {
       response = JSON.parse(response);
        let boxID = (<any>window).app.activeBoxes().boxIDs[0];
        console.log("boxID="+boxID);
        this.ngZone.run(() => {  
        let node = this.qxTreeComponent.getTreeNodeByKey(boxID);
        if (node) {
          if (node.isSelectable) {
            node.isSelected = true; 
          }
        }
      });
    }

  if ((<any> window).app) {
      this.CHGDOCSTATCallbackHandlerID = (<any> window).XPress.registerQXPCallbackHandler(0, 668, callbackListener);
  }
}

ngOnDestroy() {
  (<any> window).XPress.deRegisterQXPCallbackHandler(1, 668, this.CHGDOCSTATCallbackHandlerID);
}
}

