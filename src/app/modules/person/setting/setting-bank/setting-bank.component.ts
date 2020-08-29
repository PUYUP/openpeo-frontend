import { Component, OnInit, Input } from '@angular/core';
import { NavController, ModalController, PopoverController } from '@ionic/angular';
import { Location } from '@angular/common';
import { SettingBankEditorComponent } from '../setting-bank-editor/setting-bank-editor.component';
import { SettingService } from '../../../../services/commerce/setting.service';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-setting-bank',
  templateUrl: './setting-bank.component.html',
  styleUrls: ['./setting-bank.component.scss'],
})
export class SettingBankComponent implements OnInit {

  isLoading: boolean = false;
  payments: any = [];

  constructor(
    public navCtrl: NavController,
    public modalCtrl: ModalController,
    public popoverController: PopoverController,
    private _location: Location,
    private _settingService: SettingService
  ) { }

  async presentModal(item: any = '') {
    const modal = await this.modalCtrl.create({
      component: SettingBankEditorComponent,
      componentProps: {
        'item': item
      }
    });

    modal.onDidDismiss().then((data: any) => {
      if (data.data) {
        if (data.data.action == 'update') {
          const index = this.payments.findIndex((x: any) => x.uuid === data.data.uuid);
          this.payments[index] = data.data;
        } else {
          this.payments.unshift(data.data);
        }
      }
    });

    return await modal.present();
  }

  async presentPopover(ev: any, data: any) {
    const popover = await this.popoverController.create({
      component: SettingBankActionComponent,
      cssClass: 'my-custom-class',
      translucent: true,
      event: ev,
      componentProps: {
        'item': data,
      }
    });

    popover.onWillDismiss().then((data: any) => {
      if (data.data) {
        if (data.data.action == 'edit') {
          this.presentModal(data.data.item);
        }

        if (data.data.action == 'delete') {
          this.deletePayment(data.data.item);
        }
      }
    });

    return await popover.present();
  }

  ngOnInit() {
    this.loadPayments();
  }

  back(): void {
    this.navCtrl.setDirection("back", true, "back");
    this._location.back();
  }

  loadPayments(): void {
    this._settingService.paymentList()
      .pipe(
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe(
        (response: any) => {
          this.payments = response;
        },
        (failure: any) => {

        }
      )
  }

  addPayment(data: any = ''): void {
    this.presentModal(data);
  }

  changePayment(event: any, item: any): void {
    this.presentPopover(event, item);
  }

  deletePayment(item: any): void {
    this._settingService.paymentDelete(item.uuid)
      .pipe(
        finalize(() => {

        })
      )
      .subscribe(
        (response: any) => {
          this.payments =  this.payments.filter((x: any) => x.uuid !== item.uuid);
        },
        (failure: any) => {

        }
      )
  }

}


@Component({
  selector: 'app-setting-bank-action',
  templateUrl: './setting-bank-action.component.html',
  styleUrls: ['./setting-bank.component.scss'],
})
export class SettingBankActionComponent implements OnInit {

  constructor(
    public popoverController: PopoverController,
  ) {}

  @Input() item: any;

  ngOnInit() {}

    dismiss(action: string): void {
      this.popoverController.dismiss({'action': action, 'item': this.item});
    }

}
