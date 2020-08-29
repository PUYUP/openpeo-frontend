import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { retry, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SettingService {

  host: string = environment.host;
  urlBank: string = this.host + '/api/commerce/banks/';
  urlPayment: string = this.host + '/api/commerce/payment-banks/';
  urlAddress: string = this.host + '/api/commerce/address/';

  constructor(
    private _httpClient: HttpClient
  ) { }

  paymentCreate(context: any): Observable<any> {
    return this._httpClient.post(this.urlPayment, context, {withCredentials: true})
      .pipe(
        retry(3),
        map((response: any) => {
          return response;
        })
      )
  }

  paymentUpdate(context: any, paymentUUID: string): Observable<any> {
    return this._httpClient.patch(this.urlPayment + paymentUUID + '/', context, {withCredentials: true})
      .pipe(
        retry(3),
        map((response: any) => {
          return response;
        })
      )
  }

  paymentDelete(paymentUUID: string): Observable<any> {
    return this._httpClient.delete(this.urlPayment + paymentUUID + '/', {withCredentials: true})
      .pipe(
        retry(3),
        map((response: any) => {
          return response;
        })
      )
  }

  paymentList(): Observable<any> {
    return this._httpClient.get(this.urlPayment, {withCredentials: true})
      .pipe(
        retry(3),
        map((response: any) => {
          return response;
        })
      )
  }

  paymentSingle(paymentUUID: string): Observable<any> {
    return this._httpClient.get(this.urlPayment + paymentUUID + '/', {withCredentials: true})
      .pipe(
        retry(3),
        map((response: any) => {
          return response;
        })
      )
  }

  bankList(): Observable<any> {
    return this._httpClient.get(this.urlBank, {withCredentials: true})
      .pipe(
        retry(3),
        map((response: any) => {
          return response;
        })
      )
  }


  addressCreate(context: any): Observable<any> {
    return this._httpClient.post(this.urlAddress, context, {withCredentials: true})
      .pipe(
        retry(3),
        map((response: any) => {
          return response;
        })
      )
  }

  addressUpdate(context: any, addressUUID: string): Observable<any> {
    return this._httpClient.patch(this.urlAddress + addressUUID + '/', context, {withCredentials: true})
      .pipe(
        retry(3),
        map((response: any) => {
          return response;
        })
      )
  }

  addressDelete(addressUUID: string): Observable<any> {
    return this._httpClient.delete(this.urlAddress + addressUUID + '/', {withCredentials: true})
      .pipe(
        retry(3),
        map((response: any) => {
          return response;
        })
      )
  }

  addressList(): Observable<any> {
    return this._httpClient.get(this.urlAddress, {withCredentials: true})
      .pipe(
        retry(3),
        map((response: any) => {
          return response;
        })
      )
  }

  addressSingle(addressUUID: string): Observable<any> {
    return this._httpClient.get(this.urlAddress + addressUUID + '/', {withCredentials: true})
      .pipe(
        retry(3),
        map((response: any) => {
          return response;
        })
      )
  }

}
