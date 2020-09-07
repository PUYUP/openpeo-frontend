import { Component, OnInit, ViewChild } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { NavController, IonContent } from '@ionic/angular';
import { FormBuilder, Validators } from '@angular/forms';
import { finalize } from 'rxjs/operators';

import { ChatService } from '../../../../services/commerce/chat.service';
import { environment } from '../../../../../environments/environment';
import { AuthService } from '../../../../services/auth/auth.service';

@Component({
  selector: 'app-chat-page',
  templateUrl: './chat-page.component.html',
  styleUrls: ['./chat-page.component.scss'],
})
export class ChatPageComponent implements OnInit {

  @ViewChild(IonContent, {read: IonContent, static: false}) myContent: IonContent;
  
  credential: any;
  formFactory: any = FormBuilder;
  chatUUID: string;
  userUUID: string;
  chat: any;
  messages: any = [];
  message: any;
  isLoading: boolean = false;
  isChatLoading: boolean = false;
  isSendLoading: boolean = false;
  socket: any;

  constructor(
    private _fb: FormBuilder,
    private _location: Location,
    private _chatService: ChatService,
    private _authService: AuthService,
    private _activatedRoute: ActivatedRoute,
    public navCtrl: NavController,
  ) { }

  ngOnInit() {
    this.credential = this._authService.getCredential();
    this.userUUID = this.credential?.uuid;
    this.chatUUID = this._activatedRoute.snapshot.paramMap.get('chat_uuid');

    this.loadChat();
    this.loadMessages();

    this.formFactory = this._fb.group({
      message: ['', [Validators.required, Validators.minLength(2)]],
    });

    // Start WebSocket
    this.startSocket();
  }

  back(): void {
    this.navCtrl.setDirection("back", true, "back");
    this._location.back();
  }

  getContent() {
    return document.querySelector('ion-content');
  }

  scrollToBottom() {
    setTimeout(() => {
      this.getContent().scrollToBottom(500);
    }, 1000);
  }

  // Submit
  onSubmit(): void {
    this.submitMessage();
  }

  // Create message
  submitMessage(): void {
    this.isSendLoading = true;

    this._chatService.submitMessage(this.chatUUID, this.formFactory.value)
      .pipe(
        finalize(() => {
          this.isSendLoading = false;
        })
      )
      .subscribe(
        (response: any) => {
          this.message = response;

          // Send to other user
          this.sendMessage(this.message);

          // Clear message form
          this.formFactory.reset();

          // To end page
          this.scrollToBottom();
        },
        (failure: any) => {

        }
      )

  }

  // Load chat object
  loadChat(): void {
    this.isChatLoading = true;

    this._chatService.detail(this.chatUUID)
      .pipe(
        finalize(() => {
          this.isChatLoading = false;
        })
      )
      .subscribe(
        (response: any) => {
          this.chat = response;
        },
        (failure: any) => {

        }
      )
  }

  // Load chat messages
  loadMessages(): void {
    this.isLoading = true;

    this._chatService.getMessages(this.chatUUID)
      .pipe(
        finalize(() => {
          this.isLoading = false;
          this.scrollToBottom();
        })
      )
      .subscribe(
        (response: any) => {
          this.messages = response;
          this.scrollToBottom();
        },
        (failure: any) => {

        }
      )
  }

  startSocket() {
    let access = this.credential ? this.credential.access : '';
    let ws = (location.protocol === 'https:' ? 'wss' : 'ws');

    this.socket = new WebSocket(ws + '://' + environment.hostName + '/ws/chats/' + this.chatUUID + '/messages/?token=' + access);
  
    this.socket.onopen = () => {
      console.log('WebSockets connection created.');
    };

    this.socket.onclose = (event: any) => {
      console.error('Chat socket closed unexpectedly');
    };

    this.socket.onmessage = (event: any) => {
      let message = JSON.parse(event.data)?.message;
      
      // check creator or not
      if (message.user_uuid == this.userUUID) {
        message.is_creator = true;
      } else {
        message.is_creator = false;
      }

      // send back to list
      this.messages.push(message);
    };

    if (this.socket.readyState == WebSocket.OPEN) {
      this.socket.onopen(null);
    }
  }

  sendMessage(message: string): void {
    this.socket.send(JSON.stringify({
      'message': message,
      'userUUID': this._authService.getCredential().user_uuid,
    }));
  }

}
