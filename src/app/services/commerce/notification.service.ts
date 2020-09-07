import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { retry, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  host: string = environment.host;
  url: string = this.host + '/api/commerce/notifications/';

  constructor(
    private _httpClient: HttpClient
  ) { }

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
