import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { DonComponent } from './don.component';

describe('DonComponent', () => {
  let component: DonComponent;
  let fixture: ComponentFixture<DonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DonComponent],
      imports: [IonicModule.forRoot()],
    }).compileComponents();

    fixture = TestBed.createComponent(DonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
