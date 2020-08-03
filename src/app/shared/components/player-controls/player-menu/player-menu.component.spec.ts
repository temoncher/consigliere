import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlayerMenuComponent } from './player-menu.component';
import { imports } from 'src/test';

describe('PlayerMenuComponent', () => {
  let component: PlayerMenuComponent;
  let fixture: ComponentFixture<PlayerMenuComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlayerMenuComponent ],
      imports,
    }).compileComponents();

    fixture = TestBed.createComponent(PlayerMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
