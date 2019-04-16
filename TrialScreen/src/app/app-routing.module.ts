import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TrialScreenComponent } from './trial-screen/trial-screen.component';

const routes: Routes = [
  { path: '', redirectTo: 'trialscreen', pathMatch: 'full' },
  { path: 'TrialScreen.html', redirectTo: 'trialscreen', pathMatch: 'full', data: { title: 'Trial Screen' } },
  { path: 'trialscreen', component: TrialScreenComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
