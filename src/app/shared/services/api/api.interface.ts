export interface Api<T> {
  create: (entity: T) => void;
}
