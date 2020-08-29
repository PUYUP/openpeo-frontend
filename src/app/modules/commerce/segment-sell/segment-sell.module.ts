import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SegmentSellRoutingModule } from './segment-sell-routing.module';
import { SegmentSellPageComponent } from './segment-sell-page/segment-sell-page.component';
import { IonicModule } from '@ionic/angular';


@NgModule({
  declarations: [
    SegmentSellPageComponent
  ],
  exports: [
    SegmentSellPageComponent
  ],
  imports: [
    CommonModule,
    SegmentSellRoutingModule,
    IonicModule.forRoot()
  ]
})
export class SegmentSellModule { }
