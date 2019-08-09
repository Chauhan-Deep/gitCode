import { Component } from '@angular/core';
import { BlockSeparatorType, measurementUnitTypes } from '@quark/xpressng';

@Component({
    selector: 'qrk-tab',
    templateUrl: './tab.component.html',
    styleUrls: ['./tab.component.scss']
})
export class TabComponent {
    activeTabIndex = 1;
    BLOCK_SEPARATOR_TYPE = BlockSeparatorType.BELOW;

    constructor() { }

    tabChangeHandler(currentTab) {
        this.activeTabIndex = currentTab.id;
    }
}
