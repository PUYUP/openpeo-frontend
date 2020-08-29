import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RegisterRoutingModule } from './register-routing.module';
import { RegisterPageComponent } from './register-page/register-page.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';


@NgModule({
  declarations: [RegisterPageComponent],
  imports: [
    CommonModule,
    RegisterRoutingModule,
    IonicModule.forRoot(),
    FormsModule,
    ReactiveFormsModule
  ]
})
export class RegisterModule { }
