import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SheriffComponent } from './sheriff.component';

describe('SheriffComponent', () => {
  let component: SheriffComponent;
  let fixture: ComponentFixture<SheriffComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SheriffComponent],
      imports: [IonicModule.forRoot()],
    }).compileComponents();

    fixture = TestBed.createComponent(SheriffComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
