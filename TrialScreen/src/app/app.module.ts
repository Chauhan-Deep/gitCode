import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { FlexLayoutModule } from '@angular/flex-layout';
import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { TrialScreenComponent } from './trial-screen/trial-screen.component';

@NgModule({
  declarations: [
    AppComponent,
    TrialScreenComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FlexLayoutModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
