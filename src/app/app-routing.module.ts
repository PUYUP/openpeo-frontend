import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'register',
    loadChildren: () => import('./modules/person/register/register.module').then(m => m.RegisterModule)
  },
  {
    path: 'login',
    loadChildren: () => import('./modules/person/login/login.module').then(m => m.LoginModule)
  },
  {
    path: 'splash',
    loadChildren: () => import('./modules/core/splash/splash.module').then(m => m.SplashModule)
  },
  {
    path: 'product',
    loadChildren: () => import('./modules/commerce/product/product.module').then(m => m.ProductModule)
  },
  {
    path: 'order',
    loadChildren: () => import('./modules/commerce/order/order.module').then(m => m.OrderModule)
  },
  {
    path: 'selling',
    loadChildren: () => import('./modules/commerce/selling/selling.module').then(m => m.SellingModule)
  },
  {
    path: 'setting',
    loadChildren: () => import('./modules/person/setting/setting.module').then(m => m.SettingModule)
  },
  {
    path: 'chat',
    loadChildren: () => import('./modules/commerce/chat/chat.module').then(m => m.ChatModule)
  },
  {
    path: 'notification',
    loadChildren: () => import('./modules/commerce/notification/notification.module').then(m => m.NotificationModule)
  },
  {
    path: 'payment',
    loadChildren: () => import('./modules/commerce/payment/payment.module').then(m => m.PaymentModule)
  },
  {
    path: '',
    loadChildren: () => import('./tabs/tabs.module').then(m => m.TabsPageModule)
  }
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
