import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../../../services/commerce/product.service';
import { AuthService } from '../../../../services/auth/auth.service';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-segment-buy-page',
  templateUrl: './segment-buy-page.component.html',
  styleUrls: ['./segment-buy-page.component.scss'],
})
export class SegmentBuyPageComponent implements OnInit {

  products: any;
  credential: any;
  userUUID: string;
  isLoading: boolean = false;

  constructor(
    private _productService: ProductService,
    private _authService: AuthService
  ) { }

  ngOnInit() {
    this.credential = this._authService.getCredential();
    this.userUUID = (this.credential ? this.credential.uuid : '');
    this.loadProducts();
  }

  ionViewDidEnter() {
  }

  loadProducts(): void {
    this.isLoading = true;

    this._productService.list()
      .pipe(
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe(
        (response: any) => {
          this.products = response;
        },
        (failure: any) => {

        }
      )
  }

}
