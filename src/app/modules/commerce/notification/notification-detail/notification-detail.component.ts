import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-notification-detail',
  templateUrl: './notification-detail.component.html',
  styleUrls: ['./notification-detail.component.scss'],
})
export class NotificationDetailComponent implements OnInit {

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
