import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ChatPageComponent } from './chat-page/chat-page.component';


const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        component: ChatPageComponent
      },
      {
        path: ':chat_uuid',
        component: ChatPageComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ChatRoutingModule { }
