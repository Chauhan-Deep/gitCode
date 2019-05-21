import { Injectable, EventEmitter } from '@angular/core';

@Injectable()
export class NotificationService {

    showNotificationEvent = new EventEmitter<any>();
    alwaysShowNotificationEvent = new EventEmitter<any>();
    hideNotificationEvent = new EventEmitter<any>();

    constructor() { }

    show(message) {
        this.showNotificationEvent.emit(message);
    }

    alwaysShow(message) {
        this.alwaysShowNotificationEvent.emit(message);
    }

    hide() {
        this.hideNotificationEvent.emit();
    }
}
