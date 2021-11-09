import { OptionResult, SmartstoreStockRecord } from '../../types';

// optionPriceVariant는 cover하지 못 한다.
export const getSmartstoreOptionData = (html: string): OptionResult => {
  const productData = getProductData(html);

  const values = {};
  const isSoldout = [];
  const productPriceVariants = [];

  const optionNames = productData.options.map((option) => option.groupName);
  optionNames.forEach((optionName) => {
    values[optionName] = [];
  });

  const stockData = productData.optionCombinations;
  stockData.forEach((stockRecord) => {
    optionNames.forEach((_, i) => {
      const option = stockRecord['optionName' + (i + 1)];
      if (!values[optionNames[i]].includes(option))
        values[optionNames[i]].push(option);
    });

    const coordinate = getOptionCoordinate(optionNames, stockRecord, values);

    if (stockRecord.stockQuantity === 0) {
      isSoldout.push(coordinate);
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
    isSoldout,
    optionPriceVariants: [],
    productPriceVariants,
  };
};

const getProductData = (html: string) => {
  const SEARCH_TEXT = '<script>window.__PRELOADED_STATE__=';
  if (html.indexOf(SEARCH_TEXT) < 0) {
    throw new Error();
  }

  const start = html.indexOf(SEARCH_TEXT) + SEARCH_TEXT.length;
  const end = html.indexOf('</script>', start);
  return JSON.parse(html.slice(start, end)).product.A;
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
