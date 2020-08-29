import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SplashRoutingModule } from './splash-routing.module';
import { SplashPageComponent } from './splash-page/splash-page.component';
import { IonicModule } from '@ionic/angular';


@NgModule({
  declarations: [SplashPageComponent],
  imports: [
    CommonModule,
    SplashRoutingModule,
    IonicModule.forRoot()
  ]
})
export class SplashModule { }
