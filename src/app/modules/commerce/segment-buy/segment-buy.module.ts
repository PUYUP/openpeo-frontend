import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SegmentBuyRoutingModule } from './segment-buy-routing.module';
import { SegmentBuyPageComponent } from './segment-buy-page/segment-buy-page.component';
import { IonicModule } from '@ionic/angular';


@NgModule({
  declarations: [SegmentBuyPageComponent],
  exports: [SegmentBuyPageComponent],
  imports: [
    CommonModule,
    SegmentBuyRoutingModule,
    IonicModule.forRoot()
  ]
})
export class SegmentBuyModule { }
