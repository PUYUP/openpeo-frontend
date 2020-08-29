import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page implements OnInit {

  public segmentTarget: string = 'buy';

  constructor(
    private _route: ActivatedRoute,
    private _location: Location
  ) {}

  ngOnInit(): void {
    const segment = this._route.snapshot.paramMap.get('segment');
    if (segment) this.segmentTarget = segment;
  }

  segmentChanged(event: any): void {
    this.segmentTarget = event.target.value;
    this._location.replaceState('tabs/tab1/' + this.segmentTarget);
  }

}
