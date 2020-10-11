import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { SettingService } from '../../../../services/commerce/setting.service';
import { finalize } from 'rxjs/operators';


@Component({
  selector: 'app-setting-address-editor',
  templateUrl: './setting-address-editor.component.html',
  styleUrls: ['./setting-address-editor.component.scss'],
})
export class SettingAddressEditorComponent implements OnInit {

  formFactory: any = FormBuilder;
  address: any = [];
  addressSingle: any;
  isLoading: boolean = false;
  isSubmitLoading: boolean = false;

  constructor(
    private _fb: FormBuilder,
    private _settingService: SettingService
  ) { }

  ngOnInit() {
    this.formFactory = this._fb.group({
      address: ['', [Validators.required]],
    });

    this.loadAddress();
  }

  onSubmit(): void {
    if (this.addressSingle) {
      this.updateAddress(this.formFactory.value);
    } else {
      this.createAddress(this.formFactory.value);
    }
  }

  loadAddress(): void {
    this._settingService.addressList()
      .pipe(
        finalize(() => {

        })
      )
      .subscribe(
        (response: any) => {
          if (response) {
            this.addressSingle = response[0];
            
            this.formFactory.patchValue({
              address: this.addressSingle?.address,
            });
          }
        },
        (failure: any) => {

        }
      )
  }

  createAddress(data: any): void {
    this.isLoading = true;

    this._settingService.addressCreate(data)
      .pipe(
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe(
        (response: any) => {
          if (response) {
            this.addressSingle = response[0].address;
            
            this.formFactory.patchValue({
              address: this.addressSingle.address,
            });
          }
        },
        (failure: any) => {

        }
      )
  }

  updateAddress(data: any): void {
    this.isLoading = true;

    this._settingService.addressUpdate(data, this.addressSingle.uuid)
      .pipe(
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe(
        (response: any) => {
          if (response) {
            this.addressSingle = response;
          }
        },
        (failure: any) => {

        }
      )
  }

}
