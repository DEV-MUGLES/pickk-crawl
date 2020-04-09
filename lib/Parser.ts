export const strToNumber = (str: string): number => {
  return Number(str.replace(/[^0-9]/g, ''));
};
