import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { Location } from '@angular/common';
import { AuthService } from '../../../../services/auth/auth.service';
import { EventService } from '../../../../services/event.service';
import { finalize } from 'rxjs/operators';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-setting-profile',
  templateUrl: './setting-profile.component.html',
  styleUrls: ['./setting-profile.component.scss'],
})
export class SettingProfileComponent implements OnInit {

  formFactory: any = FormBuilder;
  user: any;
  creadential: any;
  isLoading: boolean = false;
  isSaveLoading: boolean = false;

  constructor(
    public navCtrl: NavController,
    private _location: Location,
    private _fb: FormBuilder,
    private _authService: AuthService,
    private _eventService: EventService
  ) { }

  ngOnInit() {
    this.loadUser();
    
    this.creadential = this._authService.getCredential();

    this.formFactory = this._fb.group({
      first_name: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      msisdn: ['', [Validators.required, Validators.minLength(10)]],
    });
  }

  back(): void {
    this.navCtrl.setDirection("back", true, "back");
    this._location.back();
  }

  loadUser() {
    this.isLoading = true;
    
    this._authService.getUser()
      .pipe(
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe(
        (response: any) => {
          this.user = response;

          // fill form
          this.formFactory.patchValue({
            first_name: this.user.first_name,
            email: this.user.email,
            msisdn: this.user.account.msisdn,
          });
        },
        (failure: any) => {

        }
      )
  }

  onSubmit() {
    // update profile
    this.updateUser(this.formFactory.value);

    // update account
    this.updateAccount({'msisdn': this.formFactory.value.msisdn});
  }

  updateUser(data: any) {
    this.isSaveLoading = true;

    this._authService.updateUser(data)
    .pipe(
        finalize(() => {
          this.isSaveLoading = false;
        })
      )
      .subscribe(
        (response: any) => {
          this.creadential['first_name'] = this.formFactory.value.first_name;
          this.creadential['email'] = this.formFactory.value.email;

          // update credential
          this._authService.setCredential(this.creadential);

          // trigger change
          this._eventService.publish('person:updateProfile', {});
        },
        (failure: any) => {

        }
      )
  }

  updateAccount(data: any) {
    this.isSaveLoading = true;

    this._authService.updateAccount(data)
    .pipe(
        finalize(() => {
          this.isSaveLoading = false;
        })
      )
      .subscribe(
        (response: any) => {
          this.creadential['msisdn'] = this.formFactory.value.msisdn;

          // update credential
          this._authService.setCredential(this.creadential);

          // trigger change
          this._eventService.publish('person:updateProfile', {});
        },
        (failure: any) => {

        }
      )
  }

}
