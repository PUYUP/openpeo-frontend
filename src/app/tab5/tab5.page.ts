import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth/auth.service';
import { finalize } from 'rxjs/operators';
import { Router } from '@angular/router';
import { EventService } from '../services/event.service';

@Component({
  selector: 'app-tab5',
  templateUrl: 'tab5.page.html',
  styleUrls: ['tab5.page.scss']
})
export class Tab5Page implements OnInit {

  username: string;
  credential: any;

  constructor(
    private _authService: AuthService,
    private _eventService: EventService,
    private _router: Router
  ) {}

  ngOnInit() {
    this.credential = this._authService.getCredential();

    this._eventService.subscribe('person:updateProfile', (data: any) => {
      this.credential = this._authService.getCredential();
    });
  }

  notificationSetupChange(event: any): void {
    console.log(event);
  }

  logout(): void {
    event.preventDefault();

    this._authService.logout()
      .pipe(
        finalize(() => {
        })
      )
      .subscribe(
        (response: any) => {
          this._router.navigate(['/splash'], {replaceUrl: true});
        },
        (failure: any) => {
          
        }
      )
  }

  ngOnDestroy() {
    this._eventService.destroy('person:updateProfile');
  }

}
