import { Injectable } from '@angular/core';

import { environment } from '../../../environments/environment';
import { retry, map, catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { AlertController } from '@ionic/angular';


@Injectable({
  providedIn: 'root'
})
export class ChatService {

  host: string = environment.host;
  private debug: boolean = environment.debug;
  url: string = this.host + '/api/commerce/chats/';

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

  create(context: any): Observable<any> {
    return this._httpClient.post(this.url, context, {withCredentials: true})
      .pipe(
        retry(3),
        map((respose: any) => {
          return respose;
        }),
        catchError(
          (e: HttpErrorResponse) => this._handleError(e)
        )
      )
  }

  list(param: any = {}): Observable<any> {
    let url = this.url;
    let next = param?.next;
    if (next) url = next;

    return this._httpClient.get(url, {withCredentials: true})
      .pipe(
        retry(3),
        map((respose: any) => {
          return respose;
        })
      )
  }

  detail(chatUUID: string): Observable<any> {
    return this._httpClient.get(this.url + chatUUID + '/', {withCredentials: true})
      .pipe(
        retry(3),
        map((respose: any) => {
          return respose;
        }),
        catchError(
          (e: HttpErrorResponse) => this._handleError(e)
        )
      )
  }

  submitMessage(chatUUID: string, context: any, file: any = ''): Observable<any> {
    let body = new FormData();

    if (file) {
      for (let k in context) {
        body.append(k, context[k]);
      }

      body.append('attach_file', file);
      body.append('message', file.name);
    } else {
      body = context;
    }

    return this._httpClient.post(this.url + chatUUID + '/messages/', body, {withCredentials: true})
      .pipe(
        retry(3),
        map((respose: any) => {
          return respose;
        }),
        catchError(
          (e: HttpErrorResponse) => this._handleError(e)
        )
      )
  }

  getMessages(param: any = {}): Observable<any> {
    let chatUUID = param?.chatUUID;
    let url = this.url + chatUUID + '/messages/';
    let next = param?.next;
    if (next) url = next;

    return this._httpClient.get(url, {withCredentials: true})
      .pipe(
        retry(3),
        map((respose: any) => {
          return respose;
        }),
        catchError(
          (e: HttpErrorResponse) => this._handleError(e)
        )
      )
  }

  uploadAttachment(messageUUID: string, context: any): Observable<any> {
    const url = this.host + '/api/commerce/chats/' + messageUUID + '/attachments/';

    let body = new FormData();
    for (let k in context) {
      body.append(k, context[k]);
    }

    return this._httpClient.post(url, body, {withCredentials: true})
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
