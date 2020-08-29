import { Component, OnInit } from '@angular/core';
import { OrderService } from '../../../../services/commerce/order.service';
import { finalize } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
import { NavController, ModalController } from '@ionic/angular';
import { Location } from '@angular/common';
import { SellingUpdateComponent } from '../selling-update/selling-update.component';

@Component({
  selector: 'app-selling-page',
  templateUrl: './selling-page.component.html',
  styleUrls: ['./selling-page.component.scss'],
})
export class SellingPageComponent implements OnInit {

  product: any;
  orderItems: any = [];
  isLoading: boolean = false;
  productUUID: string;

  constructor(
    private _orderService: OrderService,
    private _activatedRoute: ActivatedRoute,
    private _location: Location,
    public navCtrl: NavController,
    public modalController: ModalController
  ) { }

  async presentModal(item: any = '', action: string = 'single') {
    const modal = await this.modalController.create({
      component: SellingUpdateComponent,
      cssClass: 'modal-extend model-bottom',
      componentProps: {
        item: item,
        order_items: this.orderItems,
        action: action,
      }
    });

    modal.onDidDismiss().then((data: any) => {
      if (data.data && data.data.has_update) {
        if (data.data.action == 'all') {
          this.loadOrders();
        }

        if (data.data.action == 'single') {
          const index = this.orderItems.findIndex((x: any) => x.uuid === item.uuid);
          this.orderItems[index].status = data.data.status;
        }
      }
    });

    return await modal.present();
  }

  ngOnInit() { 
    this.productUUID = this._activatedRoute.snapshot.paramMap.get('product_uuid');
    this.loadOrders();
  }

  back(): void {
    this.navCtrl.setDirection("back", true, "back");
    this._location.back();
  }

  loadOrders(): void {
    this.isLoading = true;

    this._orderService.sellDetail(this.productUUID)
      .pipe(
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe(
        (response: any) => {
          if (!this.product) {
            this.product = response.product;
          }

          this.orderItems = response.order_items;
        },
        (failure: any) => {

        }
      )
  }

  updateOrder(item: any): void {
    this.presentModal(item);
  }

  updateAll(): void {
    this.presentModal('', 'all');
  }

}
