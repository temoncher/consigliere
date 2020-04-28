import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { VoteStageComponent } from './vote-stage.component';

describe('VoteStageComponent', () => {
  let component: VoteStageComponent;
  let fixture: ComponentFixture<VoteStageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VoteStageComponent ],
      imports: [IonicModule.forRoot()],
    }).compileComponents();

    fixture = TestBed.createComponent(VoteStageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});