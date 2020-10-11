import { Component, OnInit } from '@angular/core';
import { finalize } from 'rxjs/operators';
import { Router } from '@angular/router';

import { OrderService } from '../services/commerce/order.service';
import { CartService } from '../services/commerce/cart.service';
import { EventService } from '../services/event.service';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page implements OnInit {

  isLoading: boolean = false;
  cart: any;
  carts: any;
  cartSummary: any;
  orders: any = [];
  noteAlert: any;
  
  constructor(
    private _cartService: CartService,
    private _orderService: OrderService,
    private _eventService: EventService,
    private _router: Router,
    public alertController: AlertController
  ) { }

  async presentNotePrompt(item: any, cart: any) {
    this.noteAlert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Catatan',
      inputs: [
        {
          name: 'note',
          id: 'note',
          type: 'textarea',
          placeholder: 'Catatan tambahan',
          value: (item.note ? item.note : '')
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
          text: 'Simpan',
          handler: (value: any) => {
            var note = value?.note;
            
            this.saveNote(note, item, cart);
            return false;
          }
        }
      ]
    });

    await this.noteAlert.present();
  }

  ngOnInit() {
    
  }

  ionViewDidEnter() {
    this.loadCart();
  }

  loadCart(): void {
    this._cartService.list()
      .pipe(
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe(
        (response: any) => {
          this.cart = response;
          this.carts = this.cart.carts;
          this.cartSummary = this.cart.summary;
        },
        (failure: any) => {

        }
      )
  }

  makeOrder(): void {
    // create multiple order
    let sellers = [];
    let sellers_fcm_token = [];
    let carts = [];

    for (let cart of this.carts) {
      sellers.push(cart.seller);
      sellers_fcm_token.push(cart.seller_fcm_token);
      carts.push(cart.id);
    }

    const data = {
      'sellers': sellers,
      'sellers_fcm_token': sellers_fcm_token,
      'carts': carts,
    };

    this.createOrder(data);
  }

  createOrder(data: any): void {
    this._orderService.bulkCreate(data)
      .pipe(
        finalize(() => {

        })
      )
      .subscribe(
        (response: any) => {
          this._router.navigate(['tabs/tab2'], {replaceUrl: true});
          this._eventService.publish('commerce:orderCreated', response);
        }
      )
  }

  addNote(item: any, cart: any) {
    this.presentNotePrompt(item, cart);
  }

  saveNote(note: string, item: any, cart: any) {
    this._orderService.updateItem(cart?.uuid, item?.uuid, {'note': note})
      .pipe(
        finalize(() => {
          this.noteAlert.dismiss();
        })
      )
      .subscribe(
        (response: any) => {
          let cartIndex = this.carts.findIndex((c: any) => c.uuid == cart.uuid);
          let c = this.carts[cartIndex];
          let c_items = c.cart_items;
          let itemIndex = c_items.findIndex((i: any) => i.uuid == item.uuid);

          c_items[itemIndex].note = note;
          this.carts[cartIndex].cart_items = c_items;
        }
      )
  }

}
