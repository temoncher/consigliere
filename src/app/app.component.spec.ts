import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { TestBed, async } from '@angular/core/testing';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { imports } from 'src/test';
import { AppComponent } from './app.component';

class MockBackButton {
  constructor(public subscribeWithPriority: jasmine.Spy<any>) {}
}

class MockPlatform {
  constructor(
    public ready: jasmine.Spy<any>,
    public backButton: any,
  ) {}
}

describe('AppComponent', () => {
  let mockBackButton: MockBackButton;
  let mockPlatform: MockPlatform;
  let statusBarSpy;
  let splashScreenSpy;
  let platformReadySpy;

  beforeEach(async(() => {
    statusBarSpy = jasmine.createSpyObj('StatusBar', ['styleDefault']);
    splashScreenSpy = jasmine.createSpyObj('SplashScreen', ['hide']);
    platformReadySpy = jasmine.createSpy().and.returnValue(Promise.resolve());
    mockBackButton = new MockBackButton(jasmine.createSpy('subscribeWithPriority', (priority, fn) => {}));
    mockPlatform = new MockPlatform(platformReadySpy, mockBackButton);

    TestBed.configureTestingModule({
      imports,
      declarations: [AppComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        { provide: StatusBar, useValue: statusBarSpy },
        { provide: SplashScreen, useValue: splashScreenSpy },
        { provide: Platform, useValue: mockPlatform },
      ],
    }).compileComponents();
  }));

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;

    expect(app).toBeTruthy();
  });

  it('should initialize the app', async () => {
    TestBed.createComponent(AppComponent);

    expect(mockPlatform.ready).toHaveBeenCalled();
    await platformReadySpy;

    expect(statusBarSpy.styleDefault).toHaveBeenCalled();
    expect(splashScreenSpy.hide).toHaveBeenCalled();
  });
});
