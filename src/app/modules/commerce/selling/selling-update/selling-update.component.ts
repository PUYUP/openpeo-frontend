import { Component, OnInit, Input } from '@angular/core';
import { ModalController, AlertController } from '@ionic/angular';
import { finalize } from 'rxjs/operators';

import { OrderService } from '../../../../services/commerce/order.service';


@Component({
  selector: 'app-selling-update',
  templateUrl: './selling-update.component.html',
  styleUrls: ['./selling-update.component.scss'],
})
export class SellingUpdateComponent implements OnInit {

  @Input() item: any;
  @Input() order_items: any;
  @Input() action: any;

  updateSuccess: any = [];
  status: string;

  constructor(
    public modalCtrl: ModalController,
    public alertController: AlertController,
    private _orderService: OrderService
  ) { }

  async presentAlertPrompt() {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Ongkos Kirim',
      inputs: [
        {
          name: 'shipping_cost',
          type: 'number',
          placeholder: 'Hanya angka. Contoh: 10000'
        }
      ],
      buttons: [
        {
          text: 'Batal',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel');
          }
        }, {
          text: 'Konfirmasi',
          handler: (inputValue: any) => {
            const shippingCost = inputValue?.shipping_cost;

            if (shippingCost) {
              if (this.action == 'single') {
                const data = {
                  'status': this.status,
                  'order_uuid': this.item.order_uuid,
                  'item_uuid': this.item.uuid,
                  'shipping_cost': shippingCost,
                };

                this.runUpdate(data);
              }

              if (this.action == 'all') {
                for (let item of this.order_items) {
                  const data = {
                    'status': this.status,
                    'order_uuid': item.order_uuid,
                    'item_uuid': item.uuid,
                    'shipping_cost': shippingCost,
                  }

                  this.runUpdate(data);
                }
              }
            }
          }
        }
      ]
    });

    await alert.present();
  }

  ngOnInit() {}

  update(status: string): void {
    this.status = status;
    if (this.status == 'confirmed') {
      this.presentAlertPrompt();
    } else {
      this.updateOrder();
    }
  }

  updateOrder() {
    if (this.action == 'single') {
        const data = {
          'status': this.status,
          'order_uuid': this.item.order_uuid,
          'item_uuid': this.item.uuid,
        };

        this.runUpdate(data);
      }

      if (this.action == 'all') {
        for (let item of this.order_items) {
          const data = {
            'status': this.status,
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
