import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { imports } from 'src/test';
import { ManagePlayerCardComponent } from './manage-player-card.component';

describe('ManagePlayerCardComponent', () => {
  let component: ManagePlayerCardComponent;
  let fixture: ComponentFixture<ManagePlayerCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ManagePlayerCardComponent],
      imports,
    }).compileComponents();

    fixture = TestBed.createComponent(ManagePlayerCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
