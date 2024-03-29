import { Component, OnInit, ViewChild } from '@angular/core';
import { ActionSheetController, AlertController, IonInfiniteScroll } from '@ionic/angular';
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
  radius: number;
  geoMessage: string;
  latitude: string;
  longitude: string;
  searchKeyword: string = null;

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
    private _authService: AuthService,
    public alertController: AlertController,
    public actionSheetController: ActionSheetController
  ) { }

  async presentAlertPrompt() {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Dalam radius kilometer',
      inputs: [
        {
          name: 'radius',
          type: 'number',
          placeholder: 'Hanya angka, misal: 10'
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel');
          }
        }, {
          text: 'Filter',
          handler: (inputValue: any) => {
            this.radius = inputValue?.radius;

            this.loadProductsRadius({
              'radius': this.radius,
              'latitude': this.latitude,
              'longitude': this.longitude
            });
          }
        }
      ]
    });

    await alert.present();
  }

  async presentFilterSheet() {
    const actionSheet = await this.actionSheetController.create({
      header: 'Filter',
      cssClass: 'my-custom-class',
      buttons: [
        {
          text: 'Semua',
          icon: 'list-outline',
          handler: () => {
            this.loadProductsSearch({});
          }
        },
        {
          text: 'Wishlist',
          icon: 'heart',
          handler: () => {
            this.loadProductsSearch({'is_wishlist': '1'});
          }
        }, 
        {
          text: 'Toko Buka',
          icon: 'medical',
          handler: () => {
            this.loadProductsSearch({'is_active': '1'});
          }
        }
      ]
    });

    await actionSheet.present();
  }

  ngOnInit() {
    this.credential = this._authService.getCredential();
    this.userUUID = (this.credential ? this.credential.uuid : '');
    this.loadProducts({});
  }

  showFilter() {
    this.presentFilterSheet();
  }

  markWishlist(item: any) {
    if (item.is_wishlist) {
      this.removeWishlist(item.wishlist_uuid);
    } else {
      this.createWishlist(item.id);
    }
  }

  createWishlist(product_id: number) {
    this._productService.wishlistCreate({'product': product_id})
      .pipe(
        finalize(() => {
          // pass
        })
      )
      .subscribe(
        (response: any) => {
          const index = this.products.findIndex((p: any) => p.id == product_id);

          this.products[index].is_wishlist = true;
          this.products[index].wishlist_uuid = response.uuid;
        }
      )
  }

  removeWishlist(wishlistUUID: string) {
    this._productService.wishlistDelete(wishlistUUID)
      .pipe(
        finalize(() => {
          // pass
        })
      )
      .subscribe(
        (response: any) => {
          const index = this.products.findIndex((p: any) => p.wishlist_uuid == wishlistUUID);
          
          this.products[index].is_wishlist = false;
          this.products[index].wishlist_uuid = null;
        }
      )
  }

  getLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(this.showPosition, this.showError);
    } else { 
      this.geoMessage = "Geolocation is not supported by this browser.";
    }
  }

  showPosition = (position: any) => {
    this.latitude = position.coords.latitude;
    this.longitude = position.coords.longitude;

    this.presentAlertPrompt();
  }

  showError = (error: any) => {
    switch(error.code) {
      case error.PERMISSION_DENIED:
        this.geoMessage = "User denied the request for Geolocation."
        break;
      case error.POSITION_UNAVAILABLE:
        this.geoMessage = "Location information is unavailable."
        break;
      case error.TIMEOUT:
        this.geoMessage = "The request to get user location timed out."
        break;
      case error.UNKNOWN_ERROR:
        this.geoMessage = "An unknown error occurred."
        break;
    }
  }

  loadProducts(params: any): void {
    let isLoadMore = params?.isLoadMore;
    let event = params?.event;
    let latitude = params?.latitude;
    let longitude = params?.longitude;
    let radius = params?.radius;

    if (!isLoadMore) this.isLoading = true;
    let next = this.next;

    const finalParam = {
      'next': next, 
      'latitude': latitude, 
      'longitude': longitude, 
      'radius': radius, 
    }

    this._productService.list(finalParam)
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

  loadProductsRadius(params: any): void {
    let latitude = params?.latitude;
    let longitude = params?.longitude;
    let radius = params?.radius;
  
    this._productService.list({'latitude': latitude, 'longitude': longitude, 'radius': radius})
      .pipe(
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe(
        (response: any) => {
          this.products = response?.results;
        }
      )
  }

  loadProductsSearch(params: any): void {
    let latitude = params?.latitude;
    let longitude = params?.longitude;
    let radius = params?.radius;
    let s = params?.s;
    let is_wishlist = params?.is_wishlist;
    let is_active = params?.is_active;

    const finalParam = {
      'latitude': latitude, 
      'longitude': longitude, 
      'radius': radius, 
      's': s, 
      'is_wishlist': is_wishlist,
      'is_active': is_active
    }
  
    this._productService.list(finalParam)
      .pipe(
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe(
        (response: any) => {
          this.products = response?.results;
        }
      )
  }

  loadData(event: any) {
    this.loadProducts({
      'isLoadMore': true, 
      'event': event,
      's': this.searchKeyword,
      'radius': this.radius,
      'latitude': this.latitude,
      'longitude': this.longitude
    });
  }

  searchChange(event: any) {
    this.searchKeyword = event.target.value;

    this.loadProductsSearch({
      's': this.searchKeyword,
      'radius': this.radius,
      'latitude': this.latitude,
      'longitude': this.longitude
    });
  }

}
