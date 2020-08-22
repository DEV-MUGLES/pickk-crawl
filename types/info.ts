export type InfoResult = {
  name: string;
  brandKor: string;
  imageUrl: string;
  originalPrice: number;
  salePrice: number;
  images?: string[];
  isSoldout?: boolean;
};

export interface InfoSelectors {
  name: string;
  brandKor: string;
  imageUrl: string;
  originalPrice: string;
  salePrice: string;
  images?: string;
  isSoldout?: string;
}
