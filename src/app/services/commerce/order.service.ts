import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { retry, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  host: string = environment.host;
  url: string = this.host + '/api/commerce/orders/';
  urlCart: string = this.host + '/api/commerce/carts/';
  urlSell: string = this.host + '/api/commerce/sells/';

  constructor(
    private _httpClient: HttpClient
  ) { }

  bulkCreate(context: any): Observable<any> {
    return this._httpClient.post(this.url + 'bulks/', context, {withCredentials: true})
      .pipe(
        retry(3),
        map((response: any) => {
          return response;
        })
      )
  }

  create(context: any): Observable<any> {
    return this._httpClient.post(this.url, context, {withCredentials: true})
      .pipe(
        retry(3),
        map((response: any) => {
          return response;
        })
      )
  }

  list(): Observable<any> {
    return this._httpClient.get(this.url, {withCredentials: true})
      .pipe(
        retry(3),
        map((response: any) => {
          return response;
        })
      )
  }

  single(orderUUID: string): Observable<any> {
    return this._httpClient.get(this.url + orderUUID + '/', {withCredentials: true})
      .pipe(
        retry(3),
        map((response: any) => {
          return response;
        })
      )
  }

  removeItem(cartUUID: string, itemUUID: string): Observable<any> {
    return this._httpClient.delete(this.urlCart + cartUUID + '/items/' + itemUUID + '/', {withCredentials: true})
      .pipe(
        retry(3),
        map((response: any) => {
          return response;
        })
      )
  }

  updateItem(cartUUID: string, itemUUID: string, context: any): Observable<any> {
    return this._httpClient.patch(this.urlCart + cartUUID + '/items/' + itemUUID + '/', context, {withCredentials: true})
      .pipe(
        retry(3),
        map((response: any) => {
          return response;
        })
      )
  }

  sell(): Observable<any> {
    return this._httpClient.get(this.urlSell, {withCredentials: true})
      .pipe(
        retry(3),
        map((response: any) => {
          return response;
        })
      )
  }

  sellDetail(productUUID: string): Observable<any> {
    return this._httpClient.get(this.urlSell + productUUID + '/', {withCredentials: true})
      .pipe(
        retry(3),
        map((response: any) => {
          return response;
        })
      )
  }

}
