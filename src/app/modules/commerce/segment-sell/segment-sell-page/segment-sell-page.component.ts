import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../../../services/commerce/product.service';
import { finalize } from 'rxjs/operators';
import { AuthService } from '../../../../services/auth/auth.service';

@Component({
  selector: 'app-segment-sell-page',
  templateUrl: './segment-sell-page.component.html',
  styleUrls: ['./segment-sell-page.component.scss'],
})
export class SegmentSellPageComponent implements OnInit {

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

    this._productService.list(this.userUUID)
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
