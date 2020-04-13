import { ISelecter } from 'interfaces/ISelecter';
import { parseValue, selectAll, correct, strToNumber } from '../../lib';
import { CrawlResult } from '../../types/Crawl';

export const storemusinsacom = (
  $: CheerioStatic,
  selecter: ISelecter
): CrawlResult => {
  const name = $(selecter.name).last().attr().content;
  const brandKor = $(selecter.brandKor).last().text();
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
    brandKor: brandKor.slice(0, brandKor.indexOf('(')),
    imageUrl,
    originalPrice,
    salePrice,
  };
};

export const mstoremusinsacom = storemusinsacom;

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

export const wconceptcokr = (
  $: CheerioStatic,
  selecter: ISelecter
): CrawlResult => {
  const result = selectAll($, selecter);

  const scriptHtml = $(selecter.brandKor).html();

  const SEARCH_TEXT = '$brandnamekr = "';
  const start = scriptHtml.indexOf(SEARCH_TEXT) + SEARCH_TEXT.length;
  const end = scriptHtml.indexOf('"', start);
  const brandKor = scriptHtml.slice(start, end);

  return correct({
    ...result,
    brandKor,
  });
};

export const lfmallcokr = (
  $: CheerioStatic,
  selecter: ISelecter
): CrawlResult => {
  const result = selectAll($, selecter);

  return correct({
    ...result,
    brandKor: result.brandKor.slice(1, result.brandKor.indexOf(']')),
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

export const barrelscokr = (
  $: CheerioStatic,
  selecter: ISelecter
): CrawlResult => {
  const result = selectAll($, selecter);

  const name = result.name.slice(result.name.indexOf(']') + 2);
  const brandKor = result.brandKor.slice(1, result.name.indexOf(']'));

  return correct({
    ...result,
    name,
    brandKor,
    imageUrl: 'http://www.barrels.co.kr' + result.imageUrl,
  });
};

export const underarmourcokr = (
  $: CheerioStatic,
  selecter: ISelecter
): CrawlResult => {
  const result = selectAll($, selecter);

  const name = result.name.slice(0, result.name.length - 10);

  return correct({
    ...result,
    name,
  });
};

export const thenorthfacekoreacokr = (
  $: CheerioStatic,
  selecter: ISelecter
): CrawlResult => {
  const result = selectAll($, selecter);

  const name = result.name.slice(0, result.name.length - 8);
  const imageUrl = result.imageUrl.replace('?thumbnail', '');

  return correct({
    ...result,
    name,
    imageUrl,
  });
};

export const shopadidascokr = (
  $: CheerioStatic,
  selecter: ISelecter
): CrawlResult => {
  const result = selectAll($, selecter);

  const scriptHtml = $(selecter.originalPrice).html();

  const ORIGINAL_SEARCH_TEXT = 'jQuery("#sn_price").html("';
  const originalStart =
    scriptHtml.indexOf(ORIGINAL_SEARCH_TEXT) + ORIGINAL_SEARCH_TEXT.length;
  const originalEnd = scriptHtml.indexOf('"', originalStart);
  const originalPrice = strToNumber(
    scriptHtml.slice(originalStart, originalEnd)
  );

  const SALE_SEARCH_TEXT = 'jQuery("#ss_price").html("';
  const saleStart =
    scriptHtml.indexOf(SALE_SEARCH_TEXT) + SALE_SEARCH_TEXT.length;
  const saleEnd = scriptHtml.indexOf('"', saleStart);
  const salePrice = strToNumber(scriptHtml.slice(saleStart, saleEnd));

  return correct({
    ...result,
    originalPrice,
    salePrice,
  });
};

export const zaracom = ($: CheerioStatic, selecter: ISelecter): CrawlResult => {
  const result = selectAll($, selecter);

  let scriptHtml;
  $(selecter.originalPrice).each((i, e) => {
    if (e?.children[0]?.data !== undefined) {
      if (e.children[0].data.indexOf('price') > -1) {
        scriptHtml = e.children[0].data;
      }
    }
  });

  const SALE_SEARCH_TEXT = '"price":';
  const saleStart =
    scriptHtml.indexOf(SALE_SEARCH_TEXT) + SALE_SEARCH_TEXT.length;
  const saleEnd = scriptHtml.indexOf('"', saleStart);
  const salePrice = strToNumber(scriptHtml.slice(saleStart, saleEnd));

  let originalPrice = salePrice;

  if (scriptHtml[saleEnd + 1] === 'o') {
    const ORIGINAL_SEARCH_TEXT = '"oldPrice":';
    const originalStart =
      scriptHtml.indexOf(ORIGINAL_SEARCH_TEXT) + ORIGINAL_SEARCH_TEXT.length;
    const originalEnd = scriptHtml.indexOf('"', originalStart);
    originalPrice = strToNumber(scriptHtml.slice(originalStart, originalEnd));
  }

  return correct({
    ...result,
    originalPrice,
    salePrice,
  });
};

export const drmartenscokr = (
  $: CheerioStatic,
  selecter: ISelecter
): CrawlResult => {
  const result = selectAll($, selecter);

  const scriptHtml = $(selecter.originalPrice).html();

  const ORIGINAL_SEARCH_TEXT = '{"original":';
  const originalStart =
    scriptHtml.indexOf(ORIGINAL_SEARCH_TEXT) + ORIGINAL_SEARCH_TEXT.length;
  const originalEnd = scriptHtml.indexOf(',', originalStart);
  const originalPrice = strToNumber(
    scriptHtml.slice(originalStart, originalEnd)
  );

  const SALE_SEARCH_TEXT = ',"basic":';
  const saleStart =
    scriptHtml.indexOf(SALE_SEARCH_TEXT) + SALE_SEARCH_TEXT.length;
  const saleEnd = scriptHtml.indexOf(',', saleStart);
  const salePrice = strToNumber(scriptHtml.slice(saleStart, saleEnd));

  return correct({
    ...result,
    originalPrice,
    salePrice,
  });
};

export const discoveryexpeditioncom = (
  $: CheerioStatic,
  selecter: ISelecter
): CrawlResult => {
  const result = selectAll($, selecter);

  let salePrice = result.salePrice;

  if (result.originalPrice !== 0) {
    const salePriceStr = $(selecter.salePrice).html();
    salePrice = Number(
      salePriceStr
        .slice(salePriceStr.indexOf('</del>'), salePriceStr.length - 8)
        .replace(/[^0-9]/g, '')
    );
  }

  return correct({
    ...result,
    salePrice,
  });
};

export const naturestorecokr = (
  $: CheerioStatic,
  selecter: ISelecter
): CrawlResult => {
  const result = selectAll($, selecter);

  const name = result.name.slice(20);

  return correct({
    ...result,
    name,
  });
};

export const eduardocokr = (
  $: CheerioStatic,
  selecter: ISelecter
): CrawlResult => {
  const result = selectAll($, selecter);

  const name = result.name.slice(result.name.lastIndexOf(']') + 1);

  return correct({
    ...result,
    name,
  });
};

export const personalpackcom = (
  $: CheerioStatic,
  selecter: ISelecter
): CrawlResult => {
  const result = selectAll($, selecter);

  return correct({
    ...result,
    imageUrl: 'http://www.personal-pack.com' + result.imageUrl,
  });
};

export const mngucokr = (
  $: CheerioStatic,
  selecter: ISelecter
): CrawlResult => {
  const result = selectAll($, selecter);
  let originalPrice = Number(
    $(selecter.originalPrice)
      .last()
      .text()
      .slice(12)
      .replace(/[^0-9]/g, '')
  );
  if (originalPrice === 0) {
    originalPrice = Number(
      $(
        '#layoutContent > div > div > div > div.infoArea > div > div.prd-detail > div > p:nth-child(1) > span > span > span > span > span > span > span > span > span > span > span > span > span > font > span'
      )
        .last()
        .text()
        .slice(12)
        .replace(/[^0-9]/g, '')
    );
  }

  return correct({
    ...result,
    originalPrice,
  });
};

export const leirecokr = (
  $: CheerioStatic,
  selecter: ISelecter
): CrawlResult => {
  const result = selectAll($, selecter);

  return correct({
    ...result,
    imageUrl: '',
  });
};

export const tbhshopcokr = (
  $: CheerioStatic,
  selecter: ISelecter
): CrawlResult => {
  const result = selectAll($, selecter);
  let { brandKor } = result;
  if (brandKor === 'Mind Bridge') brandKor = '마인드브릿지';
  if (brandKor === 'JUCY JUDY') brandKor = '쥬씨주디';
  if (brandKor === 'BASIC HOUSE') brandKor = '베이직하우스';

  return correct({
    ...result,
    brandKor,
  });
};

export const lludcokr = (
  $: CheerioStatic,
  selecter: ISelecter
): CrawlResult => {
  const result = selectAll($, selecter);

  return correct({
    ...result,
    brandKor: result.brandKor.slice(0, result.brandKor.indexOf(',')),
  });
};

export const ativekr = ($: CheerioStatic, selecter: ISelecter): CrawlResult => {
  const result = selectAll($, selecter);

  return correct({
    ...result,
    brandKor: result.brandKor.slice(0, result.brandKor.indexOf('(')),
  });
};

export const lab101com = (
  $: CheerioStatic,
  selecter: ISelecter
): CrawlResult => {
  const result = selectAll($, selecter);

  const salePriceStr = $(selecter.salePrice).html();
  const salePrice = Number(
    salePriceStr
      .slice(salePriceStr.indexOf('</span>') + 1)
      .replace(/[^0-9]/g, '')
  );

  return correct({
    ...result,
    salePrice,
  });
};

export const goodnationcokr = (
  $: CheerioStatic,
  selecter: ISelecter
): CrawlResult => {
  const result = selectAll($, selecter);

  return correct({
    ...result,
    brandKor: '',
  });
};
