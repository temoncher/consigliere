import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { ExploreContainerComponentModule } from '@shared/components/explore-container/explore-container.module';

import { ClubsPage } from './clubs.page';

describe('ClubsPage', () => {
  let component: ClubsPage;
  let fixture: ComponentFixture<ClubsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ClubsPage],
      imports: [IonicModule.forRoot(), ExploreContainerComponentModule]
    }).compileComponents();

    fixture = TestBed.createComponent(ClubsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
