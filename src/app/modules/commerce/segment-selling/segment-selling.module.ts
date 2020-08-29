import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SegmentSellingRoutingModule } from './segment-selling-routing.module';
import { SegmentSellingPageComponent } from './segment-selling-page/segment-selling-page.component';
import { IonicModule } from '@ionic/angular';


@NgModule({
  declarations: [SegmentSellingPageComponent],
  exports: [SegmentSellingPageComponent],
  imports: [
    CommonModule,
    SegmentSellingRoutingModule,
    IonicModule.forRoot()
  ]
})
export class SegmentSellingModule { }
