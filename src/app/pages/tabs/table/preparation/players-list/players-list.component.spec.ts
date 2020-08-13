import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { imports } from 'src/test';
import { PlayersListComponent } from './players-list.component';

describe('PlayersListComponent', () => {
  let component: PlayersListComponent;
  let fixture: ComponentFixture<PlayersListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PlayersListComponent],
      imports,
    }).compileComponents();

    fixture = TestBed.createComponent(PlayersListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
