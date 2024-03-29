import { Component, OnInit, ViewChild } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { NavController, IonContent, IonInfiniteScroll } from '@ionic/angular';
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
  @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;
  
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
  file: any;
  next: string = null;

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
  submitMessage(file: any = ''): void {
    this.isSendLoading = true;

    if (file) this.formFactory.value = file.name;

    this._chatService.submitMessage(this.chatUUID, this.formFactory.value, file)
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
  loadMessages(isLoadMore: boolean = false, event: any = ''): void {
    if (!isLoadMore) this.isLoading = true;
    let next = this.next;

    this._chatService.getMessages({'chatUUID': this.chatUUID, 'next': next})
      .pipe(
        finalize(() => {
          this.isLoading = false;
          if (isLoadMore) event.target.complete();
        })
      )
      .subscribe(
        (response: any) => {
          if (isLoadMore) {
            this.messages = response?.results.reverse().concat(this.messages);
          } else {
            this.messages = response?.results.reverse();
            this.scrollToBottom();
          }

          this.next = response.navigate?.next;
          if (event && !this.next) event.target.disabled = true;
        },
        (failure: any) => {

        }
      )
  }

  loadData(event: any) {
    this.loadMessages(true, event);
  }

  startSocket() {
    let access = this.credential ? this.credential.access : '';

    // Support TLS-specific URLs, when appropriate.
    if (window.location.protocol == 'https:') {
      var ws_scheme = 'wss://';
    } else {
      var ws_scheme = 'ws://';
    };

    this.socket = new WebSocket(ws_scheme + environment.hostName + '/ws/chats/' + this.chatUUID + '/messages/?token=' + access);
  
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

  fileSelected(event: any): void {
    this.file = event.target.files[0];
    this.submitMessage(this.file);

    // reset value
    event.target.value = '';
  }

}
