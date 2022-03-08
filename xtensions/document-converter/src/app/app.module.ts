import { BrowserModule } from '@angular/platform-browser';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { QxModule } from '@quark/xpressng';

import { AppComponent } from './app.component';
import { DocumentComponent } from './document/document.component';
import { DocumentsListComponent } from './documents-list/documents-list.component';

@NgModule({
  declarations: [
    AppComponent,
    DocumentComponent,
    DocumentsListComponent
  ],
  imports: [
    QxModule,
    BrowserModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
