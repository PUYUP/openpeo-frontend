import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SellingRoutingModule } from './selling-routing.module';
import { SellingPageComponent } from './selling-page/selling-page.component';
import { SellingUpdateComponent } from './selling-update/selling-update.component';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';


@NgModule({
  declarations: [
    SellingPageComponent,
    SellingUpdateComponent
  ],
  exports: [
    SellingPageComponent,
    SellingUpdateComponent
  ],
  entryComponents: [
    SellingUpdateComponent
  ],
  imports: [
    CommonModule,
    SellingRoutingModule,
    IonicModule.forRoot(),
    RouterModule
  ]
})
export class SellingModule { }
