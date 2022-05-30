import { BrowserModule } from '@angular/platform-browser';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { QxModule } from '@quark/xpressng';

import { AppComponent } from './app.component';
import { DocumentComponent } from './document/document.component';
import { DocumentsListComponent } from './documents-list/documents-list.component';

import { TranslateService } from './translate/translate.service';
import { TranslatePipe } from './translate/translate.pipe';
import { TRANSLATION_PROVIDERS } from './translate/translations';

@NgModule({
  declarations: [
    AppComponent,
    DocumentComponent,
    DocumentsListComponent,
    TranslatePipe
  ],
  imports: [
    QxModule,
    BrowserModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [[TRANSLATION_PROVIDERS, TranslateService]],
  bootstrap: [AppComponent]
})
export class AppModule { }
