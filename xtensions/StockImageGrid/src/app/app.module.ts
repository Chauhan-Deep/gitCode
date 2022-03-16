import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { Routes, RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { GridComponent } from './grid/grid.component';
import { ImageComponent } from './grid/image.component';
import { QxModule } from '@quark/xpressng';
import { AddImageToCollectionsComponent } from './addImageToCollections/addimgtocollections.component';
import { AppRoutingModule } from './app-routing.module';
import { CollectionComponent } from './collection/collection.component';
import { CollectionsComponent } from './collection-list/collection-list.component';

@NgModule({
  declarations: [
    AppComponent,
    GridComponent,
    ImageComponent,
    AddImageToCollectionsComponent,
    CollectionComponent,
    CollectionsComponent
  ],
  imports: [
    QxModule,
    BrowserModule,
    RouterModule,
    AppRoutingModule,
  ],
  exports: [RouterModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [],
  bootstrap: [AppComponent]
})


export class AppModule { }
