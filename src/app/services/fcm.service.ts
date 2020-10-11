import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AngularFireMessaging } from '@angular/fire/messaging';
import { Observable } from 'rxjs';
import { map, retry } from 'rxjs/operators';
import { AuthService } from './auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class FcmService {
  
  constructor(
    private httpClient: HttpClient,
    private authService: AuthService,
    private angularFireMessaging: AngularFireMessaging) {
      /*
      this.angularFireMessaging.messaging.subscribe(
        (_messaging) => {
          _messaging.onMessage = _messaging.onMessage.bind(_messaging);
          _messaging.getToken = _messaging.getToken.bind(_messaging);
        }
      );
      */
  }

  setFcmToken(token: string) {
    this.authService.updateAccount({fcm_token: token})
      .subscribe((response: any) => {

      });
  }

  /**
   * request permission for notification from firebase cloud messaging
   * 
   * @param userId userId
   */
  requestPermission(): Observable<any> {
    /*
    this.angularFireMessaging.requestToken.subscribe(
      (token) => {
        this.setFcmToken(token);
      },
      (err) => {
        console.error('Unable to get permission to notify.', err);
      }
    );
    */

    return this.angularFireMessaging.requestToken
      .pipe(
        retry(3),
        map((response: any) => {
          return response;
        })
      )
  }

  /**
   * hook method when new notification received in foreground
   */
  receiveMessage() {
    this.angularFireMessaging.messages.subscribe(
      (payload: any) => {
        alert("new message received. " + payload?.title );
      })
  }

  /**
   * Send message user to user
   */
  sendMessage(targetToken: string) {
    var data = {
      "notification": {
        "title": "Notifikasi Open Pe O", 
        "body": "Ada orderan baru!",
        "icon": "https://i2.wp.com/devdactic.com/wp-content/uploads/2020/07/practical-ionic-book.png",
        "click_action":"https://openpeo.com/tabs/tab2"
      },
      "data": {
          "info": "Pemberitahuan untuk Anda bukan Open Pe O"
      },
      "to": targetToken
    }
                             
    const headers = new HttpHeaders()
      .set('Authorization', 'key=AAAAUASTcW0:APA91bHQXIbndckM3Pn8wC2xgAf-nPlSRQH8WCCC9VNkzUKxgdgiJ-vZ1lSL75X5HvsGEL5lCkRGfS6yQ8A3mrKd5RiLfAwC1HFpBIotUzDXSdweUHvA8Gwkqrt7CaJGf8wVBqqbSLxS')
      .set('Content-Type', 'application/json');

    this.httpClient.post('https://fcm.googleapis.com/fcm/send', data, {withCredentials: true, headers: headers})
      .pipe(
        retry(3),
        map(
          (response: any) => {
            console.log(response);
          },
          (error: any) => {
            console.log(error);
          }
        )
      )
  }

}
