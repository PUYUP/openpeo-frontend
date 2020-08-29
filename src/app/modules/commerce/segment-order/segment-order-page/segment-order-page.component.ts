import { Component, OnInit } from '@angular/core';
import { OrderService } from '../../../../services/commerce/order.service';
import { finalize } from 'rxjs/operators';
import { Router } from '@angular/router';

@Component({
  selector: 'app-segment-order-page',
  templateUrl: './segment-order-page.component.html',
  styleUrls: ['./segment-order-page.component.scss'],
})
export class SegmentOrderPageComponent implements OnInit {

  isLoading: boolean = false;
  order: any;
  orders: any = [];

  constructor(
    private _orderService: OrderService,
    private _router: Router
  ) { }

  ngOnInit() {
    this.loadOrder();
  }

  loadOrder(): void {
    this.isLoading = true;

    this._orderService.list()
      .pipe(
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe(
        (response: any) => {
          this.order = response;
          this.orders = this.order.orders;
        },
        (failure: any) => {

        }
      )
  }

  toDetail(item: any): void {
    this._router.navigate(['/order/', item.uuid]);
  }

}
