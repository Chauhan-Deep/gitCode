import { Component, ViewChild, ChangeDetectorRef, OnInit, OnDestroy } from '@angular/core';

import { measurementUnitTypes, IDropdownItem, DropDownType } from '@quark/xpressng';

import { MeasurementValuesService } from 'src/app/services/measurement-values.service';

@Component({
    selector: 'qrk-dimension-width',
    templateUrl: './dimension-width.component.html',
    styleUrls: ['./dimension-width.scss']
})
export class DimensionWidthComponent implements OnInit, OnDestroy {
    unit = measurementUnitTypes;
    currentValueWidth = '5in';
    dropdownType = DropDownType.kDropDownCustom;
    xpressEnv = (<any> window).app ? true : false;
    minValueLength = this.xpressEnv ? 0 << 16 : 0;
    maxValueLength = this.xpressEnv ? 10000 << 16 : 240;

    @ViewChild('width', { static: true}) width;

    dataList: IDropdownItem[] = [
        { id: 1, name: 'auto', hideTick: true },
        { id: 2, name: 'fixed', hideTick: true }
    ];

    selectedItem: IDropdownItem;

    constructor(private measurementValuesService: MeasurementValuesService,
                private changeDetectorRef: ChangeDetectorRef) {}

    ngOnInit() {
        console.log(this.width);
        this.selectedItem = this.dataList[0];

        this.measurementValuesService.cbSubject.subscribe((response) => {
            if (response['autofit-width']) {
                this.setCurrentValueWidth('auto');
            } else {
                this.setCurrentValueWidth(response['width']);
            }
        });
    }

    ngOnDestroy() {
        this.measurementValuesService.cbSubject.unsubscribe();
    }

    setCurrentValueWidth(value) {
        this.currentValueWidth = value;
        this.changeDetectorRef.detectChanges();
    }

    onItemChangeHandler(item, dropdownRef) {
        dropdownRef.selectedItem = item;
    }
}
