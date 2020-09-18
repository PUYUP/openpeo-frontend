import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { AlertController, NavController } from '@ionic/angular';
import { Location } from '@angular/common';

import { AuthService } from '../../../../services/auth/auth.service';

@Component({
  selector: 'app-register-page',
  templateUrl: './register-page.component.html',
  styleUrls: ['./register-page.component.scss'],
})
export class RegisterPageComponent implements OnInit {

  formFactory: any = FormBuilder;
  isLoading: boolean = false;
  message: string;

  constructor(
    private _fb: FormBuilder,
    private _router: Router,
    private _authService: AuthService,
    private _location: Location,
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
      msisdn: ['', [Validators.required, Validators.minLength(10), Validators.pattern('[0-9]*')]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      email: ['', [Validators.required, Validators.email]],
    });
  }

  back(): void {
    this.navCtrl.setDirection("back", true, "back");
    this._location.back();
  }

  onSubmit(): void {
    this.formFactory.value.username = this.formFactory.value.msisdn;
    this.registration(this.formFactory.value);
  }

  registration(context: any): void {
    this.isLoading = true;

    this._authService.registration(context)
      .pipe(
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe(
        (response: any) => {
          this.message = null;

          // Login and redirect to profile
          this.login({'username': context.msisdn, 'password': context.password});
        }
      )
  }

  login(context: any, redirectTo: string = '/setting/profile'): void {
    this._authService.login(context)
      .pipe(
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe(
        (response: any) => {
          this._router.navigate([redirectTo], {replaceUrl: true});
        }
      )
  }

}
