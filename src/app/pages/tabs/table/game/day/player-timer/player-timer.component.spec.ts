import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlayerTimerComponent } from './player-timer.component';
import { imports } from 'src/test';
import { DayModule } from '../day.module';

describe('PlayerTimerComponent', () => {
  let component: PlayerTimerComponent;
  let fixture: ComponentFixture<PlayerTimerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlayerTimerComponent ],
      imports: [
        ...imports,
        DayModule,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PlayerTimerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
