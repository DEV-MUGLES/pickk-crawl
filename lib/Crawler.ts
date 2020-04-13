import request from 'request';
import charset from 'charset'; // 해당 사이트의 charset값을 알 수 있게 해준다.
import { decode } from 'iconv-lite';
import axios from 'axios';

import { strToNumber } from './Parser';
import { CrawlResult } from 'types/Crawl';
import { ISelecter } from 'interfaces/ISelecter';

// crawl using request
export const requestHtml = async (sourceUrl: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    request(
      {
        url: sourceUrl, // 원하는 url값을 입력
        encoding: null, // 해당 값을 null로 해주어야 제대로 iconv가 제대로 decode 해준다.
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/50.0.2661.102 Safari/537.36',
        },
      },
      async (error, res, body) => {
        if (!error && res.statusCode === 200 && body.length > 1000) {
          const enc = charset(res.headers, body); // 해당 사이트의 charset값을 획득
          const iResult = decode(body, enc || 'utf-8'); // 획득한 charset값으로 body를 디코딩
          resolve(iResult);
        } else {
          const { data } = await axios(sourceUrl);
          resolve(data);
        }
      }
    );
  });
};

export const selectAll = ($: CheerioStatic, selecter: ISelecter) => {
  return Object.keys(selecter).reduce((acc, key) => {
    return {
      ...acc,
      [key]: parseValue($, key, selecter[key]),
    };
  }, {} as CrawlResult);
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
    if (selecter[selecter.length - 1] === 'a') {
      return $(selecter).last().attr().href;
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
  const { imageUrl: iu, originalPrice: op, salePrice: sp } = result;

  let imageUrl = iu;
  let originalPrice = op;
  let salePrice = sp;

  if (op === 0 || sp === 0) {
    originalPrice = op + sp;
    salePrice = op + sp;
  }
  if (originalPrice < salePrice) {
    originalPrice = salePrice;
    salePrice = originalPrice;
  }
  if (iu[0] === '/') {
    imageUrl = 'https:' + result.imageUrl;
  }
  return { ...result, imageUrl, originalPrice, salePrice };
};
