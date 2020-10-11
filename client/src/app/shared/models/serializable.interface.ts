export interface ISerializable<T> {
  serialize: (exclude: (keyof T)[]) => T;
}
