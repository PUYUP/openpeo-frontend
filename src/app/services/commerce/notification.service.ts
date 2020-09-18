import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';

import { environment } from '../../../environments/environment';
import { retry, map, catchError } from 'rxjs/operators';
import { AlertController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  host: string = environment.host;
  private debug: boolean = environment.debug;
  url: string = this.host + '/api/commerce/notifications/';

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

  list(): Observable<any> {
    return this._httpClient.get(this.url, {withCredentials: true})
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
  
}
