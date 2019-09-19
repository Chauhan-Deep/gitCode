import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { MatStepperModule } from '@angular/material/stepper';
import { MatProgressBarModule } from '@angular/material/progress-bar';

import { QxModule } from '@quark/xpressng';

import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { LaunchScreenComponent } from './Components/launch-screen/launch-screen.component';
import { ScanFilesComponent } from './Components/scan-files/scan-files.component';
import { ListViewComponent } from './Components/list-view/list-view.component';
import { ProgressBarComponent } from './Components/progress-bar/progress-bar.component';

import { TranslateService } from './translate/translate.service';
import { TranslatePipe } from './translate/translate.pipe';
import { TRANSLATION_PROVIDERS } from './translate/translations';
import { FileListDataService } from './Service/file-list-data.service';

@NgModule({
  declarations: [
    AppComponent,
    LaunchScreenComponent,
    ScanFilesComponent,
    ListViewComponent,
    ProgressBarComponent,
    TranslatePipe
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MatStepperModule,
    MatProgressBarModule,
    QxModule,
    AppRoutingModule,
  ],
  providers: [[TRANSLATION_PROVIDERS, TranslateService], FileListDataService],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  entryComponents: [
    ScanFilesComponent]
})
export class AppModule { }
