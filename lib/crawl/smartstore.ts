import {
  OptionResult,
  SmartstoreStockData,
  SmartstoreStockRecord,
} from '../../types';

// optionPriceVariant는 cover하지 못 한다.
export const getSmartstoreOptionData = (html: string): OptionResult => {
  const values = {};
  const isSoldOut = [];
  const productPriceVariants = [];

  const optionNames = getOptionNames(html);
  optionNames.forEach((optionName) => {
    values[optionName] = [];
  });

  const stockData = getStockData(html);
  stockData.forEach((stockRecord) => {
    optionNames.forEach((_, i) => {
      const option = stockRecord['optionName' + (i + 1)];
      if (!values[optionNames[i]].includes(option))
        values[optionNames[i]].push(option);
    });

    const coordinate = getOptionCoordinate(optionNames, stockRecord, values);

    if (stockRecord.stockQuantity === 0) {
      isSoldOut.push(coordinate);
    }
    if (stockRecord.price !== 0) {
      productPriceVariants.push({
        option: coordinate,
        price: stockRecord.price,
      });
    }
  });

  return {
    values,
    isSoldOut,
    optionPriceVariants: [],
    productPriceVariants,
  };
};

const getOptionNames = (html: string): string[] => {
  const SEARCH_TEXT = '"aCombinationGroupName" : ';
  if (html.indexOf(SEARCH_TEXT) < 0) {
    throw new Error();
  }

  const start = html.indexOf(SEARCH_TEXT) + SEARCH_TEXT.length;
  const end = html.indexOf(']', start) + 1;
  return JSON.parse(html.slice(start, end));
};

const getStockData = (html: string): SmartstoreStockData => {
  const SEARCH_TEXT = '"aCombinationOption" : ';
  if (html.indexOf(SEARCH_TEXT) < 0) {
    throw new Error();
  }

  const start = html.indexOf(SEARCH_TEXT) + SEARCH_TEXT.length;
  const end = html.indexOf('],', start) + 1;
  return JSON.parse(html.slice(start, end));
};

const getOptionCoordinate = (
  optionNames: string[],
  stockRecord: SmartstoreStockRecord,
  values: any
): number[] => {
  const co = [];
  optionNames.forEach((optionName, i) => {
    const option = stockRecord['optionName' + (i + 1)];
    co.push(values[optionName].indexOf(option));
  });
  return co;
};
