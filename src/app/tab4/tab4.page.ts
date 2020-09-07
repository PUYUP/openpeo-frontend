import { Component, OnInit } from '@angular/core';
import { ChatService } from '../services/commerce/chat.service';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-tab4',
  templateUrl: 'tab4.page.html',
  styleUrls: ['tab4.page.scss']
})
export class Tab4Page implements OnInit {

  chats: any = [];
  isLoading: boolean = false;

  constructor(
    private _chatService: ChatService
  ) {}

  ngOnInit() {
    this.loadChats();
  }

  loadChats(): void {
    this._chatService.list()
      .pipe(
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe(
        (response: any) => {
          this.chats = response;
        },
        (failure: any) => {

        }
      )
  }

}
