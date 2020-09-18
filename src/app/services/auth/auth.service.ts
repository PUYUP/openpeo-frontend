import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, retry, finalize, catchError } from 'rxjs/operators';

import { environment } from '../../../environments/environment';
import { CookieService } from 'ngx-cookie-service';
import { AlertController } from '@ionic/angular';

const _credentialKey = 'credential';
const _tokenKey = 'token';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private host: string = environment.host;
  private debug: boolean = environment.debug;
  private storageCredential: any | null;
  private storageToken: string | null;

  constructor(
    public alertController: AlertController,
    private httpClient: HttpClient,
    private _cookieService: CookieService
  ) { 
    const savedCredential = localStorage.getItem(_credentialKey);
    if (savedCredential && (savedCredential != null || savedCredential !== 'undefined')) {
      this.storageCredential = JSON.parse(savedCredential);
    }

    const savedToken = localStorage.getItem(_tokenKey);
    if (savedToken && (savedToken != null || savedToken !== 'undefined')) {
      this.storageToken = JSON.parse(savedToken);
    }
  }

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
   * Register request
   */
  registration(context: any): Observable<any> {
    return this.httpClient.post<any>(this.host + '/api/person/users/', context, {withCredentials: true})
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
   * Login request
   */
  login(context: any): Observable<any> {
    return this.httpClient.post<any>(this.host + '/api/person/token/', context, {withCredentials: true})
      .pipe(
        retry(3),
        map((response: any) => {
          this.setCredential(response);
          this.setToken({
            'refresh': response.refresh,
            'access': response.access
          });

          return response;
        }),
        catchError(
          (e: HttpErrorResponse) => this._handleError(e)
        )
      )
  }

  /**
   * Logs out the user and clear credentials.
   * @return True if the user was logged out successfull
   */
  logout(): Observable<any> {
    let obj = this.getCredential();
    let url = this.host + '/api/person/users/' + obj.uuid + '/logout/';
    
    return this.httpClient.post(url, { withCredentials: true })
      .pipe(
        retry(3),
        map((response: any) => {
          return {};
        }),
        finalize(() => {
          // Customize credentials invalidation here
          this.setCredential(null);
          this.setToken(false);
          this.storageCredential = null;
        }),
        catchError(
          (e: HttpErrorResponse) => this._handleError(e)
        )
      );
  }

  /**
   * Sets the user credentials.
   * Otherwise, the credentials are only persisted for the current session.
   */
  public setCredential(credential?: any) {
    this.storageCredential = credential || null;

    if (credential) {
      localStorage.setItem(_credentialKey, JSON.stringify(credential));
    } else {
      localStorage.removeItem(_credentialKey);
    }
  }

  /**
   * Get user credential
   */
  getCredential(): any {
    const savedCredential = localStorage.getItem(_credentialKey);
    if (savedCredential && (savedCredential != null || savedCredential !== 'undefined')) {
      return JSON.parse(savedCredential);
    } else {
      return null;
    }
  }

  /**
   * Set user token
   */
  public setToken(token: any) {
    this.storageToken = token || null;

    if (token) {
      localStorage.setItem(_tokenKey, JSON.stringify(token));
    } else {
      localStorage.removeItem(_tokenKey);
    }
  }

  /**
   * Get user token
   */
  getToken(): any {
    const savedToken = localStorage.getItem(_tokenKey);
    if (savedToken && (savedToken != null || savedToken !== 'undefined')) {
      return JSON.parse(savedToken);
    } else {
      return null;
    }
  }

  /**
   * Checks is the user is authenticated.
   * @return True if the user is authenticated.
   */
  isAuthenticated(): boolean {
    return !!this.credential;
  }

  /**
   * Gets the user credentials.
   * @return The user credentials or null if the user is not authenticated.
   */
  get credential(): any | null {
    return this.storageCredential;
  }

  /**
   * Check email available
   */
  checkEmail(context: any): Observable<any> {
    const url = this.host + '/api/person/users/check-email-available/';

    return this.httpClient.post(url, context, {withCredentials: true})
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
   * Check MSISDN available
   */
  checkMSISDN(context: any): Observable<any> {
    const url = this.host + '/api/person/users/check-msisdn-available/';

    return this.httpClient.post(url, context, {withCredentials: true})
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
   * Check Account available
   */
  checkAccount(context: any): Observable<any> {
    const url = this.host + '/api/person/users/check-account/';

    return this.httpClient.post(url, context, {withCredentials: true})
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
   * Password recovery as guest
   */
  passwordRecovery(context: any): Observable<any> {
    const url = this.host + '/api/person/users/password-recovery/';

    return this.httpClient.post<any>(url, context, {withCredentials: true})
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

  /***
   * Get user
   */
  getUser(): Observable<any> {
    const url = this.host + '/api/person/users/' + this.credential.uuid + '/';

    return this.httpClient.get<any>(url, {withCredentials: true})
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

  /***
   * Update user
   */
  updateUser(context: any): Observable<any> {
    const url = this.host + '/api/person/users/' + this.credential.uuid + '/';

    return this.httpClient.patch<any>(url, context, {withCredentials: true})
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

  /***
   * Update account
   */
  updateAccount(context: any): Observable<any> {
    const url = this.host + '/api/person/users/' + this.credential.uuid + '/account/';

    return this.httpClient.patch<any>(url, context, {withCredentials: true})
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

  /***
   * Update profile
   */
  updateProfile(context: any): Observable<any> {
    const url = this.host + '/api/person/users/' + this.credential.uuid + '/profile/';

    let data: any = null;

    // Update has picture
    if (context.picture) {
      let body = new FormData();
      for (let k in context) {
        body.append(k, context[k]);
      }

      data = body;
    } else {
      data = context;
    }

    return this.httpClient.patch<any>(url, data, {withCredentials: true})
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
