import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdditionalSpeechComponent } from './additional-speech.component';
import { imports } from 'src/test';
import { VoteModule } from '../vote.module';

describe('AdditionalSpeechComponent', () => {
  let component: AdditionalSpeechComponent;
  let fixture: ComponentFixture<AdditionalSpeechComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdditionalSpeechComponent ],
      imports: [
        ...imports,
        VoteModule,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AdditionalSpeechComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
