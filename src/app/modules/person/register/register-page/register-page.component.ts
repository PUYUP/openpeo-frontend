import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { AlertController } from '@ionic/angular';

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
    public alertController: AlertController
  ) { }

  async presentAlert(message: string) {
    const alert = await this.alertController.create({
      header: 'Informasi',
      message: message,
      buttons: ['Coba Lagi']
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

  login(context: any, redirectTo: string = '/tabs/tab1'): void {
    this._authService.login(context)
      .pipe(
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe(
        (response: any) => {
          this._router.navigate([redirectTo], {replaceUrl: true});
        },
        (failure: any) => {
          if (failure && failure.error && failure.error.detail) {
            this.message = failure.error.detail;
          }
        }
      )
  }

}
