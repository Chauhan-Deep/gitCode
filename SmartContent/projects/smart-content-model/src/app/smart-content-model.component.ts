import { Component } from '@angular/core';

@Component({
    selector: 'smart-content-model',
    templateUrl: './smart-content-model.component.html',
    styleUrls: ['./smart-content-model.component.scss']
})
export class SmartContentModelComponent {
    disabled = true;

    handleImport() {

    }

    handleUpdate() {

    }

    handleDelete() {

    }

    handleSave() {

    }

    handleCancel() {
        if ((window as any).app) {
            (window as any).app.dialogs.closeDialog();
        }
    }
}
