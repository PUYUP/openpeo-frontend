import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, retry } from 'rxjs/operators';

import { environment } from '../../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class OtpService {

  constructor(
    private _httpClient: HttpClient
  ) { }

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
        })
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
        })
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
        })
      )
  }

}
