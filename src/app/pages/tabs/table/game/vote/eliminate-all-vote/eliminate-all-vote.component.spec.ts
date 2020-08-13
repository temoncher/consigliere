import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { imports } from 'src/test';
import { EliminateAllVoteComponent } from './eliminate-all-vote.component';

describe('EliminateAllVoteComponent', () => {
  let component: EliminateAllVoteComponent;
  let fixture: ComponentFixture<EliminateAllVoteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [EliminateAllVoteComponent],
      imports,
    }).compileComponents();

    fixture = TestBed.createComponent(EliminateAllVoteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
