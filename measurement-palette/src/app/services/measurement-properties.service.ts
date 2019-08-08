import { Injectable, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable()
export class MeasurementPropertiesService implements OnDestroy {
    private measurementCallbackHandlerID: number;
    measurementProperties = new Subject();

    getMeasurementProperties() {
        const callbackListener = (response) => {
            response = JSON.parse(response);
            this.measurementProperties.next(response);
        };

        if ((<any> window).app) {
            this.measurementCallbackHandlerID = (<any> window).XPress.registerQXPCallbackHandler(1, 1560, callbackListener);
        }
    }

    ngOnDestroy() {
        (<any> window).XPress.deRegisterQXPCallbackHandler(1, 1560, this.measurementCallbackHandlerID);
    }
}
