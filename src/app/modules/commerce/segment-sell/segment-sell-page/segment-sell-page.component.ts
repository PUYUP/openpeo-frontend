import { Component, OnInit, ViewChild } from '@angular/core';
import { ProductService } from '../../../../services/commerce/product.service';
import { finalize } from 'rxjs/operators';
import { AuthService } from '../../../../services/auth/auth.service';
import { EventService } from '../../../../services/event.service';
import { IonInfiniteScroll } from '@ionic/angular';

@Component({
  selector: 'app-segment-sell-page',
  templateUrl: './segment-sell-page.component.html',
  styleUrls: ['./segment-sell-page.component.scss'],
})
export class SegmentSellPageComponent implements OnInit {

  @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;
  
  products: any;
  credential: any;
  userUUID: string;
  isLoading: boolean = false;
  next: string = null;

  constructor(
    private _productService: ProductService,
    private _authService: AuthService,
    private _eventService: EventService
  ) { }

  ngOnInit() {
    this.credential = this._authService.getCredential();
    this.userUUID = (this.credential ? this.credential.uuid : '');

    this.loadProducts();
    
    // created
    this._eventService.subscribe('commerce:productCreated', (product: any) => {
      this.products.unshift(product);
    });

    // updated
    this._eventService.subscribe('commerce:productUpdated', (product: any) => {
      const index = this.products.findIndex((d: any) => d.uuid === product.uuid);
      this.products[index] = product;
    });

    // deleted
    this._eventService.subscribe('commerce:productDeleted', (product: any) => {
      this.products = this.products.filter((d: any) => d.uuid !== product.uuid);
    });
  }

  loadProducts(isLoadMore: boolean = false, event: any = ''): void {
    if (!isLoadMore) this.isLoading = true;
    let next = this.next;

    this._productService.list({'userUUID': this.userUUID, 'next': next})
      .pipe(
        finalize(() => {
          this.isLoading = false;
          if (isLoadMore) event.target.complete();
        })
      )
      .subscribe(
        (response: any) => {
          if (isLoadMore) {
            this.products = this.products.concat(response?.results)
          } else {
            this.products = response?.results;
          }

          this.next = response.navigate?.next;
          if (event && !this.next) event.target.disabled = true;
        }
      )
  }

  loadData(event: any) {
    this.loadProducts(true, event);
  }

  ngOnDestroy() {
    this._eventService.destroy('commerce:productCreated');
    this._eventService.destroy('commerce:productUpdated');
    this._eventService.destroy('commerce:productDeleted');
  }

}
