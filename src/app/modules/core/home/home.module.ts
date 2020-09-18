import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeRoutingModule } from './home-routing.module';
import { HomePageComponent } from './home-page/home-page.component';
import { SegmentBuyModule } from '../../commerce/segment-buy/segment-buy.module';
import { IonicModule } from '@ionic/angular';


@NgModule({
  declarations: [
    HomePageComponent
  ],
  imports: [
    CommonModule,
    IonicModule,
    HomeRoutingModule,
    SegmentBuyModule
  ]
})
export class HomeModule { }
