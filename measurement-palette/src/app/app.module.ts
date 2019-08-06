import { BrowserModule } from '@angular/platform-browser';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import {QxModule} from '@quark/xpressng';
import { TabComponent } from './components/tab/tab.component';

import { OriginAcrossComponent } from './components/origin/origin-across/origin-across.component';
import { OriginDownComponent } from './components/origin/origin-down/origin-down.component';
import { DimensionHeightComponent } from './components/dimensions/dimension-height/dimension-height.component';
import { DimensionWidthComponent } from './components/dimensions/dimension-width/dimension-width.component';

import { MeasurementValuesService } from './services/measurement-values.service';

import { TranslateService } from './translate/translate.service';
import { TranslatePipe } from './translate/translate.pipe';
import { TRANSLATION_PROVIDERS } from './translate/translations';

const components = [
  OriginAcrossComponent,
  OriginDownComponent,
  DimensionHeightComponent,
  DimensionWidthComponent
];

@NgModule({
  declarations: [
    AppComponent,
    TabComponent,
    components,
    TranslatePipe
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    QxModule
  ],
  providers: [MeasurementValuesService, [TRANSLATION_PROVIDERS, TranslateService]],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  bootstrap: [AppComponent]
})
export class AppModule { }
