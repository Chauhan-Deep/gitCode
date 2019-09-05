import { Component, ViewChild } from '@angular/core';
import { QxTreeModule } from '@quark/xpressng';
import { QxTreeComponent, QxTreeNode, QxTreeNodeOptions, QxTreeEmitEvent, QxTreeBeforeDropEvent } from '@quark/xpressng';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})


export class AppComponent {

  @ViewChild('qxTreeComponent', { static: false }) qxTreeComponent: QxTreeComponent;

  title = 'object-browser';
 
  boxNodes = [
    {
      title: 'Root',
      key: '1',
      expanded: true,
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
}