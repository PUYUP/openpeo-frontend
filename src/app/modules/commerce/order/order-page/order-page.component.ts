import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { NavController, ModalController } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { OrderService } from '../../../../services/commerce/order.service';
import { finalize } from 'rxjs/operators';
import { OrderCancelComponent } from '../order-cancel/order-cancel.component';
import { ChatService } from '../../../../services/commerce/chat.service';

@Component({
  selector: 'app-order-page',
  templateUrl: './order-page.component.html',
  styleUrls: ['./order-page.component.scss'],
})
export class OrderPageComponent implements OnInit {

  orderUUID: string;
  order: any;
  summary: any;
  order_items: any = [];
  isLoading: boolean = false;
  isChatLoading: boolean = false;

  constructor(
    private _location: Location,
    private _activatedRoute: ActivatedRoute,
    private _orderService: OrderService,
    private _chatService: ChatService,
    private _router: Router,
    public navCtrl: NavController,
    public modalController: ModalController
  ) { }

  async presentModal() {
    const modal = await this.modalController.create({
      component: OrderCancelComponent,
      cssClass: 'modal-extend',
      componentProps: {
        order: this.order,
        order_items: this.order_items,
      }
    });

    modal.onDidDismiss().then((data: any) => {
      if (data.data.action == 'removed') {
        this.loadOrder();
      }

      if (data.data.action == 'cleanup') {
        this._router.navigate(['tabs/tab2'], {replaceUrl: true});
      }
    });

    return await modal.present();
  }

  ngOnInit() {
    this.orderUUID = this._activatedRoute.snapshot.paramMap.get('order_uuid');
    this.loadOrder();
  }

  back(): void {
    this.navCtrl.setDirection("back", true, "back");
    this._location.back();
  }

  loadOrder(): void {
    this.isLoading = true;

    this._orderService.single(this.orderUUID)
      .pipe(
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe(
        (response: any) => {
          this.order = response.order;
          this.summary = response.summary;
          this.order_items = this.order.order_items;
        },
        (failure: any) => {

        }
      )
  }

  cancelOrder(): void {
    this.presentModal();
  }

  // Start chat
  chatSeller(): void {
    this.isChatLoading = true;

    this._chatService.create({'send_to_user': this.order.seller})
      .pipe(
        finalize(() => {
          this.isChatLoading = false;
        })
      )
      .subscribe(
        (response: any) => {
          this._router.navigate(['/chat', response.uuid]);
        },
        (failure: any) => {

        }
      )
  }

}
