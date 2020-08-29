import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SplashPageComponent } from './splash-page.component';

describe('SplashPageComponent', () => {
  let component: SplashPageComponent;
  let fixture: ComponentFixture<SplashPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SplashPageComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(SplashPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
