export type evaluateResponse = {
  type: evaluateData;
  data: stockData | optionDefaultData | boolean;
};

export type evaluateData = 'stock' | 'optionDefault';

export type stockData = {
  [name: string]: {
    option_value_orginal: string[];
    stock_number: number;
    is_auto_soldout: 'T' | 'F';
    is_selling: 'T' | 'F';
    stock_price: string;
    option_value_original: string[];
    option_name: string;
  };
};

export type optionDefaultData = {
  [name: string]: string;
};

export type OptionResult = {
  values: { [name: string]: string[] };
  isSoldOut: number[][];
  itemIsSoldOut?: boolean;
  optionPriceVariants: priceVariant[];
  productPriceVariants: priceVariant[];
};

export type priceVariant = {
  option: number[];
  price: number;
};
