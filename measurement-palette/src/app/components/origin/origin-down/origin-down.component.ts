import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { measurementUnitTypes } from '@quark/xpressng';
import { MeasurementValuesService } from 'src/app/services/measurement-values.service';

@Component({
    selector: 'qrk-origin-down',
    templateUrl: './origin-down.component.html',
    styleUrls: ['./origin-down.scss']
})
export class OriginDownComponent implements OnInit, OnDestroy {
    xpressEnv = (<any> window).app ? true : false;
    unit = measurementUnitTypes;

    minValueLength = this.xpressEnv ? 0 << 16 : 0;
    maxValueLength = this.xpressEnv ? 10000 << 16 : 240;

    currentValueOriginY = '0in';

    constructor(private measurementValuesService: MeasurementValuesService,
                private changeDetectorRef: ChangeDetectorRef) { }

    ngOnInit() {
        this.measurementValuesService.cbSubject.subscribe((response) => {
            this.currentValueOriginY = response['positionY'];
            this.changeDetectorRef.detectChanges();
        });
    }

    ngOnDestroy() {
        this.measurementValuesService.cbSubject.unsubscribe();
    }
}
