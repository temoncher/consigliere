import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TableTemplateComponent } from './table-template.component';
import { imports } from 'src/test';

describe('TableTemplateComponent', () => {
  let component: TableTemplateComponent;
  let fixture: ComponentFixture<TableTemplateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TableTemplateComponent ],
      imports,
    }).compileComponents();

    fixture = TestBed.createComponent(TableTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
