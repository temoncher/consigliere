import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DonComponent } from './don.component';
import { imports } from 'src/test';

describe('DonComponent', () => {
  let component: DonComponent;
  let fixture: ComponentFixture<DonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DonComponent],
      imports,
    }).compileComponents();

    fixture = TestBed.createComponent(DonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
