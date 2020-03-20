import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SmartContentModelComponent } from './smart-content-model.component';


const routes: Routes = [
  { path: '', redirectTo: 'smartcontentmodel', pathMatch: 'full' },
  { path: 'SmartContentModel.html', redirectTo: 'smartcontentmodel', pathMatch: 'full', data: { title: 'Smart Content Model' } },
  { path: 'smartcontentmodel', component: SmartContentModelComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
