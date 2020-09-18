import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';

import { environment } from '../../../environments/environment';
import { retry, map, catchError } from 'rxjs/operators';
import { AlertController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  host: string = environment.host;
  private debug: boolean = environment.debug;
  url: string = this.host + '/api/commerce/products/';

  constructor(
    public alertController: AlertController,
    private httpClient: HttpClient
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

  create(context: any): Observable<any> {
    return this.httpClient.post(this.url, context, {withCredentials: true})
      .pipe(
        retry(1),
        map((response: any) => {
          return response;
        }),
        catchError(
          (e: HttpErrorResponse) => this._handleError(e)
        )
      )
  }

  edit(context: any, productUUID = ''): Observable<any> {
    let url = this.url;

    if (productUUID) {
      url += productUUID + '/';
    }

    return this.httpClient.patch(url, context, {withCredentials: true})
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

  delete(productUUID = ''): Observable<any> {
    let url = this.url;

    if (productUUID) {
      url += productUUID + '/';
    }

    return this.httpClient.delete(url, {withCredentials: true})
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

  list(param: any = {}): Observable<any> {
    // product related to user
    let url = this.url;
    let next = param?.next;
    let userUUID = param?.userUUID;
    let params = new HttpParams();
    
    if (userUUID) params=params.set('user_uuid', userUUID);
    if (next) url = next;

    return this.httpClient.get(url, {withCredentials: true, params: params})
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

  single(userUUID: string = '', productUUID: string = ''): Observable<any> {
    let url = this.url;

    if (productUUID) {
      url += productUUID + '/';
    }

    return this.httpClient.get(url, {withCredentials: true})
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

  createAttachment(productUUID: string, context: any): Observable<any> {
    const url = this.host + '/api/commerce/products/' + productUUID + '/attachments/';

    let body = new FormData();
    for (let k in context) {
      body.append(k, context[k]);
    }

    return this.httpClient.post(url, body, {withCredentials: true})
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
