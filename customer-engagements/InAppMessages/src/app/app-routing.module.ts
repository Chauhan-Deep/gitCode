import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { InAppMessagesComponent } from './inapp-messages/inapp-messages.component';

const routes: Routes = [
    { path: '', redirectTo: 'inappmessages', pathMatch: 'full' },
    { path: 'InAppMessages.html', redirectTo: 'inappmessages', pathMatch: 'full', data: { title: 'InApp Messages' } },
    { path: 'inappmessages', component: InAppMessagesComponent }
];
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true }), HttpClientModule],
  exports: [RouterModule]
})
export class AppRoutingModule { }
