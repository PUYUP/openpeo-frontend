import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SellingPageComponent } from './selling-page.component';

describe('SellingPageComponent', () => {
  let component: SellingPageComponent;
  let fixture: ComponentFixture<SellingPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SellingPageComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(SellingPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
