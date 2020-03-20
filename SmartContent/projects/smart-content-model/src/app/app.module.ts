import { BrowserModule } from '@angular/platform-browser';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { QxModule } from '@quark/xpressng';

import { AppRoutingModule } from './app-routing.module';
import { SmartContentModelComponent } from './smart-content-model.component';

@NgModule({
  declarations: [
    SmartContentModelComponent
  ],
  imports: [
    BrowserModule,
    QxModule,
    AppRoutingModule,
  ],
  providers: [],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  bootstrap: [SmartContentModelComponent]
})
export class AppModule { }
