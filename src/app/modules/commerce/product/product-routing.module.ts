import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EditorComponent } from './components/editor/editor.component';
import { DetailComponent } from './components/detail/detail.component';


const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        redirectTo: '/tabs/tab1',
        pathMatch: 'full'
      },
      {
        path: 'editor',
        component: EditorComponent
      },
      {
        path: ':product_uuid',
        children: [
          {
            path: '',
            component: DetailComponent
          },
          {
            path: 'editor',
            component: EditorComponent
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
export class ProductRoutingModule { }
