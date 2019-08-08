import { BrowserModule } from '@angular/platform-browser';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { QxModule } from '@quark/xpressng';
import { TabComponent } from './components/tab/tab.component';

import { OriginAcrossComponent } from './components/origin/origin-across/origin-across.component';
import { OriginDownComponent } from './components/origin/origin-down/origin-down.component';
import { BoxHeightComponent } from './components/box-dimensions/box-height/box-height.component';
import { BoxWidthComponent } from './components/box-dimensions/box-width/box-width.component';

import { MeasurementPropertiesService } from './services/measurement-properties.service';

import { TranslateService } from './translate/translate.service';
import { TranslatePipe } from './translate/translate.pipe';
import { TRANSLATION_PROVIDERS } from './translate/translations';


const components = [
  OriginAcrossComponent,
  OriginDownComponent,
  BoxHeightComponent,
  BoxWidthComponent
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
  providers: [MeasurementPropertiesService, [TRANSLATION_PROVIDERS, TranslateService]],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  bootstrap: [AppComponent]
})
export class AppModule { }
