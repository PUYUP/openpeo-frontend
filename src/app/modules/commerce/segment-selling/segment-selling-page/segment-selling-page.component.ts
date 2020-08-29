import { Component, OnInit } from '@angular/core';
import { OrderService } from '../../../../services/commerce/order.service';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-segment-selling-page',
  templateUrl: './segment-selling-page.component.html',
  styleUrls: ['./segment-selling-page.component.scss'],
})
export class SegmentSellingPageComponent implements OnInit {

  sells: any = [];
  isLoading: boolean = false;

  constructor(
    private _orderService: OrderService
  ) { }

  ngOnInit() {
    this.loadSell();
  }

  loadSell(): void {
    this.isLoading = true;

    this._orderService.sell()
      .pipe(
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe(
        (response: any) => {
          this.sells = response;
        },
        (failure: any) => {

        }
      )
  }

}
