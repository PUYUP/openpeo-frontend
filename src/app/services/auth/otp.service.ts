import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map, retry } from 'rxjs/operators';

import { environment } from '../../../environments/environment';
import { AlertController } from '@ionic/angular';


@Injectable({
  providedIn: 'root'
})
export class OtpService {

  private debug: boolean = environment.debug;
  
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

  /**
   * Create OTPs
   */
  createOTP(context: any): Observable<any> {
    const url = environment.host + '/api/person/otps/';

    return this._httpClient.post<any>(url, context, {withCredentials: true})
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

  /**
   * Resend OTPs
   */
  resendOTP(context: any, uuid: string): Observable<any> {
    const url = environment.host + '/api/person/otps/' + uuid + '/';

    return this._httpClient.patch<any>(url, context, {withCredentials: true})
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

  /**
   * Verification
   */
  validateOTP(context: any): Observable<any> {
    const url = environment.host + '/api/person/otps/validate/';

    return this._httpClient.post<any>(url, context, {withCredentials: true})
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
