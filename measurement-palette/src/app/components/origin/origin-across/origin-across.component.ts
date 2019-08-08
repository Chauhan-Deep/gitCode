import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { measurementUnitTypes } from '@quark/xpressng';
import { MeasurementPropertiesService } from '../../../services/measurement-properties.service';

@Component({
    selector: 'qrk-origin-across',
    templateUrl: './origin-across.component.html',
    styleUrls: ['./origin-across.component.scss']
})
export class OriginAcrossComponent implements OnInit, OnDestroy {
    private xpressEnv = (<any> window).app ? true : false;

    unit = measurementUnitTypes;
    minValue = this.xpressEnv ? 0 << 16 : 0;
    maxValue = this.xpressEnv ? 10000 << 16 : 240;
    currentOriginAcross = '0in';

    constructor(private measurementPropertiesService: MeasurementPropertiesService,
                private changeDetectorRef: ChangeDetectorRef) { }

    ngOnInit() {
        this.measurementPropertiesService.measurementProperties.subscribe((response) => {
            this.setCurrentOriginAcross(response['positionX']);
        });
    }

    setCurrentOriginAcross(value) {
        this.currentOriginAcross = value;
        this.changeDetectorRef.detectChanges();
    }

    ngOnDestroy() {
        this.measurementPropertiesService.measurementProperties.unsubscribe();
    }
}
