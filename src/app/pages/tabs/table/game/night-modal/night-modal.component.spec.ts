import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { NightModalComponent } from './night-modal.component';

describe('NightModalComponent', () => {
  let component: NightModalComponent;
  let fixture: ComponentFixture<NightModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NightModalComponent ],
      imports: [IonicModule.forRoot()],
    }).compileComponents();

    fixture = TestBed.createComponent(NightModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
