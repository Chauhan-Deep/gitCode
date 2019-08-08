import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { DropDownType, IDropdownItem, measurementUnitTypes } from '@quark/xpressng';
import { MeasurementPropertiesService } from '../../../services/measurement-properties.service';
import { TranslateService } from 'src/app/translate/translate.service';

@Component({
    selector: 'qrk-box-height',
    templateUrl: './box-height.component.html'
})
export class BoxHeightComponent implements OnInit, OnDestroy {
    private xpressEnv = (<any> window).app ? true : false;

    unit = measurementUnitTypes;
    minValue = this.xpressEnv ? 0 << 16 : 0;
    maxValue = this.xpressEnv ? 10000 << 16 : 240;
    currentHeight = '';
    dropdownType = DropDownType.kDropDownCustom;

    dataList: IDropdownItem[] = [
        { id: 999, name: this.translateService.localize('auto'), hideTick: true },
        { id: 2, name: this.translateService.localize('fixed'), hideTick: true }
    ];

    selectedItem = this.dataList[0];

    constructor(private measurementPropertiesService: MeasurementPropertiesService,
                private changeDetectorRef: ChangeDetectorRef,
                private translateService: TranslateService) { }

    ngOnInit() {
        this.measurementPropertiesService.measurementProperties.subscribe((response) => {
            if (response['autofit-height']) {
                this.dataList.forEach(element => {
                    if (element.id === 999) {
                        this.setCurrentHeight(element.name);
                        return;
                    }
                });
            } else {
                this.setCurrentHeight(response['height']);
            }
        });
    }

    ngOnDestroy() {
        this.measurementPropertiesService.measurementProperties.unsubscribe();
    }

    setCurrentHeight(value) {
        this.currentHeight = value;
        this.changeDetectorRef.detectChanges();
    }

    onItemChangeHandler(item) {
        this.selectedItem = item;
        this.changeDetectorRef.detectChanges();
    }
}
