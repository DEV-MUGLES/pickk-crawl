export const strToNumber = (str: string): number => {
  return Number(
    str.slice(0, str.indexOf('.') + 1 || str.length).replace(/[^0-9]/g, '')
  );
};

export const cleanUpString = (str: string): string => {
  return str.replace(/\n|\[품절\]|\(품절\)/gi, '').trim();
};
