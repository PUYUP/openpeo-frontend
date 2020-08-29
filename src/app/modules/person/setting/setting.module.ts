import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SettingRoutingModule } from './setting-routing.module';

import { SettingAddressComponent } from './setting-address/setting-address.component';
import { SettingAddressEditorComponent } from './setting-address-editor/setting-address-editor.component';

import { SettingBankComponent, SettingBankActionComponent } from './setting-bank/setting-bank.component';
import { SettingBankEditorComponent } from './setting-bank-editor/setting-bank-editor.component';

import { SettingProfileComponent } from './setting-profile/setting-profile.component';
import { SettingProfileEditorComponent } from './setting-profile-editor/setting-profile-editor.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';


@NgModule({
  declarations: [
    SettingAddressComponent,
    SettingAddressEditorComponent,
    SettingBankComponent,
    SettingBankActionComponent,
    SettingBankEditorComponent,
    SettingProfileComponent,
    SettingProfileEditorComponent
  ],
  exports: [
    SettingAddressComponent,
    SettingAddressEditorComponent,
    SettingBankComponent,
    SettingBankActionComponent,
    SettingBankEditorComponent,
    SettingProfileComponent,
    SettingProfileEditorComponent
  ],
  entryComponents: [
    SettingAddressEditorComponent,
    SettingBankEditorComponent,
    SettingBankActionComponent,
    SettingProfileEditorComponent
  ],
  imports: [
    CommonModule,
    SettingRoutingModule,
    IonicModule.forRoot(),
    FormsModule,
    ReactiveFormsModule
  ]
})
export class SettingModule { }
