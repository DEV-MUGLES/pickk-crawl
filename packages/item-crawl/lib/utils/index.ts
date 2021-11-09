export * from './Parser';

export const getAllPostCombination = (
  now: number[],
  remain: number[],
  result: number[][]
): void => {
  if (remain.length === 0) {
    result.push(now);
  }
  for (let i = 0; i < remain[0]; ++i) {
    getAllPostCombination([...now, i], remain.slice(1), result);
  }
};

export const getAllPreCombination = (
  now: number[],
  remain: number[],
  result: number[][]
): void => {
  if (remain.length === 0) {
    result.push(now);
  }
  const index = remain.length - 1;
  for (let i = 0; i < remain[index]; ++i) {
    getAllPostCombination([i, ...now], remain.slice(0, index), result);
  }
};

const isIterator = (obj) => {
  return !!obj && !!obj[Symbol.iterator];
};

export const allSettled = (iterable) => {
  if (!isIterator(iterable)) {
    throw new Error('[allSettled] first param must be iterable');
  }

  const onFulfill = (v) => ({ status: 'fulfilled', value: v });
  const onReject = (v) => ({ status: 'rejected', reason: v });

  return Promise.all(
    Array.from(iterable).map((p) =>
      Promise.resolve(p).then(onFulfill).catch(onReject)
    )
  );
};
