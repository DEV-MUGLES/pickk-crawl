import { strToNumber } from '../utils/Parser';
import { InfoResult, InfoSelectors } from 'types/info';

export const selectAll = ($: CheerioStatic, selectors: InfoSelectors) => {
  return Object.keys(selectors).reduce((acc, key) => {
    return {
      ...acc,
      [key]: parseValue($, key, selectors[key]),
    };
  }, {} as InfoResult);
};

export const select = ($: CheerioStatic, selector: string): string => {
  try {
    if (selector.includes('meta[')) {
      return $(selector).last().attr().content;
    }
    if (selector.includes('input')) {
      return $(selector).last().val();
    }
    if (selector.includes('img')) {
      return $(selector).last().attr().src;
    }
    if (selector[selector.length - 1] === 'a') {
      return $(selector).last().attr().href;
    }
    return unescape($(selector).last().text().trim());
  } catch {
    return '';
  }
};

export const selectImages = ($: CheerioStatic, selector: string): string[] => {
  const images = [];
  $(selector).each((_i, ele) => {
    images.push(
      ele.attribs.src ||
        ele.attribs['ec-data-src'] ||
        ele.attribs['data-src'] ||
        ele.attribs['imgsrc']
    );
  });
  return images;
};

export const parseValue = (
  $: CheerioStatic,
  key: string,
  selector: string
): string | number | string[] | boolean => {
  if (key === 'images') {
    return selectImages($, selector);
  }
  if (key === 'isSoldout') {
    return !$(selector).hasClass('displaynone');
  }
  const value = select($, selector);
  if (key === 'name' && value[0] === '[' && value[value.length - 1] === ']') {
    return value.slice(1, value.length - 1);
  }
  if (key === 'originalPrice' || key === 'salePrice') {
    return strToNumber(value);
  }
  return value;
};

export const getLdJsonObject = ($: CheerioStatic, index: number = 0): any => {
  const scriptEles = $('script[type ="application/ld+json"]')?.toArray();
  if (!scriptEles?.length) {
    return {};
  }

  return JSON.parse(scriptEles[index].firstChild.data);
};

export const getNextPageProps = ($: CheerioStatic, index: number = 0): any => {
  const scriptEles = $('script#__NEXT_DATA__')?.toArray();
  if (!scriptEles?.length) {
    return {};
  }

  return JSON.parse(scriptEles[index].firstChild.data)?.props?.pageProps || {};
};

export const correct = (result: InfoResult): InfoResult => {
  const { name: n, imageUrl: iu, originalPrice: op, salePrice: sp } = result;

  let name = n;
  let imageUrl = iu;
  let originalPrice = op || 0;
  let salePrice = sp || 0;

  if (op === 0 || sp === 0) {
    originalPrice = op + sp;
    salePrice = op + sp;
  }
  if (originalPrice < salePrice) {
    const temp = originalPrice;
    originalPrice = salePrice;
    salePrice = temp;
  }
  if (iu[0] === '/') {
    imageUrl = 'https:' + result.imageUrl;
  }
  name = name.replace('[29CM단독] ', '');

  return { ...result, name: name.trim(), imageUrl, originalPrice, salePrice };
};
