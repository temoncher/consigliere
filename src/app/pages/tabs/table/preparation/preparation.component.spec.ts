import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PreparationComponent } from './preparation.component';
import { imports } from 'src/test';
import { PreparationModule } from './preparation.module';

describe('PreparationComponent', () => {
  let component: PreparationComponent;
  let fixture: ComponentFixture<PreparationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PreparationComponent ],
      imports: [
        ...imports,
        PreparationModule,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PreparationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
