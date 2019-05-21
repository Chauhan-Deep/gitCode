import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FeedbackScreenComponent } from './feedback-screen/feedback-screen.component';

const routes: Routes = [
  { path: '', redirectTo: 'feedbackscreen', pathMatch: 'full' },
  { path: 'Feedback.html', redirectTo: 'feedbackscreen', pathMatch: 'full', data: { title: 'Feedback Screen' } },
  { path: 'feedbackscreen', component: FeedbackScreenComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
