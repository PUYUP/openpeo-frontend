import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';
import { AuthService } from './auth/auth.service';

@Injectable()
export class HTTPInterceptor implements HttpInterceptor {

    constructor(
        private _cookieService: CookieService,
        private _authService: AuthService
    ) {}

    intercept(request: HttpRequest<any>, next: HttpHandler):Observable<HttpEvent<any>> {
        let credential = this._authService.getCredential();
        let access = credential ? credential.access : '';

        if (credential && access) {
            request = request.clone({
                setHeaders: { 
                    'Authorization': `Bearer ${access}`,
                    'X-CSRFTOKEN': this._cookieService.get('csrftoken'),
                }
            });
        }

        request = request.clone({
            withCredentials: true
        });

        return next.handle(request);
    }

}
