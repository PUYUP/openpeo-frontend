import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { Location } from '@angular/common';
import { SettingService } from '../../../../services/commerce/setting.service';
import { finalize } from 'rxjs/operators';
import { OrderService } from '../../../../services/commerce/order.service';

@Component({
  selector: 'app-payment-page',
  templateUrl: './payment-page.component.html',
  styleUrls: ['./payment-page.component.scss'],
})
export class PaymentPageComponent implements OnInit {

  orderUUID: string;
  payments: any = [];
  order: any;
  summary: any;
  order_items: any = [];
  isLoading: boolean = false;

  constructor(
    private _location: Location,
    private _activatedRoute: ActivatedRoute,
    private _settingService: SettingService,
    private _orderService: OrderService,
    public navCtrl: NavController,
  ) { }

  ngOnInit() {
    this.orderUUID = this._activatedRoute.snapshot.paramMap.get('order_uuid');
    this.loadOrder();
  }

  back(): void {
    this.navCtrl.setDirection("back", true, "back");
    this._location.back();
  }

  loadOrder(): void {
    this._orderService.single(this.orderUUID)
      .pipe(
        finalize(() => {

        })
      )
      .subscribe(
        (response: any) => {
          this.order = response.order;
          this.summary = response.summary;
          this.order_items = this.order.order_items;

          this.loadPayments(this.order.seller_uuid);
        },
        (failure: any) => {

        }
      )
  }

  loadPayments(sellerUUID: string) {
    this.isLoading = true;

    this._settingService.paymentList(sellerUUID)
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

}
