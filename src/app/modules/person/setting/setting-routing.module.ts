import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SettingProfileComponent } from './setting-profile/setting-profile.component';
import { SettingAddressComponent } from './setting-address/setting-address.component';
import { SettingBankComponent } from './setting-bank/setting-bank.component';


const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        children: [
          {
            path: 'profile',
            component: SettingProfileComponent,
          },
          {
            path: 'address',
            component: SettingAddressComponent,
          },
          {
            path: 'bank',
            component: SettingBankComponent,
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
export class SettingRoutingModule { }
