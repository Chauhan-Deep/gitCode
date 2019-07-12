import { Component, OnInit } from '@angular/core';
import { BlockSeparatorType } from '@quark/xpressng';

@Component({
    selector: 'qrk-tab',
    templateUrl: './tab.component.html',
    styleUrls: ['./tab.component.scss']
})
export class TabComponent implements OnInit {
    activeTabIndex = 1;
    BLOCK_SEPARATOR_TYPE = BlockSeparatorType.BELOW;

    ngOnInit() {
    }

    tabChangeHandlerVertical(currentTab) {
        this.activeTabIndex = currentTab.id;
    }
}
