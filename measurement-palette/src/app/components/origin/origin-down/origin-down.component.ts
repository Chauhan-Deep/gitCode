import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { measurementUnitTypes } from '@quark/xpressng';
import { MeasurementPropertiesService } from '../../../services/measurement-properties.service';

@Component({
    selector: 'qrk-origin-down',
    templateUrl: './origin-down.component.html'
})
export class OriginDownComponent implements OnInit, OnDestroy {
    xpressEnv = (<any> window).app ? true : false;
    unit = measurementUnitTypes;

    minValueLength = this.xpressEnv ? 0 << 16 : 0;
    maxValueLength = this.xpressEnv ? 10000 << 16 : 240;

    currentOriginDown = '0in';

    constructor(private measurementPropertiesService: MeasurementPropertiesService,
                private changeDetectorRef: ChangeDetectorRef) { }

    ngOnInit() {
        this.measurementPropertiesService.measurementProperties.subscribe(this.setCurrentOriginDown.bind(this));
    }

    setCurrentOriginDown(value) {
        this.currentOriginDown = value.positionY;
        this.changeDetectorRef.detectChanges();
    }

    ngOnDestroy() {
        this.measurementPropertiesService.measurementProperties.unsubscribe();
    }
}
