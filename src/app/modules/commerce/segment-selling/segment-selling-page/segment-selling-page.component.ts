import { Component, OnInit, ViewChild } from '@angular/core';
import { OrderService } from '../../../../services/commerce/order.service';
import { finalize } from 'rxjs/operators';
import { IonInfiniteScroll } from '@ionic/angular';

@Component({
  selector: 'app-segment-selling-page',
  templateUrl: './segment-selling-page.component.html',
  styleUrls: ['./segment-selling-page.component.scss'],
})
export class SegmentSellingPageComponent implements OnInit {

  @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;

  sells: any = [];
  isLoading: boolean = false;
  next: string = null;

  constructor(
    private _orderService: OrderService
  ) { }

  ngOnInit() {
    this.loadSell();
  }

  loadSell(isLoadMore: boolean = false, event: any = ''): void {
    if (!isLoadMore) this.isLoading = true;
    let next = this.next;

    this._orderService.sell({'next': next})
      .pipe(
        finalize(() => {
          this.isLoading = false;
          if (isLoadMore) event.target.complete();
        })
      )
      .subscribe(
        (response: any) => {
          if (isLoadMore) {
            this.sells = this.sells.concat(response?.results);
          } else {
            this.sells = response?.results;
          }

          this.next = response.navigate?.next;
          if (event && !this.next) event.target.disabled = true;
        },
        (failure: any) => {

        }
      )
  }

  loadData(event: any) {
    this.loadSell(true, event);
  }

}
