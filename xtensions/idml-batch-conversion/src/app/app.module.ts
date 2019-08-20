import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatStepperModule } from '@angular/material/stepper';
import { MatIconModule, MatButtonModule } from '@angular/material';

import { QxModule } from '@quark/xpressng';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LaunchScreenComponent } from './launch-screen/launch-screen.component';
import { ScanFilesComponent } from './scan-files/scan-files.component';
import { DynamicContainerComponent } from './dynamic-container/dynamic-container.component';
import { DynamicComponentDirective } from './dynamic-component.directive';

@NgModule({
  declarations: [
    AppComponent,
    LaunchScreenComponent,
    ScanFilesComponent,
    DynamicContainerComponent,
    DynamicComponentDirective
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    MatStepperModule,
    MatIconModule,
    MatButtonModule,
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
