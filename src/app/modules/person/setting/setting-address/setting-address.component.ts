import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { Location } from '@angular/common';

@Component({
  selector: 'app-setting-address',
  templateUrl: './setting-address.component.html',
  styleUrls: ['./setting-address.component.scss'],
})
export class SettingAddressComponent implements OnInit {

  constructor(
    public navCtrl: NavController,
    private _location: Location
  ) { }

  ngOnInit() {}

  back(): void {
    this.navCtrl.setDirection("back", true, "back");
    this._location.back();
  }

}
