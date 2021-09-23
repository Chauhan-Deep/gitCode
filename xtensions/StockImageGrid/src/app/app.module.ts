import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { GridComponent } from './grid/grid.component';
import { ImageComponent } from './grid/image.component';

@NgModule({
  declarations: [
    AppComponent,
    GridComponent,
    ImageComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
