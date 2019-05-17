import {
    Component, OnInit, OnDestroy
} from '@angular/core';

import { NotificationService } from './notification.service';

@Component({
    selector: 'qrk-notify',
    templateUrl: './notification.component.html',
    styleUrls: ['./notification.component.scss']
})

export class NotificationComponent implements OnInit, OnDestroy {
    private showNotificationEvent: any;
    private alwaysShowNotificationEvent: any;
    private hideNotificationEvent: any;

    public displayMessage = '';
    public closeButtonDisplay = '';
    public message = '';

    constructor(private notificationService: NotificationService) {
        this.subscribeEvents();
    }

    ngOnInit() {
        this.subscribeEvents();
    }

    subscribeEvents() {
        this.showNotificationEvent = this.notificationService.showNotificationEvent.subscribe(this.showNotification.bind(this));
        this.alwaysShowNotificationEvent = this.notificationService.alwaysShowNotificationEvent
            .subscribe(this.alwaysShowNotification.bind(this));
        this.hideNotificationEvent = this.notificationService.hideNotificationEvent.subscribe(this.hideNotification.bind(this));
    }

    alwaysShowNotification(message) {
        this.displayMessage = this.closeButtonDisplay = 'block';
        this.message = message;
    }

    showNotification(message) {
        const self = this;
        this.displayMessage = 'block';
        this.message = message;
        setTimeout(function () {
            self.displayMessage = 'none';
        }, 5000);
    }

    hideNotification() {
        this.displayMessage = 'none';
    }

    unsubscribeEvents() {
        if (this.showNotificationEvent) {
            this.showNotificationEvent.unsubscribe();
            this.showNotificationEvent = undefined;
        }
        if (this.alwaysShowNotificationEvent) {
            this.alwaysShowNotificationEvent.unsubscribe();
            this.alwaysShowNotificationEvent = undefined;
        }
        if (this.hideNotificationEvent) {
            this.hideNotificationEvent.unsubscribe();
            this.hideNotificationEvent = undefined;
        }
    }

    ngOnDestroy() {
        this.unsubscribeEvents();
    }
}
