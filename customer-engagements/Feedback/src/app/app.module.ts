import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FeedbackScreenComponent } from './feedback-screen/feedback-screen.component';
import { NotificationComponent } from './notification/notification.component';

import { NotificationService } from './notification/notification.service';
import { TranslateService } from './translate/translate.service';
import { TranslatePipe } from './translate/translate.pipe';
import { TRANSLATION_PROVIDERS } from './translate/translations';

@NgModule({
  declarations: [
    AppComponent,
    FeedbackScreenComponent,
    NotificationComponent,
    TranslatePipe
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule
  ],
  providers: [NotificationService, [TRANSLATION_PROVIDERS, TranslateService]],
  bootstrap: [AppComponent]
})
export class AppModule { }
