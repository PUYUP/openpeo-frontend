import { Component, OnInit } from '@angular/core';
import {  ActivatedRoute } from '@angular/router';
import { ProductService } from '../../../../../services/commerce/product.service';
import { finalize } from 'rxjs/operators';
import { Location } from '@angular/common';
import { CartService } from '../../../../../services/commerce/cart.service';
import { AlertController, NavController } from '@ionic/angular';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss'],
})
export class DetailComponent implements OnInit {

  productUUID: string;
  product: any;
  isLoading: boolean = false;
  isCartLoading: boolean = false;
  itemQty: number = 0;

  constructor(
    public alertController: AlertController,
    public navCtrl: NavController,
    private _location: Location,
    private _activatedRoute: ActivatedRoute,
    private _productService: ProductService,
    private _cartService: CartService
  ) { }

  async presentAlert(message: string) {
    const alert = await this.alertController.create({
      message: message,
      buttons: [
        {
          text: 'Chat Penjual',
          cssClass: 'text-red-500',
          handler: () => {
            console.log('Confirm Okay');
          }
        },
        {
          text: 'Tutup',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
          }
        }
      ]
    });

    await alert.present();
  }

  ngOnInit() {
    this.productUUID = this._activatedRoute.snapshot.paramMap.get('product_uuid');
    this.loadProduct();
  }

  back(): void {
    this.navCtrl.setDirection("back", true, "back");
    this._location.back();
  }

  loadProduct(): void {
    this._productService.single('', this.productUUID)
      .pipe(
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe(
        (response: any) => {
          this.product = response;
        },
        (failure: any) => {

        }
      )
  }

  addQty(action: string): void {
    if (action == '+') this.itemQty++;
    if (action == '-') this.itemQty--;
  }

  addCart(): void {
    const data = {
      seller: this.product.seller_id,
      cart_items: [
        {
          product: this.product.id,
          quantity: this.itemQty,
        }
      ]
    }

    this.isCartLoading = true;

    this._cartService.create(data)
      .pipe(
        finalize(() => {
          this.isCartLoading = false;
        })
      )
      .subscribe(
        (response: any) => {
          const message = `<div class="text-center">
            <p class="text-lg font-bold mb-2">Berhasil Tambah ke keranjang</p>
            <p class="text-gray-600">Produk sudah ditambahkan dalam keranjang, pilih menu <strong>Keranjang</strong> untuk mengakses.</p>
          </div>`;

          this.presentAlert(message);
        },
        (failure: any) => {

        }
      )
  }

}
