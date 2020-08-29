import { Component, OnInit, Input } from '@angular/core';
import { SettingService } from '../../../../services/commerce/setting.service';
import { finalize } from 'rxjs/operators';
import { FormBuilder, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-setting-bank-editor',
  templateUrl: './setting-bank-editor.component.html',
  styleUrls: ['./setting-bank-editor.component.scss'],
})
export class SettingBankEditorComponent implements OnInit {

  @Input() item: any;

  formFactory: any = FormBuilder;
  banks: any = [];
  isLoading: boolean = false;
  isSubmitLoading: boolean = false;

  constructor(
    private _fb: FormBuilder,
    private _settingService: SettingService,
    public modalCtrl: ModalController
  ) { }

  ngOnInit() {
    this.loadBanks();

    this.formFactory = this._fb.group({
      bank: ['', [Validators.required]],
      number: ['', [Validators.required]],
      name: ['', [Validators.required]],
    });

    if (this.item) {
      this.formFactory.patchValue({
        bank: this.item.bank,
        name: this.item.name,
        number: this.item.number,
      });
    }
  }

  onSubmit(): void {
    if (this.item) {
      this.paymentUpdate(this.formFactory.value);
    } else {
      this.paymentCreate(this.formFactory.value);
    }
  }

  loadBanks(): void {
    this._settingService.bankList()
      .pipe(
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe(
        (response: any) => {
          this.banks = response;
        },
        (failure: any) => {

        }
      )
  }

  paymentCreate(data: any): void {
    this.isSubmitLoading = true;

    this._settingService.paymentCreate(data)
      .pipe(
        finalize(() => {
          this.isSubmitLoading = false;
        })
      )
      .subscribe(
        (response: any) => {
          this.dismiss(response);
        },
        (failure: any) => {

        }
      )
  }

  paymentUpdate(data: any): void {
    this.isSubmitLoading = true;

    this._settingService.paymentUpdate(data, this.item.uuid)
      .pipe(
        finalize(() => {
          this.isSubmitLoading = false;
        })
      )
      .subscribe(
        (response: any) => {
          response.action = 'update';
          this.dismiss(response);
        },
        (failure: any) => {

        }
      )
  }

  dismiss(data: any = ''): void {
    this.modalCtrl.dismiss(data);
  }

}
