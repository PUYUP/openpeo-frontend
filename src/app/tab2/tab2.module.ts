import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Tab2Page } from './tab2.page';

import { Tab2PageRoutingModule } from './tab2-routing.module';
import { SegmentOrderModule } from '../modules/commerce/segment-order/segment-order.module';
import { SegmentSellingModule } from '../modules/commerce/segment-selling/segment-selling.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    Tab2PageRoutingModule,
    SegmentOrderModule,
    SegmentSellingModule
  ],
  declarations: [Tab2Page]
})
export class Tab2PageModule {}
