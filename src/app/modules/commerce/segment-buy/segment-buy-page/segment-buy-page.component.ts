import { Component, OnInit, ViewChild } from '@angular/core';
import { IonInfiniteScroll } from '@ionic/angular';
import { finalize } from 'rxjs/operators';

import { ProductService } from '../../../../services/commerce/product.service';
import { AuthService } from '../../../../services/auth/auth.service';

@Component({
  selector: 'app-segment-buy-page',
  templateUrl: './segment-buy-page.component.html',
  styleUrls: ['./segment-buy-page.component.scss'],
})
export class SegmentBuyPageComponent implements OnInit {

  @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;
  
  products: any;
  credential: any;
  userUUID: string;
  isLoading: boolean = false;
  next: string = null;

  slideOpts = {
    autoplay: true
  };
  
  slides = [
    {
      'image': 'assets/banner/Open Pe O.png'
    },
    {
      'image': 'assets/banner/Open Pe O 3.png'
    },
    {
      'image': 'assets/banner/Open Po 5.png'
    },
    {
      'image': 'assets/banner/Open Pe o 2.png'
    },
    {
      'image': 'assets/banner/Open Pe O 4.png'
    },
  ];

  constructor(
    private _productService: ProductService,
    private _authService: AuthService
  ) { }

  ngOnInit() {
    this.credential = this._authService.getCredential();
    this.userUUID = (this.credential ? this.credential.uuid : '');
    this.loadProducts();
  }

  loadProducts(isLoadMore: boolean = false, event: any = ''): void {
    if (!isLoadMore) this.isLoading = true;
    let next = this.next;

    this._productService.list({'next': next})
      .pipe(
        finalize(() => {
          this.isLoading = false;
          if (isLoadMore) event.target.complete();
        })
      )
      .subscribe(
        (response: any) => {
          if (isLoadMore) {
            this.products = this.products.concat(response?.results);
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

}
