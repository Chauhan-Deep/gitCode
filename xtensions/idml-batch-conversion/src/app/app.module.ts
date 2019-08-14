import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { QxModule } from '@quark/xpressng';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { LaunchScreenComponent } from './launch-screen/launch-screen.component';
import {MatStepperModule} from '@angular/material/stepper';
import {MatIconModule, MatButtonModule} from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    AppComponent,
    LaunchScreenComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    QxModule,
    MatStepperModule,
    MatIconModule,
    MatButtonModule,
    FormsModule,
    BrowserAnimationsModule
  ],
  providers: [],
  bootstrap: [AppComponent],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class AppModule { }
