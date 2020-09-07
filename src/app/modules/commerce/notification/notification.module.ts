import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NotificationRoutingModule } from './notification-routing.module';
import { NotificationPageComponent } from './notification-page/notification-page.component';
import { NotificationDetailComponent } from './notification-detail/notification-detail.component';
import { IonicModule } from '@ionic/angular';


@NgModule({
  declarations: [
    NotificationPageComponent,
    NotificationDetailComponent
  ],
  imports: [
    CommonModule,
    IonicModule.forRoot(),
    NotificationRoutingModule
  ]
})
export class NotificationModule { }
