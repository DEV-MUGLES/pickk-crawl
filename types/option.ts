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

export type SmartstoreStockRecord = {
  id: number;
  price: number;
  stockQuantity: number;
  regOrder: number;
  optionName1: string;
  optionName2: string;
  optionName3: string;
  optionName4: string;
  optionName5: string;
  todayDispatch: boolean;
};

export type SmartstoreStockData = SmartstoreStockRecord[];

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
