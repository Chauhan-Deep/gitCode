import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { DropDownType, IDropdownItem, measurementUnitTypes } from '@quark/xpressng';
import { MeasurementPropertiesService } from '../../../services/measurement-properties.service';
import { TranslateService } from 'src/app/translate/translate.service';

@Component({
    selector: 'qrk-box-width',
    templateUrl: './box-width.component.html'
})
export class BoxWidthComponent implements OnInit, OnDestroy {
    private xpressEnv = (<any> window).app ? true : false;

    unit = measurementUnitTypes;
    currentWidth = '';
    dropdownType = DropDownType.kDropDownCustom;
    minValue = this.xpressEnv ? 0 << 16 : 0;
    maxValue = this.xpressEnv ? 10000 << 16 : 240;

    auto = this.translateService.localize('auto');
    fixed = this.translateService.localize('fixed');

    dataList: IDropdownItem[] = [
        { id: 999, name: this.auto, hideTick: true },
        { id: 2, name: this.fixed, hideTick: true }
    ];

    selectedItem: IDropdownItem;

    constructor(private measurementPropertiesService: MeasurementPropertiesService,
                private changeDetectorRef: ChangeDetectorRef,
                private translateService: TranslateService) { }

    ngOnInit() {
        this.selectedItem = this.dataList[0];
        this.measurementPropertiesService.measurementProperties.subscribe(this.setCurrentWidth.bind(this));
    }

    ngOnDestroy() {
        this.measurementPropertiesService.measurementProperties.unsubscribe();
    }

    setCurrentWidth(value) {
        if (value['autofit-width']) {
            this.dataList.forEach(element => {
                if (element.id === 999) {
                    this.currentWidth = element.name;
                    this.selectedItem = element;
                }
            });
        } else {
            this.currentWidth = value['width'];
        }
        this.changeDetectorRef.detectChanges();
    }

    onItemChangeHandler(item) {
        this.selectedItem = item;
        this.changeDetectorRef.detectChanges();
    }
}
