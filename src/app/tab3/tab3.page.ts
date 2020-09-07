import { Component, OnInit } from '@angular/core';
import { finalize } from 'rxjs/operators';
import { Router } from '@angular/router';

import { OrderService } from '../services/commerce/order.service';
import { CartService } from '../services/commerce/cart.service';
import { EventService } from '../services/event.service';

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
  
  constructor(
    private _cartService: CartService,
    private _orderService: OrderService,
    private _eventService: EventService,
    private _router: Router,
  ) { }

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
    let carts = [];

    for (let cart of this.carts) {
      sellers.push(cart.seller);
      carts.push(cart.id);
    }

    const data = {
      'sellers': sellers,
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
        },
        (failure: any) => {

        }
      )
  }

}
