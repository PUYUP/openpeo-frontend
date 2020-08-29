import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { Location } from '@angular/common';

@Component({
  selector: 'app-setting-profile',
  templateUrl: './setting-profile.component.html',
  styleUrls: ['./setting-profile.component.scss'],
})
export class SettingProfileComponent implements OnInit {

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
