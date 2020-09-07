import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PaymentRoutingModule } from './payment-routing.module';
import { PaymentPageComponent } from './payment-page/payment-page.component';
import { IonicModule } from '@ionic/angular';


@NgModule({
  declarations: [
    PaymentPageComponent
  ],
  imports: [
    CommonModule,
    IonicModule.forRoot(),
    PaymentRoutingModule
  ]
})
export class PaymentModule { }
