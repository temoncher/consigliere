export interface Api<T> {
  create: (entity: T) => Promise<void>;
}
