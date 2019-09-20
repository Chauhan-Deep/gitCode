import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'qrk-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {
  constructor() { }

  ngOnInit() {
  }

  helpBtnAction() {
    window.alert('help button clicked');
  }

}
