import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { CartService } from '../../../../services/commerce/cart.service';
import { OrderService } from '../../../../services/commerce/order.service';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-selling-update',
  templateUrl: './selling-update.component.html',
  styleUrls: ['./selling-update.component.scss'],
})
export class SellingUpdateComponent implements OnInit {

  @Input() item;
  @Input() order_items;
  @Input() action;

  updateSuccess: any = [];

  constructor(
    public modalCtrl: ModalController,
    private _orderService: OrderService
  ) { }

  ngOnInit() {}

  update(status: string): void {
    if (this.action == 'single') {
      const data = {
        'status': status,
        'order_uuid': this.item.order_uuid,
        'item_uuid': this.item.uuid,
      };

      this.runUpdate(data);
    }

    if (this.action == 'all') {
      for (let item of this.order_items) {
        const data = {
          'status': status,
          'order_uuid': item.order_uuid,
          'item_uuid': item.uuid,
        }

        this.runUpdate(data);
      }
    }
  }

  runUpdate(data: any): void {
    this._orderService.updateOrderItem(data.order_uuid, data.item_uuid, data)
      .pipe(
        finalize(() => {
          
        })
      )
      .subscribe(
        (response: any) => {
          if (this.action == 'single') {
            this.modalCtrl.dismiss({...response, 'has_update': true, 'action': this.action});
          }

          if (this.action == 'all') {
            this.updateSuccess.push(response);

            if (this.updateSuccess.length == this.order_items.length) {
              this.modalCtrl.dismiss({'action': 'all', 'has_update': true});
            }
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
