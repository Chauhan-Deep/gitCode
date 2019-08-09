import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { QxModule } from '@quark/xpressng';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    QxModule
  ],
  providers: [],
  bootstrap: [AppComponent],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class AppModule { }
