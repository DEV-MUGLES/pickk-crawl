import { ISelecter } from 'interfaces/ISelecter';
import { parseValue, selectAll } from '../../lib';
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
