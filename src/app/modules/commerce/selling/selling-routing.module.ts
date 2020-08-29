import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SellingPageComponent } from './selling-page/selling-page.component';


const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        redirectTo: '/tabs/tab2',
        pathMatch: 'full'
      },
      {
        path: ':product_uuid',
        children: [
          {
            path: '',
            component: SellingPageComponent,
          }
        ]
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SellingRoutingModule { }
