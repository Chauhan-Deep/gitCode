import { Component, Input, OnInit } from '@angular/core';
import { MatStepper } from '@angular/material/stepper';
@Component({
  selector: 'qrk-scan-files',
  templateUrl: './scan-files.component.html',
  styleUrls: ['./scan-files.component.scss']
})
export class ScanFilesComponent implements OnInit {
  @Input() stepper: MatStepper;
  constructor() { }

  ngOnInit() {
  }

}
