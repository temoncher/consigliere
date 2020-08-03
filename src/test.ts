// This file is required by karma.conf.js and loads recursively all the .spec and framework files

import 'zone.js/dist/zone-testing';
import { getTestBed } from '@angular/core/testing';
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting,
} from '@angular/platform-browser-dynamic/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { IonicModule } from '@ionic/angular';
import { IonicStorageModule } from '@ionic/storage';
import { NgxsModule } from '@ngxs/store';

import { SharedModule } from '@shared/shared.module';
import { LanguageModule } from '@shared/language.module';
import { ApplicationStates } from '@shared/store';

export const imports = [
  SharedModule,
  LanguageModule,
  RouterTestingModule,
  IonicModule.forRoot({ _testing: true }),
  IonicStorageModule.forRoot(),
  NgxsModule.forRoot(ApplicationStates),
];

declare const require: {
  context(path: string, deep?: boolean, filter?: RegExp): {
    keys(): string[];
    <T>(id: string): T;
  };
};

// First, initialize the Angular testing environment.
getTestBed().initTestEnvironment(
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting(),
);
// Then we find all the tests.
const context = require.context('./', true, /\.spec\.ts$/);
// And load the modules.
context.keys().map(context);
