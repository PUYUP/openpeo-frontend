import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProductRoutingModule } from './product-routing.module';
import { IonicModule } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EditorComponent } from './components/editor/editor.component';
import { DetailComponent } from './components/detail/detail.component';
import { RouterModule } from '@angular/router';


@NgModule({
  declarations: [
    EditorComponent,
    DetailComponent
  ],
  imports: [
    CommonModule,
    ProductRoutingModule,
    IonicModule.forRoot(),
    RouterModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class ProductModule { }
