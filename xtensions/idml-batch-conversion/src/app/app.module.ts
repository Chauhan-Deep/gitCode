import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { MatStepperModule } from '@angular/material/stepper';

import { QxModule } from '@quark/xpressng';

import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { LaunchScreenComponent } from './launch-screen/launch-screen.component';
import { ScanFilesComponent } from './scan-files/scan-files.component';

@NgModule({
  declarations: [
    AppComponent,
    LaunchScreenComponent,
    ScanFilesComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MatStepperModule,
    QxModule,
    AppRoutingModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  entryComponents: [
    ScanFilesComponent]
})
export class AppModule { }
