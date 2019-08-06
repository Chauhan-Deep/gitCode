import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { measurementUnitTypes } from '@quark/xpressng';
import { MeasurementValuesService } from 'src/app/services/measurement-values.service';

@Component({
    selector: 'qrk-origin-across',
    templateUrl: './origin-across.component.html',
    styleUrls: ['./origin-across.scss']
})
export class OriginAcrossComponent implements OnInit, OnDestroy {
    xpressEnv = (<any> window).app ? true : false;
    unit = measurementUnitTypes;

    minValueLength = this.xpressEnv ? 0 << 16 : 0;
    maxValueLength = this.xpressEnv ? 10000 << 16 : 240;

    currentValueOriginX = '0in';

    constructor(private measurementValuesService: MeasurementValuesService,
                private changeDetectorRef: ChangeDetectorRef) {}

    ngOnInit() {
    this.measurementValuesService.cbSubject.subscribe((response) => {
        this.currentValueOriginX = response['positionX'];
        this.changeDetectorRef.detectChanges();
    });
   }

   ngOnDestroy() {
       this.measurementValuesService.cbSubject.unsubscribe();
   }
}
