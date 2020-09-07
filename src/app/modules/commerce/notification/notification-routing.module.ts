import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NotificationPageComponent } from './notification-page/notification-page.component';
import { NotificationDetailComponent } from './notification-detail/notification-detail.component';


const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        component: NotificationPageComponent,
      },
      {
        path: ':notification_uuid',
        component: NotificationDetailComponent,
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NotificationRoutingModule { }
