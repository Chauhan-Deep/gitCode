import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-launch-screen',
  templateUrl: './launch-screen.component.html',
  styleUrls: ['./launch-screen.component.css']
})
export class LaunchScreenComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }
  nextScreen()
  {
    window.alert("next screen");
  }
  skip()
  {
    window.alert("skip clicked");
  }
}
