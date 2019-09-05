import { Component } from '@angular/core';

import { TranslateService } from './translate/translate.service';

@Component({
  selector: 'qrk-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'idml-batch-conversion';

  constructor(private translateService: TranslateService) {
    let browserLang = 'en-US';

    if ((window as any).app) {
      browserLang = (window as any).app.language.code;
    }

    this.translateService.use(browserLang);
  }
}
