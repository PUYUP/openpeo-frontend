import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { retry, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  host: string = environment.host;
  url: string = this.host + '/api/commerce/products/';

  constructor(
    private httpClient: HttpClient
  ) { }

  create(context: any): Observable<any> {
    return this.httpClient.post(this.url, context, {withCredentials: true})
      .pipe(
        retry(3),
        map((response: any) => {
          return response;
        })
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
        })
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
        })
      )
  }

  list(userUUID: string = ''): Observable<any> {
    // product related to user
    let url = this.url;

    if (userUUID) {
      url = this.url + '?user_uuid=' + userUUID;
    }

    return this.httpClient.get(url, {withCredentials: true})
      .pipe(
        retry(3),
        map((response: any) => {
          return response;
        })
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
        })
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
        })
      )
  }

}
