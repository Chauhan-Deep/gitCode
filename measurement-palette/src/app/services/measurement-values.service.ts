import { Injectable, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable()
export class MeasurementValuesService implements OnDestroy {
    cbSubject = new Subject();
    measurementCallbackHandlerID: number;

    getMeasurementValues() {
        const callbackListener = (response) => {
            response = JSON.parse(response);
            this.cbSubject.next(response);
        };

        if ((<any> window).app) {
            this.measurementCallbackHandlerID = (<any> window).XPress.registerQXPCallbackHandler(1, 1560, callbackListener);
        }
    }

    ngOnDestroy() {
        (<any> window).XPress.deRegisterQXPCallbackHandler(1, 1560, this.measurementCallbackHandlerID);
    }
}
