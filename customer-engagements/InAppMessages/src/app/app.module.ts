import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { InAppMessagesComponent } from './inapp-messages/inapp-messages.component';
import { TranslateService } from './translate/translate.service';
import { TranslatePipe } from './translate/translate.pipe';
import { TRANSLATION_PROVIDERS } from './translate/translations';

@NgModule({
  declarations: [
    AppComponent,
    InAppMessagesComponent,
    TranslatePipe
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule
  ],
  providers: [[TRANSLATION_PROVIDERS, TranslateService]],
  bootstrap: [AppComponent]
})
export class AppModule { }
