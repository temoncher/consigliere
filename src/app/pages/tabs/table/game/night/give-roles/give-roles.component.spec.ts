import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { imports } from 'src/test';
import { GiveRolesComponent } from './give-roles.component';

describe('GiveRolesComponent', () => {
  let component: GiveRolesComponent;
  let fixture: ComponentFixture<GiveRolesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [GiveRolesComponent],
      imports,
    }).compileComponents();

    fixture = TestBed.createComponent(GiveRolesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
