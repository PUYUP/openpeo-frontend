import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SplashPageComponent } from './splash-page/splash-page.component';
import { AuthGuestGuard } from '../../../services/auth/auth.guard';


const routes: Routes = [
  {
    path: '',
    canActivate: [AuthGuestGuard],
    component: SplashPageComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SplashRoutingModule { }
