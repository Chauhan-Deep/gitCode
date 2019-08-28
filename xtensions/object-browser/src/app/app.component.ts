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

  title = 'PROJECT-NAME';
  defaultCheckedKeys = ['10020'];
  defaultSelectedKeys = ['10010', '10020'];
  defaultExpandedKeys = ['100', '1001'];
 
  boxNodes = [
    {
      title: 'Box1',
      key: '1',
      expanded: true,
      children: [
        {
          title: 'Box1Children',
          key: '0-0-0',
          checked: true,
          expanded: true,
          children: [
            { title: 'Box11', selected: true, key: '0-0-0-0', isLeaf: true },
            { title: 'Box12', key: '0-0-0-1', isLeaf: true },
            { title: 'Box13', key: '0-0-0-2', isLeaf: true }
          ]
        },
      ]
    },
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

  qxEvent(event: QxTreeEmitEvent): void {
    let selectedNodes = this.qxTreeComponent.getSelectedNodeList();
   if (selectedNodes.length >0) {
    console.log(selectedNodes[0].title);
   }
  }
}