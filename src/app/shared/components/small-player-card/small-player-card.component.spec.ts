import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SmallPlayerCardComponent } from './small-player-card.component';
import { imports } from 'src/test';

describe('SmallPlayerCardComponent', () => {
  let component: SmallPlayerCardComponent;
  let fixture: ComponentFixture<SmallPlayerCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SmallPlayerCardComponent ],
      imports,
    }).compileComponents();

    fixture = TestBed.createComponent(SmallPlayerCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
