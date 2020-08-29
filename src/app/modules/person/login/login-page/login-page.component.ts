import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../../services/auth/auth.service';
import { AlertController } from '@ionic/angular';
import { finalize } from 'rxjs/operators';

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
      username: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  onSubmit(): void {
    this.login(this.formFactory.value);
  }

  login(context: any, redirectTo: string = '/tabs/tab1'): void {
    this.isLoading = true;
    
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
