import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PaymentPageComponent } from './payment-page/payment-page.component';


const routes: Routes = [
  {
    path: ':order_uuid',
    component: PaymentPageComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PaymentRoutingModule { }
