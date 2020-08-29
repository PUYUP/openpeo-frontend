import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { OrderService } from '../../../../services/commerce/order.service';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-order-cancel',
  templateUrl: './order-cancel.component.html',
  styleUrls: ['./order-cancel.component.scss'],
})
export class OrderCancelComponent implements OnInit {

  @Input() cart: any;
  @Input() cart_items: any;

  removeItems: any = [];
  removeItemsSuccess: any = [];
  cartItemsExted: any = [];

  constructor(
    public modalCtrl: ModalController,
    private _orderService: OrderService
  ) { }

  ngOnInit() {
    for (let item of this.cart_items) {
      item.is_removed = false;
      this.cartItemsExted.push(item);
    }
  }

  removeItem(item: any): void {
    const index = this.cartItemsExted.findIndex((x: any) => x.uuid === item.uuid);

    if ( item.is_removed == false) {
      this.removeItems.push(item);
      this.cartItemsExted[index].is_removed = true;
    } else {
      this.cartItemsExted[index].is_removed = false;
      this.removeItems =  this.removeItems.filter((x: any) => x.uuid !== item.uuid);
    }
  }

  removeSelectedItem(): void {
    for (let item of this.removeItems) {
      this.removeItemObject(item.uuid);
    }
  }

  removeItemObject(uuid: string): void {
    this._orderService.removeItem(this.cart.uuid, uuid)
      .pipe(
        finalize(() => {
          
        })
      )
      .subscribe(
        (response: any) => {
          this.removeItemsSuccess.push(response);

          this.cartItemsExted = this.removeItems.filter((x: any) => x.uuid !== uuid);

          if (this.removeItemsSuccess.length == this.removeItems.length && this.cartItemsExted.length > 0) {
            this.dismiss('removed');
          }

          if (this.cartItemsExted.length == 0) {
            this.dismiss('cleanup');
          }
        },
        (failure: any) => {

        }
      )
  }

  dismiss(action: string = '') {
    // using the injected ModalController this page
    // can "dismiss" itself and optionally pass back data
    this.modalCtrl.dismiss({
      'dismissed': true,
      'action': action
    });
  }

}
