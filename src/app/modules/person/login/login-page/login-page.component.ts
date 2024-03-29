import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../../services/auth/auth.service';
import { AlertController, NavController } from '@ionic/angular';
import { finalize } from 'rxjs/operators';
import { Location } from '@angular/common';
import { FcmService } from 'src/app/services/fcm.service';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss'],
})
export class LoginPageComponent implements OnInit {

  formFactory: any = FormBuilder;
  isLoading: boolean = false;
  message: string;

  constructor(
    private _fb: FormBuilder,
    private _router: Router,
    private _authService: AuthService,
    private _location: Location,
    private _fcmService: FcmService,
    public navCtrl: NavController,
    public alertController: AlertController
  ) { }

  async presentAlert(message: string) {
    const alert = await this.alertController.create({
      header: 'Informasi',
      message: message,
      buttons: ['OK']
    });

    await alert.present();
  }

  ngOnInit(): void {
    this.formFactory = this._fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  back(): void {
    this.navCtrl.setDirection("back", true, "back");
    this._location.back();
  }

  onSubmit(): void {
    this.fcmRequestPermission();
  }

  /**
   * Get firebase token
   */
  fcmRequestPermission() {
    this._fcmService.requestPermission()
      .pipe(
        finalize(() => {
          // pass
        })
      )
      .subscribe(
        (token: any) => {
          this.doLogin(this.formFactory.value, token);
        },
        (error: any) => {
          this.doLogin(this.formFactory.value, '');
        }
      );
  }

  doLogin(context: any, fcmToken: string, redirectTo: string = '/tabs/tab1'): void {
    this.isLoading = true;

    this._authService.login(context)
      .pipe(
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe(
        (response: any) => {
          // save token to user
          if (fcmToken) this._fcmService.setFcmToken(fcmToken);

          // redirect to...
          this._router.navigate([redirectTo], {replaceUrl: true});
        },
        (failure: any) => {
          if (failure) {
            let error = failure.error;

            // Object error
            if (typeof error === 'object') {
              let msgList = [];

              for (let k in error) {
                let e = error[k];

                // Check is array
                if (Array.isArray(e)) {
                  msgList.push(k + ': ' + e.join(' '));
                } else {
                  msgList.push(k + ': ' + e);
                }
              }

              // Print the message
              this.message = msgList.join(' ');

            } else {
              // Default error
              if (error && error.detail) {
                this.message = error.detail;
              }
            }
          }

          this.presentAlert(this.message);
        }
      )
  }

}
