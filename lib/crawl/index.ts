export * from './info';
export * from './option';

export const getHostName = (url: string): string => {
  const { hostname } = new URL(url);
  if (hostname.includes('topten10mall.com')) {
    return 'topten10mall.com';
  }

  return hostname.replace('www.', '');
};
