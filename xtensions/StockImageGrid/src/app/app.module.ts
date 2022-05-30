import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { Routes, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { AppComponent } from './app.component';
import { GridComponent } from './grid/grid.component';
import { ImageComponent } from './grid/image.component';
import { QxModule } from '@quark/xpressng';
import { AddImageToCollectionsComponent } from './addImageToCollections/addimgtocollections.component';
import { AppRoutingModule } from './app-routing.module';
import { CollectionComponent } from './collection/collection.component';
import { CollectionsComponent } from './collection-list/collection-list.component';
import { ManageCollectionComponent } from './manageCollection/manageCollection.component';
import { ManageCollectionsComponent } from './manageCollections/manageCollections.component';
import { ManageCollectionsListComponent } from './manageCollection-list/manageCollection-list.component';
import { ContextMenuModule } from 'ngx-contextmenu';

@NgModule({
  declarations: [
    AppComponent,
    GridComponent,
    ImageComponent,
    AddImageToCollectionsComponent,
    CollectionComponent,
    CollectionsComponent,
    ManageCollectionsComponent,
    ManageCollectionsListComponent,
    ManageCollectionComponent
  ],
  imports: [
    QxModule,
    BrowserModule,
    CommonModule,
    RouterModule,
    AppRoutingModule,
    ContextMenuModule.forRoot({
      autoFocus: true,
      // useBootstrap4: true,
    })
  ],
  exports: [RouterModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [],
  bootstrap: [AppComponent]
})


export class AppModule { }
