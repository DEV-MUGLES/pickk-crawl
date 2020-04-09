import { ISelecter } from 'interfaces/ISelecter';
import { parseValue, selectAll, correct, strToNumber } from '../../lib';
import { CrawlResult } from '../../types/Crawl';

export const storemusinsacom = (
  $: CheerioStatic,
  selecter: ISelecter
): CrawlResult => {
  const name = $(selecter.name).last().attr().content;
  const imageUrl = $(selecter.imageUrl).last().attr().content;
  const originalPrice = Number(
    $(selecter.originalPrice)
      .last()
      .text()
      .replace(/[^0-9]/g, '')
  );
  const salePrice = $(selecter.salePrice).html()
    ? Number(
        $(selecter.salePrice)
          .last()
          .text()
          .replace(/[^0-9]/g, '')
      )
    : originalPrice;

  return {
    name: name.slice(name.indexOf(') ') + 2, name.indexOf(' - ')),
    imageUrl,
    originalPrice,
    salePrice,
  };
};

export const espionagecokr = (
  $: CheerioStatic,
  selecter: ISelecter
): CrawlResult => {
  const result = selectAll($, selecter);
  return {
    ...result,
    originalPrice:
      result.originalPrice === 0 ? result.salePrice : result.originalPrice,
  };
};

export const noirlarmescokr = (
  $: CheerioStatic,
  selecter: ISelecter
): CrawlResult => {
  const result = selectAll($, selecter);
  const myPrice = Number(parseValue($, 'originalPrice', 'p.price > span'));

  return {
    ...result,
    originalPrice: result.originalPrice || myPrice,
    salePrice: result.salePrice || myPrice,
  };
};

export const conversecokr = (
  $: CheerioStatic,
  selecter: ISelecter
): CrawlResult => {
  const result = selectAll($, selecter);
  const myPrice = Number(
    parseValue($, 'originalPrice', 'p.product-price > span')
  );

  return {
    ...result,
    originalPrice: result.originalPrice || myPrice,
    salePrice: result.salePrice || myPrice,
  };
};

export const zavanascom = (
  $: CheerioStatic,
  selecter: ISelecter
): CrawlResult => {
  const result = selectAll($, selecter);
  const myPrice = Number(
    parseValue(
      $,
      'originalPrice',
      'div.table-opt > table > tbody > tr:nth-child(1) > td > div'
    )
  );

  return {
    ...result,
    originalPrice: result.originalPrice || myPrice,
    salePrice: result.salePrice || myPrice,
  };
};

export const placofficialcom = (
  $: CheerioStatic,
  selecter: ISelecter
): CrawlResult => {
  const result = selectAll($, selecter);

  return {
    ...result,
    imageUrl: 'https://plac-official.com/' + result.imageUrl,
  };
};

export const giordanocokr = (
  $: CheerioStatic,
  selecter: ISelecter
): CrawlResult => {
  const result = selectAll($, selecter);
  console.log(result.name);

  return correct({
    ...result,
    name: result.name.slice(0, result.name.length - 6),
  });
};

export const spaoelandmallcom = (
  $: CheerioStatic,
  selecter: ISelecter
): CrawlResult => {
  const result = selectAll($, selecter);

  return correct({
    ...result,
    imageUrl:
      result.imageUrl ||
      'https:' + (parseValue($, 'imageUrl', '#d_elevate_img') as string),
  });
};

export const shoopenelandmallcom = (
  $: CheerioStatic,
  selecter: ISelecter
): CrawlResult => {
  const result = selectAll($, selecter);

  return correct({
    ...result,
    imageUrl:
      result.imageUrl ||
      'https:' + (parseValue($, 'imageUrl', '#d_elevate_img') as string),
  });
};

export const www2hmcom = (
  $: CheerioStatic,
  selecter: ISelecter
): CrawlResult => {
  const result = selectAll($, selecter);

  const scriptHtml = $(selecter.originalPrice).html();

  const SEARCH_TEXT = 'product_original_price : [';
  const start = scriptHtml.indexOf(SEARCH_TEXT) + SEARCH_TEXT.length;
  const end = scriptHtml.indexOf('.', start);
  const originalPrice = strToNumber(scriptHtml.slice(start, end));

  return correct({
    ...result,
    originalPrice,
  });
};

export const romanticpiratescom = (
  $: CheerioStatic,
  selecter: ISelecter
): CrawlResult => {
  const result = selectAll($, selecter);

  return {
    ...result,
    imageUrl: 'https://romanticpirates.com/' + result.imageUrl,
  };
};

export const jemutshopcom = (
  $: CheerioStatic,
  selecter: ISelecter
): CrawlResult => {
  const result = selectAll($, selecter);

  return {
    ...result,
    imageUrl: 'https://www.jemutshop.com/' + result.imageUrl,
  };
};

export const beslowcokr = (
  $: CheerioStatic,
  selecter: ISelecter
): CrawlResult => {
  const result = selectAll($, selecter);
  const myPrice = Number(
    parseValue($, 'originalPrice', 'div.detail-price >  span:nth-child(1)')
  );

  return correct({
    ...result,
    imageUrl: $(selecter.imageUrl).attr()['data-src'],
    originalPrice: result.originalPrice || myPrice,
  });
};

export const stussycokr = (
  $: CheerioStatic,
  selecter: ISelecter
): CrawlResult => {
  const result = selectAll($, selecter);

  return correct({
    ...result,
    imageUrl: $(selecter.imageUrl).attr()['data-lazy'],
  });
};
