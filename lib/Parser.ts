export const strToNumber = (str: string): number => {
  return Number(
    str.slice(0, str.indexOf('.') + 1 || str.length).replace(/[^0-9]/g, '')
  );
};
