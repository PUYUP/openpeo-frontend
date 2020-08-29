import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SegmentSellPageComponent } from './segment-sell-page/segment-sell-page.component';


const routes: Routes = [
  {
    path: '',
    component: SegmentSellPageComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SegmentSellRoutingModule { }
