import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { ExploreContainerComponentModule } from '@shared/components/explore-container/explore-container.module';

import { TablePage } from './table.page';

describe('TablePage', () => {
  let component: TablePage;
  let fixture: ComponentFixture<TablePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TablePage],
      imports: [IonicModule.forRoot(), ExploreContainerComponentModule]
    }).compileComponents();

    fixture = TestBed.createComponent(TablePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
