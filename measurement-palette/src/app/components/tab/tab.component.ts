import { Component, OnInit, ChangeDetectorRef} from '@angular/core';
import { BlockSeparatorType, measurementUnitTypes } from '@quark/xpressng';

@Component({
    selector: 'qrk-tab',
    templateUrl: './tab.component.html',
    styleUrls: ['./tab.component.scss']
})
export class TabComponent implements OnInit {
    activeTabIndex = 1;
    xpressEnv: boolean;
    BLOCK_SEPARATOR_TYPE = BlockSeparatorType.BELOW;
    unit = measurementUnitTypes;
    minValueAngle = -360 << 16;
    maxValueAngle = 360 << 16;
    minValueSkew = -75 << 16;
    maxValueSkew = 75 << 16;

    minValueLength = this.xpressEnv ? 0 << 16 : 0;
    maxValueLength = this.xpressEnv ? 10000 << 16 : 240;

    currentValueAngle = '30°';
    currentValueSkew = '30°';
    currentValueOriginX;
    currentValueOriginY;
    currentValueWidth = '2in';
    currentValueHeight = '3in';

    constructor(private changeDetectorRef: ChangeDetectorRef) { }

    ngOnInit() {
        this.xpressEnv = (<any> window).app ? true : false;

        const callbackListener = (response) => {
             response = JSON.parse(response);

             this.currentValueOriginX = response.positionX ? response.positionX : this.currentValueOriginX;
             this.currentValueOriginY = response.positionY ? response.positionY : this.currentValueOriginY;

             this.currentValueHeight = response.height ? response.height : this.currentValueHeight;
             this.currentValueWidth = response.width ? response.width : this.currentValueWidth;

             this.currentValueAngle = response.angle ? response.angle : this.currentValueAngle;
             this.currentValueSkew = response.skew ? response.skew : this.currentValueSkew;

             this.changeDetectorRef.detectChanges();
        };

        if (this.xpressEnv) {
            (<any> window).XPress.registerQXPCallbackHandler(1, 1560, callbackListener);
        }
    }

    tabChangeHandler(currentTab) {
        this.activeTabIndex = currentTab.id;
    }

    handleTextChange(currentState) {
        console.log(currentState);
    }
}
