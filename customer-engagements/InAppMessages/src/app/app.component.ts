import { Component } from '@angular/core';

import { TranslateService } from './translate/translate.service';

@Component({
  selector: 'qrk-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'InAppMessages';

  constructor(private translateService: TranslateService) {
    let browserLang = 'en-US';

    if ((<any>window).app) {
      browserLang = (<any>window).app.language.code;
    }

    this.translateService.use(browserLang);
  }
}
