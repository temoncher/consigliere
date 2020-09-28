export type ConvertedDeep<T> = {
  [K in keyof T]: T[K] extends Map<K, infer V> ? Record<K, V> : T[K];
};

export abstract class MapToRecordConverter {
  static deepConvert<T>(array: T[]): ConvertedDeep<T>[];
  static deepConvert<O extends object>(obj: O): ConvertedDeep<O>;
  static deepConvert<O extends object>(obj: O): ConvertedDeep<O> | ConvertedDeep<O>[] | O {
    if (obj instanceof Map) {
      return MapToRecordConverter.convert(obj);
    }

    if (obj instanceof Array) {
      const convertedArray = obj.map((element) => {
        if (element instanceof Object) {
          return MapToRecordConverter.deepConvert(element);
        }

        return element;
      });

      return convertedArray;
    }

    if (obj instanceof Object) {
      const initialAggregator: ConvertedDeep<O> = {} as ConvertedDeep<O>;
      /* eslint-disable no-param-reassign */
      const convertedObject = Object.entries(obj).reduce((aggregator, [key, value]) => {
        aggregator[key] = MapToRecordConverter.deepConvert(value);

        return aggregator;
      }, initialAggregator);
      /* eslint-enable */

      return convertedObject;
    }

    return obj;
  }

  static convert<K extends keyof any, V>(map: Map<K, V>): Record<K, V> {
    const aggregator: Record<K, V> = {} as Record<K, V>;

    map.forEach((value, key) => aggregator[key] = value);

    return aggregator;
  }
}
