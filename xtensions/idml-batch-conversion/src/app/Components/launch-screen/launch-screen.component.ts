import { Component, OnInit, Input } from '@angular/core';
import { MatStepper } from '@angular/material/stepper';

import { CloseDialogService } from '../../Service/close-dialog.service';

@Component({
  selector: 'qrk-launch-screen',
  templateUrl: './launch-screen.component.html',
  styleUrls: ['./launch-screen.component.scss']
})
export class LaunchScreenComponent implements OnInit {
  @Input() stepper: MatStepper;
  cancelString = false;
  constructor(private closeDialogService: CloseDialogService) { }

  ngOnInit() {
    this.cancelString = this.getQueryString('calledFromMenu');
  }

  nextScreen() {
    this.stepper.selected.completed = true;
    this.stepper.next();
  }

  closeDialog() {
    this.closeDialogService.closeDialog();
  }
  getQueryString(field) {
    const url = new URL(window.location.href);
    const queryString = url.search;
    const searchParams = new URLSearchParams(queryString);

    return (searchParams.get(field) === 'true');
  }
}
