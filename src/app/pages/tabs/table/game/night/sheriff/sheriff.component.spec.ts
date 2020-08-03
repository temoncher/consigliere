import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SheriffComponent } from './sheriff.component';
import { imports } from 'src/test';
import { NightModule } from '../night.module';

describe('SheriffComponent', () => {
  let component: SheriffComponent;
  let fixture: ComponentFixture<SheriffComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SheriffComponent],
      imports: [
        ...imports,
        NightModule,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SheriffComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
