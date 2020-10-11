import { Store } from '@ngxs/store';

declare global {
  interface Window {
    Cypress?: unknown; // Other way it imports Chai as assertion library on every build
    store: Store;
  }
}
