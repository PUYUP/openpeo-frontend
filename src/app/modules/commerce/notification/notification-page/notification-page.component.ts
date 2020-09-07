import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { Location } from '@angular/common';
import { NotificationService } from '../../../../services/commerce/notification.service';
import { AuthService } from '../../../../services/auth/auth.service';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-notification-page',
  templateUrl: './notification-page.component.html',
  styleUrls: ['./notification-page.component.scss'],
})
export class NotificationPageComponent implements OnInit {

  isLoading: boolean = false;
  notifications: any = [];
  credential: any;
  userUUID: string;

  constructor(
    public navCtrl: NavController,
    private _authService: AuthService,
    private _location: Location,
    private _notificationService: NotificationService
  ) { }

  ngOnInit() {
    this.loadNotifications();
    this.credential = this._authService.getCredential();
    this.userUUID = this.credential?.uuid;
  }

  back(): void {
    this.navCtrl.setDirection("back", true, "back");
    this._location.back();
  }

  loadNotifications(): void {
    this.isLoading = true;

    this._notificationService.list()
      .pipe(
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe(
        (response: any) => {
          this.notifications = response;
        },
        (failure: any) => {

        }
      )
  }

}
