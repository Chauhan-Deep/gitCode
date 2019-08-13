import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'qrk-launch-screen',
  templateUrl: './launch-screen.component.html',
  styleUrls: ['./launch-screen.component.scss']
})
export class LaunchScreenComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }
  nextScreen() {
    window.alert('next screen');
  }
  skip() {
    window.alert('skip clicked');
  }
}
