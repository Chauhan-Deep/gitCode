import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { FlexLayoutModule } from '@angular/flex-layout';
import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { TrialScreenComponent } from './trial-screen/trial-screen.component';
import { TranslateService } from './translate/translate.service';
import { TranslatePipe } from './translate/translate.pipe';
import { TRANSLATION_PROVIDERS } from './translate/translations';

@NgModule({
  declarations: [
    AppComponent,
    TrialScreenComponent,
    TranslatePipe
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FlexLayoutModule
  ],
  providers: [[TRANSLATION_PROVIDERS, TranslateService]],
  bootstrap: [AppComponent]
})
export class AppModule { }
