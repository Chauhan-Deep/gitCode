import { Component, OnInit, Input } from '@angular/core';
import { MatStepper } from '@angular/material/stepper';

@Component({
  selector: 'qrk-launch-screen',
  templateUrl: './launch-screen.component.html',
  styleUrls: ['./launch-screen.component.scss']
})
export class LaunchScreenComponent implements OnInit {
  @Input() stepper: MatStepper;

  constructor() { }

  ngOnInit() {
  }

  nextScreen() {
    this.stepper.selected.completed = true;
    this.stepper.next();
  }

  skip() {
    window.alert('skip clicked');
  }
}
