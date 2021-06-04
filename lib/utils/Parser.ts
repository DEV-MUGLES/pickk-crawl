import { ItemPriceUnit } from '../../types';

export const strToNumber = (str: string): number => {
  return Number(
    str?.slice(0, str.indexOf('.') + 1 || str.length).replace(/[^0-9]/g, '')
  );
};

export const cleanUpString = (str: string): string => {
  return str.replace(/\n|\[품절\]|\(품절\)/gi, '').trim();
};

const { KRW, USD, EUR, JPY } = ItemPriceUnit;

export const strToPriceUnit = (str: string): ItemPriceUnit => {
  if (str in ItemPriceUnit) {
    return str as ItemPriceUnit;
  }
  const symbol = str.replace(/[^(원|₩|$|€|円|¥|￥)]/g, '');
  return symbolToPriceUnit[symbol] || KRW;
};

export const symbolToPriceUnit = {
  ...ItemPriceUnit,
  원: KRW,
  '₩': KRW,
  $: USD,
  '€': EUR,
  円: JPY,
  '¥': JPY,
  '￥': JPY,
};
