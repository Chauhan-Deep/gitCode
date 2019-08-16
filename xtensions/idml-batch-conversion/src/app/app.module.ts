import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { QxModule } from '@quark/xpressng';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { LaunchScreenComponent } from './launch-screen/launch-screen.component';

@NgModule({
  declarations: [
    AppComponent,
    LaunchScreenComponent
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
