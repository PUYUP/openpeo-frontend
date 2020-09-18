import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';

import { environment } from '../../../environments/environment';
import { retry, map, catchError } from 'rxjs/operators';
import { AlertController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class SettingService {

  host: string = environment.host;
  private debug: boolean = environment.debug;
  urlBank: string = this.host + '/api/commerce/banks/';
  urlPayment: string = this.host + '/api/commerce/payment-banks/';
  urlAddress: string = this.host + '/api/commerce/address/';

  constructor(
    public alertController: AlertController,
    private _httpClient: HttpClient
  ) { }

  private async _presentAlert(message: string) {
    const alert = await this.alertController.create({
      header: 'Informasi',
      message: message,
      buttons: ['OK']
    });

    await alert.present();
  }

  /**
  * Handle error and show it.
  */
  private _handleError(error: HttpErrorResponse) {
    let message = 'Something wrong!';
    let errorData = error?.error;

    // error as object
    if (typeof errorData === 'object') {
      let msgList = [];

      for (let k in errorData) {
        let e = errorData[k];

        // Check is array
        if (Array.isArray(e)) {
          msgList.push(e.join(' '));
        } else {
          msgList.push(e);
        }
      }

      // Print the message
      message = msgList.join(' ');

    } else {
      // Default errorData
      if (errorData && errorData?.detail) {
        message = errorData?.detail;
      }
    }
    
    // Debuh only
    if (this.debug) {
      if (error.error instanceof ErrorEvent) {
        // A client-side or network error occurred. Handle it accordingly.
        console.error('An error occurred:', errorData?.detail);
      } else {
        // The backend returned an unsuccessful response code.
        // The response body may contain clues as to what went wrong.
        console.error(
          `Backend returned code ${error.status}, ` +
          `body was: ${error.error}`);
      }
    }

    // Show error to user
    this._presentAlert(message);

    // Return an observable with a user-facing error message.
    return throwError(message);
  }

  paymentCreate(context: any): Observable<any> {
    return this._httpClient.post(this.urlPayment, context, {withCredentials: true})
      .pipe(
        retry(3),
        map((response: any) => {
          return response;
        }),
        catchError(
          (e: HttpErrorResponse) => this._handleError(e)
        )
      )
  }

  paymentUpdate(context: any, paymentUUID: string): Observable<any> {
    return this._httpClient.patch(this.urlPayment + paymentUUID + '/', context, {withCredentials: true})
      .pipe(
        retry(3),
        map((response: any) => {
          return response;
        }),
        catchError(
          (e: HttpErrorResponse) => this._handleError(e)
        )
      )
  }

  paymentDelete(paymentUUID: string): Observable<any> {
    return this._httpClient.delete(this.urlPayment + paymentUUID + '/', {withCredentials: true})
      .pipe(
        retry(3),
        map((response: any) => {
          return response;
        }),
        catchError(
          (e: HttpErrorResponse) => this._handleError(e)
        )
      )
  }

  paymentList(sellerUUID: string = ''): Observable<any> {
    let url = this.urlPayment;
    if (sellerUUID) url = this.urlPayment + '?seller_uuid=' + sellerUUID;

    return this._httpClient.get(url, {withCredentials: true})
      .pipe(
        retry(3),
        map((response: any) => {
          return response;
        }),
        catchError(
          (e: HttpErrorResponse) => this._handleError(e)
        )
      )
  }

  paymentSingle(paymentUUID: string): Observable<any> {
    return this._httpClient.get(this.urlPayment + paymentUUID + '/', {withCredentials: true})
      .pipe(
        retry(3),
        map((response: any) => {
          return response;
        }),
        catchError(
          (e: HttpErrorResponse) => this._handleError(e)
        )
      )
  }

  bankList(): Observable<any> {
    return this._httpClient.get(this.urlBank, {withCredentials: true})
      .pipe(
        retry(3),
        map((response: any) => {
          return response;
        }),
        catchError(
          (e: HttpErrorResponse) => this._handleError(e)
        )
      )
  }


  addressCreate(context: any): Observable<any> {
    return this._httpClient.post(this.urlAddress, context, {withCredentials: true})
      .pipe(
        retry(3),
        map((response: any) => {
          return response;
        }),
        catchError(
          (e: HttpErrorResponse) => this._handleError(e)
        )
      )
  }

  addressUpdate(context: any, addressUUID: string): Observable<any> {
    return this._httpClient.patch(this.urlAddress + addressUUID + '/', context, {withCredentials: true})
      .pipe(
        retry(3),
        map((response: any) => {
          return response;
        }),
        catchError(
          (e: HttpErrorResponse) => this._handleError(e)
        )
      )
  }

  addressDelete(addressUUID: string): Observable<any> {
    return this._httpClient.delete(this.urlAddress + addressUUID + '/', {withCredentials: true})
      .pipe(
        retry(3),
        map((response: any) => {
          return response;
        }),
        catchError(
          (e: HttpErrorResponse) => this._handleError(e)
        )
      )
  }

  addressList(): Observable<any> {
    return this._httpClient.get(this.urlAddress, {withCredentials: true})
      .pipe(
        retry(3),
        map((response: any) => {
          return response;
        }),
        catchError(
          (e: HttpErrorResponse) => this._handleError(e)
        )
      )
  }

  addressSingle(addressUUID: string): Observable<any> {
    return this._httpClient.get(this.urlAddress + addressUUID + '/', {withCredentials: true})
      .pipe(
        retry(3),
        map((response: any) => {
          return response;
        }),
        catchError(
          (e: HttpErrorResponse) => this._handleError(e)
        )
      )
  }

}
