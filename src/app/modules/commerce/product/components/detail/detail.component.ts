import { Component, OnInit } from '@angular/core';
import {  ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../../../../../services/commerce/product.service';
import { finalize } from 'rxjs/operators';
import { Location } from '@angular/common';
import { CartService } from '../../../../../services/commerce/cart.service';
import { AlertController, NavController } from '@ionic/angular';
import { ChatService } from '../../../../../services/commerce/chat.service';

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
  isChatLoading: boolean = false;
  itemQty: number = 0;
  message: string = '';
  toolbarBackground: string = 'transparent';
  showTitle: boolean = false;
  elNavigator: any;

  constructor(
    public alertController: AlertController,
    public navCtrl: NavController,
    private _router: Router,
    private _location: Location,
    private _activatedRoute: ActivatedRoute,
    private _productService: ProductService,
    private _cartService: CartService,
    private _chatService: ChatService
  ) { }

  async presentAlert(message: string) {
    const alert = await this.alertController.create({
      message: message,
      buttons: [
        {
          text: 'Chat Penjual',
          cssClass: 'text-red-500',
          handler: () => {
            this.startChat();
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

  async presentWarningAlert(message: string) {
    const alert = await this.alertController.create({
      message: message,
      buttons: [
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
    this.elNavigator = window.navigator;
    this.productUUID = this._activatedRoute.snapshot.paramMap.get('product_uuid');
    this.loadProduct();
  }

  share() {
    if (this.elNavigator && this.elNavigator.share) {
      this.elNavigator.share({
        title: 'Open Pe O',
        text: 'Hay! Yuk belanja.',
        url: document.location.href,
      })
      .then(() => console.log('Successful share'))
      .catch((error) => console.log('Error sharing', error));
    }
  }

  logScrollStart() {

  }

  logScrolling(event: any) {
    const scrollTop = event.detail?.scrollTop;
    
    if (scrollTop > 100) {
      this.toolbarBackground = '#F64C4C';
      this.showTitle = true;
    }

    if (scrollTop < 50) {
      this.toolbarBackground = 'transparent';
      this.showTitle = false;
    }
  }

  logScrollEnd() {

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
        }
      )
  }

  startChat(): void {
    this.isChatLoading = true;

    const data = {
      'send_to_user': this.product.seller_id,
      'chat_messages': [
        {
          'message': "Hai apakah produk ini masih ada?",
          'content_type': this.product.content_type_id,
          'object_id': this.product.id,
        }
      ]
    };

    this._chatService.create(data)
      .pipe(
        finalize(() => {
          this.isChatLoading = false;
        })
      )
      .subscribe(
        (response: any) => {
          this._router.navigate(['/chat', response.uuid]);
        }
      )
  }

}
