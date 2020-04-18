import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { PreparationModalComponent } from './preparation-modal.component';

describe('PreparationModalComponent', () => {
  let component: PreparationModalComponent;
  let fixture: ComponentFixture<PreparationModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PreparationModalComponent ],
      imports: [IonicModule.forRoot()],
    }).compileComponents();

    fixture = TestBed.createComponent(PreparationModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
