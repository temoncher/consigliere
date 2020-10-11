import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ClubAdminComponent } from './club-admin.component';

describe('ClubAdminComponent', () => {
  let component: ClubAdminComponent;
  let fixture: ComponentFixture<ClubAdminComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ClubAdminComponent],
      imports: [IonicModule.forRoot()],
    }).compileComponents();

    fixture = TestBed.createComponent(ClubAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
