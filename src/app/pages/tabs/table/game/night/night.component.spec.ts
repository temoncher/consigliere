import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NightComponent } from './night.component';
import { imports } from 'src/test';
import { NightModule } from './night.module';

describe('NightModalComponent', () => {
  let component: NightComponent;
  let fixture: ComponentFixture<NightComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [NightComponent],
      imports: [
        ...imports,
        NightModule,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(NightComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
