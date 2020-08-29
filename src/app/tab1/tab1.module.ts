import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Tab1Page } from './tab1.page';

import { Tab1PageRoutingModule } from './tab1-routing.module';
import { SegmentSellModule } from '../modules/commerce/segment-sell/segment-sell.module';
import { SegmentBuyModule } from '../modules/commerce/segment-buy/segment-buy.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    Tab1PageRoutingModule,
    SegmentSellModule,
    SegmentBuyModule
  ],
  declarations: [Tab1Page]
})
export class Tab1PageModule {}
