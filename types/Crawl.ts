export type CrawlResult = {
  name: string;
  brandKor: string;
  imageUrl: string;
  originalPrice: number;
  salePrice: number;
  images?: string[];
  isSoldout?: boolean;
};
