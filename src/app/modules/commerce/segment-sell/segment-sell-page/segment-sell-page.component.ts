import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../../../services/commerce/product.service';
import { finalize } from 'rxjs/operators';
import { AuthService } from '../../../../services/auth/auth.service';
import { EventService } from '../../../../services/event.service';

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
    private _authService: AuthService,
    private _eventService: EventService
  ) { }

  ngOnInit() {
    this.credential = this._authService.getCredential();
    this.userUUID = (this.credential ? this.credential.uuid : '');

    this.loadProducts();
    
    // created
    this._eventService.subscribe('commerce:productCreated', (product: any) => {
      this.loadProducts();
    });

    // updated
    this._eventService.subscribe('commerce:productUpdated', (product: any) => {
      this.loadProducts();
    });

    // deleted
    this._eventService.subscribe('commerce:productDeleted', (product: any) => {
      this.loadProducts();
    });
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

  ngOnDestroy() {
    this._eventService.destroy('commerce:productCreated');
    this._eventService.destroy('commerce:productUpdated');
    this._eventService.destroy('commerce:productDeleted');
  }

}
