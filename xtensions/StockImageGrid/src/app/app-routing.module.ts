import { NgModule } from '@angular/core';
import { GridComponent } from './grid/grid.component';
import { AddImageToCollectionsComponent } from './addImageToCollections/addimgtocollections.component';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', component: GridComponent },
  { path: 'addimagetocollections', component: AddImageToCollectionsComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule],
  declarations: [],
})
export class AppRoutingModule { }
