import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SettingAddressComponent } from './setting-address.component';

describe('SettingAddressComponent', () => {
  let component: SettingAddressComponent;
  let fixture: ComponentFixture<SettingAddressComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SettingAddressComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(SettingAddressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
