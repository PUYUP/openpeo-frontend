import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, retry } from 'rxjs/operators';

import { environment } from '../../../environments/environment';
import { CookieService } from 'ngx-cookie-service';

const _credentialKey = 'credential';
const _tokenKey = 'token';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private host: string = environment.host;
  private storageCredential: any | null;
  private storageToken: string | null;

  constructor(
    private httpClient: HttpClient,
    private _cookieService: CookieService
  ) { 
    const savedCredential = this._cookieService.get(_credentialKey);
    if (savedCredential && (savedCredential != null || savedCredential !== 'undefined')) {
      this.storageCredential = JSON.parse(savedCredential);
    }

    const savedToken = this._cookieService.get(_tokenKey);
    if (savedToken && (savedToken != null || savedToken !== 'undefined')) {
      this.storageToken = JSON.parse(savedToken);
    }
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
        })
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
        })
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
          // Customize credentials invalidation here
          this.setCredential();
          this.setToken(false);
          
          return {};
        })
      );
  }

  /**
   * Sets the user credentials.
   * Otherwise, the credentials are only persisted for the current session.
   */
  public setCredential(credential?: any) {
    this.storageCredential = credential || null;

    if (credential) {
      this._cookieService.set(_credentialKey, JSON.stringify(credential));
    } else {
      this._cookieService.delete(_credentialKey);
    }
  }

  /**
   * Get user credential
   */
  getCredential(): any {
    const savedCredential = this._cookieService.get(_credentialKey);
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
      this._cookieService.set(_tokenKey, JSON.stringify(token));
    } else {
      this._cookieService.delete(_tokenKey);
    }
  }

  /**
   * Get user token
   */
  getToken(): any {
    const savedToken = this._cookieService.get(_tokenKey);
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
        })
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
        })
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
        })
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
        })
      )
  }

}
