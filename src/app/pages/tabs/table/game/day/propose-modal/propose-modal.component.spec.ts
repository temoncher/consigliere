import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProposeModalComponent } from './propose-modal.component';
import { imports } from 'src/test';

describe('ProposeModalComponent', () => {
  let component: ProposeModalComponent;
  let fixture: ComponentFixture<ProposeModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProposeModalComponent ],
      imports,
    }).compileComponents();

    fixture = TestBed.createComponent(ProposeModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
