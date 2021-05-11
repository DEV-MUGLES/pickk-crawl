export * from './info';
export * from './option';

export const getHostName = (url: string): string => {
  const { hostname } = new URL(url);
  if (hostname.includes('topten10mall.com')) {
    return 'topten10mall.com';
  }
  if (url.includes('espionage.co.kr/m')) {
    return 'espionage.co.kr/m';
  }
  if (url.includes('mamagari.com/m')) {
    return 'mamagari.com/m';
  }
  if (url.includes('ocokorea.com/shopMobile')) {
    return 'ocokorea.com/shopMobile';
  }
  if (url.includes('brand.naver.com/ralphlauren')) {
    return 'brand.naver.com/ralphlauren';
  }
  if (url.includes('shopping.naver.com/department')) {
    return 'shopping.naver.com/department';
  }
  return hostname.replace('www.', '');
};
