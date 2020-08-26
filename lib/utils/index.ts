export * from './Parser';

export const getAllCombination = (
  now: number[],
  remain: number[],
  result: number[][]
): void => {
  if (remain.length === 0) {
    result.push(now);
  }
  for (let i = 0; i < remain[0]; ++i) {
    getAllCombination([...now, i], remain.slice(1), result);
  }
};
