import { INestApplication } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import * as express from 'express';
import * as functions from 'firebase-functions';

import 'reflect-metadata';

import { AppModule } from './app.module';

console.log('Using emulators environment: ', process.env.FUNCTIONS_EMULATOR);
console.log('on host: ', process.env.FIRESTORE_EMULATOR_HOST);

const server: express.Express = express();

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const createNestServer = async (expressInstance: express.Express): Promise<INestApplication> => {
  const app = await NestFactory.create(AppModule, new ExpressAdapter(expressInstance));

  return app.init();
};

// eslint-disable-next-line @typescript-eslint/no-floating-promises
createNestServer(server);

export const api = functions.https.onRequest(server);
