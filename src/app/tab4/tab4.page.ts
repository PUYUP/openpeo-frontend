import { Component, OnInit, ViewChild } from '@angular/core';
import { ChatService } from '../services/commerce/chat.service';
import { finalize } from 'rxjs/operators';
import { IonInfiniteScroll } from '@ionic/angular';

@Component({
  selector: 'app-tab4',
  templateUrl: 'tab4.page.html',
  styleUrls: ['tab4.page.scss']
})
export class Tab4Page implements OnInit {

  @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;
  
  chats: any = [];
  isLoading: boolean = false;
  next: string = null;

  constructor(
    private _chatService: ChatService
  ) {}

  ngOnInit() {
    this.loadChats();
  }

  loadChats(isLoadMore: boolean = false, event: any = ''): void {
    if (!isLoadMore) this.isLoading = true;
    let next = this.next;

    this._chatService.list({'next': next})
      .pipe(
        finalize(() => {
          this.isLoading = false;
          if (isLoadMore) event.target.complete();
        })
      )
      .subscribe(
        (response: any) => {
          if (isLoadMore) {
            this.chats = this.chats.concat(response?.results)
          } else {
            this.chats = response?.results;
          }

          this.next = response.navigate?.next;
          if (event && !this.next) event.target.disabled = true;
        }
      )
  }

  loadData(event: any) {
    this.loadChats(true, event);
  }

}
