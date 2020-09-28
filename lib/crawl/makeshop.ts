import { OptionResult, MakeshopStockData } from '../../types';

// optionPriceVariant는 cover하지 못 한다.
export const getMakeshopOptionData = (
  html: string
): { optionNames: string[]; result: OptionResult } => {
  const values = {};
  const isSoldout = [];
  const productPriceVariants = [];

  const stockData = getStockData(html);
  const optionNames = getOptionNames(stockData);
  optionNames.forEach((optionName) => {
    values[optionName] = [];
  });

  stockData.forEach((stockRecord, index) => {
    values[optionNames[0]].push(
      stockRecord.opt_values || stockRecord.opt_value
    );

    if (Number(stockRecord.sto_real_stock) === 0) {
      isSoldout.push([index]);
    }
    if (
      Number(stockRecord.sto_price) !== 0 &&
      stockRecord.sto_price !== undefined
    ) {
      productPriceVariants.push({
        option: [index],
        price: Number(stockRecord.sto_price),
      });
    }
  });

  return {
    optionNames,
    result: {
      values,
      isSoldout,
      optionPriceVariants: [],
      productPriceVariants,
    },
  };
};

const getStockData = (html: string): MakeshopStockData => {
  const SEARCH_TEXT = 'var optionJsonData = ';
  if (html.indexOf(SEARCH_TEXT) < 0) {
    throw new Error();
  }

  const start = html.indexOf(SEARCH_TEXT) + SEARCH_TEXT.length;
  const end = html.indexOf(';', start);

  return Object.values(eval('(' + html.slice(start, end) + ')').basic[0]);
};

const getOptionNames = (stockData: MakeshopStockData): string[] => [
  stockData[0].opt_name,
];
