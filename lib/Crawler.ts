import request from 'request';
import charset from 'charset'; // 해당 사이트의 charset값을 알 수 있게 해준다.
import { decode } from 'iconv-lite';

import { strToNumber } from './Parser';
import { CrawlResult } from 'types/Crawl';

// crawl using request
export const requestHtml = async (sourceUrl: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    request(
      {
        url: sourceUrl, // 원하는 url값을 입력
        encoding: null, // 해당 값을 null로 해주어야 제대로 iconv가 제대로 decode 해준다.
        headers: { 'User-Agent': 'Mozilla/5.0' },
      },
      (error, res, body) => {
        if (!error && res.statusCode === 200) {
          const enc = charset(res.headers, body); // 해당 사이트의 charset값을 획득
          const iResult = decode(body, enc); // 획득한 charset값으로 body를 디코딩
          resolve(iResult);
        } else {
          reject(error);
        }
      }
    );
  });
};

export const select = ($: CheerioStatic, selecter: string): string => {
  try {
    if (selecter.includes('meta')) {
      return $(selecter).last().attr().content;
    }
    if (selecter.includes('input')) {
      return $(selecter).last().val();
    }
    if (selecter.includes('img')) {
      return $(selecter).last().attr().src;
    }
    return unescape($(selecter).last().text().trim());
  } catch {
    return '';
  }
};

export const parseValue = (
  $: CheerioStatic,
  key: string,
  selecter: string
): string | number => {
  const value = select($, selecter);
  if (key === 'name' && value[0] === '[' && value[value.length - 1] === ']') {
    return value.slice(1, value.length - 1);
  }
  if (key === 'originalPrice' || key === 'salePrice') {
    return strToNumber(value);
  }
  return value;
};

export const correct = (result: CrawlResult): CrawlResult => {
  const { originalPrice, salePrice } = result;
  if (originalPrice === 0 || salePrice === 0) {
    return {
      ...result,
      originalPrice: originalPrice + salePrice,
      salePrice: originalPrice + salePrice,
    };
  }
  if (originalPrice < salePrice) {
    return {
      ...result,
      originalPrice: salePrice,
      salePrice: originalPrice,
    };
  }
  return result;
};
