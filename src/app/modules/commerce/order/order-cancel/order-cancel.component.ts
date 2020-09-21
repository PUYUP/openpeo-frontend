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

  @Input() order: any;
  @Input() order_items: any;

  removeItems: any = [];
  removeItemsSuccess: any = [];
  orderItemsExted: any = [];

  constructor(
    public modalCtrl: ModalController,
    private _orderService: OrderService
  ) { }

  ngOnInit() {
    for (let item of this.order_items) {
      item.is_removed = false;
      
      // only pending status allow canceled
      if (item.status == 'pending') {
        this.orderItemsExted.push(item);
      }
    }
  }

  removeItem(item: any): void {
    const index = this.orderItemsExted.findIndex((x: any) => x.uuid === item.uuid);

    if ( item.is_removed == false) {
      this.removeItems.push(item);
      this.orderItemsExted[index].is_removed = true;
    } else {
      this.orderItemsExted[index].is_removed = false;
      this.removeItems =  this.removeItems.filter((x: any) => x.uuid !== item.uuid);
    }
  }

  removeSelectedItem(): void {
    for (let item of this.removeItems) {
      this.removeItemObject(item.uuid);
    }
  }

  removeItemObject(uuid: string): void {
    this._orderService.removeOrderItem(this.order.uuid, uuid)
      .pipe(
        finalize(() => {
          
        })
      )
      .subscribe(
        (response: any) => {
          this.removeItemsSuccess.push(response);

          this.orderItemsExted = this.removeItems.filter((x: any) => x.uuid !== uuid);

          if (this.removeItemsSuccess.length == this.removeItems.length && this.orderItemsExted.length > 0) {
            this.dismiss('removed');
          }

          if (this.orderItemsExted.length == 0) {
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
