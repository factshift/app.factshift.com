export function createArraySlice(initialData = []) {
  const data = Array.from(initialData);
  return {
    get: () => data,
    set(newData = []) {
      data.length = 0;
      data.push(...newData);
    },
    push(...items) {
      data.push(...items);
    },
    clear() {
      data.length = 0;
    },
    *stream() {
      for (const item of data) {
        yield item;
      }
    },
    [Symbol.iterator]: function* () {
      yield* data;
    }
  };
}

const aggregatorMap = { array: createArraySlice };

export function getAggregator(name = 'array') {
  return aggregatorMap[name] || createArraySlice;
}

export function createDataSlice(initialData = [], aggregator = 'array') {
  const create = typeof aggregator === 'string' ? getAggregator(aggregator) : aggregator;
  return create(initialData);
}
