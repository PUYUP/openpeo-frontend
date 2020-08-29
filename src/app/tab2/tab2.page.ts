import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {

  segmentTarget: string = 'order';

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
    this._location.replaceState('tabs/tab2/' + this.segmentTarget);
  }

}
