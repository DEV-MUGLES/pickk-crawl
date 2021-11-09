export type InfoResult = {
  name: string;
  brandKor: string;
  imageUrl: string;
  originalPrice: number;
  salePrice: number;
  images?: string[];
  isSoldout?: boolean;
  priceUnit?: ItemPriceUnit;
};

export interface InfoSelectors {
  name: string;
  brandKor: string;
  imageUrl: string;
  originalPrice: string;
  salePrice: string;
  images?: string;
  isSoldout?: string;
  priceUnit?: ItemPriceUnit;
}

export enum ItemPriceUnit {
  KRW = 'KRW',
  USD = 'USD',
  JPY = 'JPY',
  CNY = 'CNY',
  EUR = 'EUR',
  GBP = 'GBP',
  AUD = 'AUD',
  CAD = 'CAD',
}
