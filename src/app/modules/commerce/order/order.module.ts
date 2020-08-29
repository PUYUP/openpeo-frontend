import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OrderRoutingModule } from './order-routing.module';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { OrderPageComponent } from './order-page/order-page.component';
import { OrderCancelComponent } from './order-cancel/order-cancel.component';


@NgModule({
  declarations: [
    OrderPageComponent,
    OrderCancelComponent
  ],
  exports: [
    OrderCancelComponent
  ],
  entryComponents: [
    OrderCancelComponent
  ],
  imports: [
    CommonModule,
    OrderRoutingModule,
    IonicModule.forRoot(),
    RouterModule
  ]
})
export class OrderModule { }
