import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { MatStepperModule } from '@angular/material/stepper';

import { QxModule } from '@quark/xpressng';

import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { LaunchScreenComponent } from './launch-screen/launch-screen.component';
import { ScanFilesComponent } from './scan-files/scan-files.component';
import { SearchListViewComponent } from './search-list-view/search-list-view.component';

import { TranslateService } from './translate/translate.service';
import { TranslatePipe } from './translate/translate.pipe';
import { TRANSLATION_PROVIDERS } from './translate/translations';

@NgModule({
  declarations: [
    AppComponent,
    LaunchScreenComponent,
    ScanFilesComponent,
    SearchListViewComponent,
    TranslatePipe
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MatStepperModule,
    QxModule,
    AppRoutingModule,
  ],
  providers: [[TRANSLATION_PROVIDERS, TranslateService]],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  entryComponents: [
    ScanFilesComponent]
})
export class AppModule { }
