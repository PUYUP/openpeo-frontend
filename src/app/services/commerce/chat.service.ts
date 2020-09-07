import { Injectable } from '@angular/core';

import { environment } from '../../../environments/environment';
import { retry, map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class ChatService {

  host: string = environment.host;
  url: string = this.host + '/api/commerce/chats/';

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

  detail(chatUUID: string): Observable<any> {
    return this._httpClient.get(this.url + chatUUID + '/', {withCredentials: true})
      .pipe(
        retry(3),
        map((respose: any) => {
          return respose;
        })
      )
  }

  submitMessage(chatUUID: string, context: any): Observable<any> {
    return this._httpClient.post(this.url + chatUUID + '/messages/', context, {withCredentials: true})
      .pipe(
        retry(3),
        map((respose: any) => {
          return respose;
        })
      )
  }

  getMessages(chatUUID: string): Observable<any> {
    return this._httpClient.get(this.url + chatUUID + '/messages/', {withCredentials: true})
      .pipe(
        retry(3),
        map((respose: any) => {
          return respose;
        })
      )
  }

}
