import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SettingBankComponent } from './setting-bank.component';

describe('SettingBankComponent', () => {
  let component: SettingBankComponent;
  let fixture: ComponentFixture<SettingBankComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SettingBankComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(SettingBankComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
