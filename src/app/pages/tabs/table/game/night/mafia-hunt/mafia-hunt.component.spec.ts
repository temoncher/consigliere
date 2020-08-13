import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { imports } from 'src/test';
import { MafiaHuntComponent } from './mafia-hunt.component';

describe('MafiaHuntComponent', () => {
  let component: MafiaHuntComponent;
  let fixture: ComponentFixture<MafiaHuntComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MafiaHuntComponent],
      imports,
    }).compileComponents();

    fixture = TestBed.createComponent(MafiaHuntComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
