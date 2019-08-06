import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { DropDownType, IDropdownItem, measurementUnitTypes } from '@quark/xpressng';
import { MeasurementValuesService } from 'src/app/services/measurement-values.service';

@Component({
    selector: 'qrk-dimension-height',
    templateUrl: './dimension-height.component.html',
    styleUrls: ['./dimension-height.scss']
})
export class DimensionHeightComponent implements OnInit, OnDestroy {
    unit = measurementUnitTypes;
    currentValueHeight =  '';
    dropdownType = DropDownType.kDropDownCustom;
    xpressEnv = (<any> window).app ? true : false;
    minValueLength = this.xpressEnv ? 0 << 16 : 0;
    maxValueLength = this.xpressEnv ? 10000 << 16 : 240;

    dataList: IDropdownItem[] = [
        { id: 1, name: 'auto', hideTick: true },
        { id: 2, name: 'fixed', hideTick: true }
    ];

    selectedItem = this.dataList[0];

    constructor(private measurementValuesService: MeasurementValuesService,
                private changeDetectorRef: ChangeDetectorRef) {}

    ngOnInit() {
        this.measurementValuesService.cbSubject.subscribe((response) => {
            if (response['autofit-height']) {
                this.setCurrentValueHeight('auto');
            } else {
                this.setCurrentValueHeight(response['height']);
            }
            this.changeDetectorRef.detectChanges();
        });
    }

    ngOnDestroy() {
        this.measurementValuesService.cbSubject.unsubscribe();
    }

    setCurrentValueHeight(value) {
        this.currentValueHeight = value;
        this.changeDetectorRef.detectChanges();
    }

    onItemChangeHandler(item, dropdownRef) {
        dropdownRef.selectedItem = item;
    }
}
