import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SegmentOrderRoutingModule } from './segment-order-routing.module';
import { SegmentOrderPageComponent } from './segment-order-page/segment-order-page.component';
import { IonicModule } from '@ionic/angular';


@NgModule({
  declarations: [
    SegmentOrderPageComponent
  ],
  exports: [
    SegmentOrderPageComponent
  ],
  imports: [
    CommonModule,
    SegmentOrderRoutingModule,
    IonicModule.forRoot()
  ]
})
export class SegmentOrderModule { }
