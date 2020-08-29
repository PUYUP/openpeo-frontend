import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { retry, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  host: string = environment.host;
  url: string = this.host + '/api/commerce/carts/';

  constructor(
    private _httpClient: HttpClient
  ) { }

  create(context: any): Observable<any> {
    return this._httpClient.post(this.url, context, {withCredentials: true})
      .pipe(
        retry(3),
        map((respose: any) => {
          return respose;
        })
      )
  }

  list(): Observable<any> {
    return this._httpClient.get(this.url, {withCredentials: true})
      .pipe(
        retry(3),
        map((respose: any) => {
          return respose;
        })
      )
  }

}
