export interface IApi<T> {
  create: (entity: T) => Promise<void>;
}
