import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { AuthService } from './auth.service';

/**
 * Checker is Guest
 */
@Injectable({
  providedIn: 'root'
})
export class AuthGuestGuard implements CanActivate {
  
  constructor(
    private _router: Router,
    private _authService: AuthService
  ) {}

  canActivate(): boolean {
    if (this._authService.isAuthenticated()) {
      this._router.navigate(['/tabs/tab1'], {replaceUrl: true});
      return false;
    }

    return true;
  }
  
}

/**
 * Checker is Logged In
 */
@Injectable({
  providedIn: 'root'
})
export class AuthLoggedInGuard implements CanActivate {
  
  constructor(
    private _router: Router,
    private _authService: AuthService
  ) {}

  canActivate(): boolean {
    if (!this._authService.isAuthenticated()) {
      this._router.navigate(['/login'], {replaceUrl: false});
      return false;
    }

    return true;
  }
  
}

/**
 * Checker boarding passed
 */
@Injectable({
  providedIn: 'root'
})
export class BoardingPassedGuard implements CanActivate {
  
  constructor(
    private _router: Router,
    private _cookieService: CookieService
  ) {}

  canActivate(): boolean {
    const checker = this._cookieService.get('boarding_passed');

    if (checker !== '1' ) {
      this._router.navigate(['/boarding'], {replaceUrl: true});
      return false;
    }

    return true;
  }
  
}

/**
 * Checker OTP validation passed
 */
@Injectable({
  providedIn: 'root'
})
export class OtpValidationPassedGuard implements CanActivate {
  
  constructor(
    private _router: Router,
    private _cookieService: CookieService
  ) {}

  canActivate(): boolean {
    const otp_checker = this._cookieService.get('otp_passed');
    const boarding_checker = this._cookieService.get('boarding_passed');

    if (otp_checker !== '1' || boarding_checker !== '1' ) {
      this._router.navigate(['/boarding'], {replaceUrl: true});
      return false;
    }

    return true;
  }
  
}

/**
 * Registration validation passed
 */
@Injectable({
  providedIn: 'root'
})
export class RegistrationPassedGuard implements CanActivate {
  
  constructor(
    private _router: Router,
    private _cookieService: CookieService
  ) {}

  canActivate(): boolean {
    const registration_passed = this._cookieService.get('registration_passed');

    if (registration_passed !== '1' ) {
      this._router.navigate(['/boarding'], {replaceUrl: true});
      return false;
    }

    return true;
  }
  
}

/**
 * Passwor recovery passed
 */
@Injectable({
  providedIn: 'root'
})
export class PasswordRecoveryPassedGuard implements CanActivate {
  
  constructor(
    private _router: Router,
    private _cookieService: CookieService
  ) {}

  canActivate(): boolean {
    const token = this._cookieService.get('password_recovery_token');
    const uidb64 = this._cookieService.get('password_recovery_uidb64');

    if (!token && !uidb64) {
      this._router.navigate(['/lost-password'], {replaceUrl: true});
      return false;
    }

    return true;
  }
  
}

/**
 * Checker is not current user
 */
@Injectable({
  providedIn: 'root'
})
export class NotCurrentUserGuard implements CanActivate {
  
  private _credential: any;
  public userUUID: string;

  constructor(
    private _router: Router,
    private _authService: AuthService
  ) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    this._credential = this._authService.getCredential();
    this.userUUID = route.paramMap.get('userUUID');

    if (this._authService.isAuthenticated() && this._credential.uuid == this.userUUID) {
      this._router.navigate(['/profile'], {replaceUrl: false});
      return false;
    }

    return true;
  }
  
}