import { Component, OnInit } from '@angular/core';

import { MeasurementPropertiesService } from './services/measurement-properties.service';
import { TranslateService } from './translate/translate.service';

@Component({
  selector: 'qrk-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'Measurement Palette';

  constructor(private measurementPropertiesService: MeasurementPropertiesService,
              private translateService: TranslateService) {
    let browserLang = 'en-US';

    if ((<any> window).app) {
      browserLang = (<any> window).app.language.code;
    }

    this.translateService.use(browserLang);
  }

  ngOnInit() {
    this.measurementPropertiesService.getMeasurementProperties();
  }
}
