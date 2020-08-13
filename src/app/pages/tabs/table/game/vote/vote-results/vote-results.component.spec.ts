import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { imports } from 'src/test';
import { VoteResultsComponent } from './vote-results.component';

describe('VoteResultsComponent', () => {
  let component: VoteResultsComponent;
  let fixture: ComponentFixture<VoteResultsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [VoteResultsComponent],
      imports,
    }).compileComponents();

    fixture = TestBed.createComponent(VoteResultsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
