import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginPageComponent } from './login-page/login-page.component';
import { AuthGuestGuard } from '../../../services/auth/auth.guard';


const routes: Routes = [
  {
    path: '',
    canActivate: [AuthGuestGuard],
    component: LoginPageComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LoginRoutingModule { }
