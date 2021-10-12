import axios from 'axios';
import {
  parseValue,
  selectAll,
  correct,
  strToNumber,
  selectImages,
  getLdJsonObject,
  getNextPageProps,
} from '../../lib';
import { InfoResult, InfoSelectors } from '../../types';
import { correctImageUrl, getCheerio } from '.';
import * as cheerio from 'cheerio';

export const _storemusinsacom = (
  $: CheerioStatic,
  selector: InfoSelectors
): InfoResult => {
  const result = selectAll($, selector);

  const { name, brandKor } = result;

  const salePrice = strToNumber(name.slice(name.lastIndexOf(' - ')));

  return {
    ...result,
    name: name.slice(name.indexOf(') ') + 2, name.indexOf(' - ')),
    brandKor: brandKor.slice(0, brandKor.indexOf('(')),
    isSoldout: $(selector.isSoldout).text() === '품절',
    salePrice,
  };
};

export const _mstoremusinsacom = _storemusinsacom;

export const _espionagecokr = (
  $: CheerioStatic,
  selector: InfoSelectors
): InfoResult => {
  const result = selectAll($, selector);

  return {
    ...result,
    imageUrl: 'http://www.espionage.co.kr' + result.imageUrl,
    originalPrice:
      result.originalPrice === 0 ? result.salePrice : result.originalPrice,
  };
};

export const _noirlarmescokr = (
  $: CheerioStatic,
  selector: InfoSelectors
): InfoResult => {
  const result = selectAll($, selector);
  const myPrice = Number(parseValue($, 'originalPrice', 'p.price > span'));

  return {
    ...result,
    originalPrice: result.originalPrice || myPrice,
    salePrice: result.salePrice || myPrice,
  };
};

export const _conversecokr = (
  $: CheerioStatic,
  selector: InfoSelectors
): InfoResult => {
  const result = selectAll($, selector);
  const myPrice = Number(
    parseValue($, 'originalPrice', 'p.product-price > span')
  );

  return {
    ...result,
    originalPrice: result.originalPrice || myPrice,
    salePrice: result.salePrice || myPrice,
  };
};

export const _zavanascom = (
  $: CheerioStatic,
  selector: InfoSelectors
): InfoResult => {
  const result = selectAll($, selector);
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
    salePrice:
      (result.salePrice <= 100 ? result.originalPrice : result.salePrice) ||
      myPrice,
  };
};

export const _giordanocokr = (
  $: CheerioStatic,
  selector: InfoSelectors
): InfoResult => {
  const result = selectAll($, selector);

  return correct({
    ...result,
    name: result.name.slice(0, result.name.length - 6),
  });
};

export const _spaoelandmallcom = (
  $: CheerioStatic,
  selector: InfoSelectors
): InfoResult => {
  const result = selectAll($, selector);

  return correct({
    ...result,
    imageUrl:
      result.imageUrl ||
      'https:' + (parseValue($, 'imageUrl', '#d_elevate_img') as string),
  });
};

export const _shoopenelandmallcom = (
  $: CheerioStatic,
  selector: InfoSelectors
): InfoResult => {
  const result = selectAll($, selector);

  return correct({
    ...result,
    imageUrl:
      result.imageUrl ||
      'https:' + (parseValue($, 'imageUrl', '#d_elevate_img') as string),
  });
};

export const _wconceptcokr = (
  $: CheerioStatic,
  selector: InfoSelectors
): InfoResult => {
  const result = selectAll($, selector);

  const brandEng = $('#frmproduct > div.h_group > h2 > a').text();

  const brandKor = result.brandKor
    .slice(result.brandKor.indexOf('[') + 1, result.brandKor.indexOf(']'))
    .replace(brandEng, '')
    .trim();

  return correct({
    ...result,
    brandKor: brandKor,
  });
};

export const _mwconceptcokr = _wconceptcokr;

export const _lfmallcokr = async (
  _$: CheerioStatic,
  _selector: InfoSelectors,
  url: string
): Promise<InfoResult> => {
  const matches = url.match(/[?&]?PROD_CD=(\w+)/);
  const productId = matches[1];
  try {
    const {
      results: { productDetail },
    } = await axios
      .get(
        `https://mapi.lfmall.co.kr/api/ver2/products/detail?productId=${productId}`,
        {
          timeout: 30000,
        }
      )
      .then((res) => res.data);

    return correct({
      name: productDetail.itemStocks[0].name,
      brandKor: productDetail.brand.tbrandHnm,
      imageUrl: productDetail.images[0].url,
      originalPrice: productDetail.originalPrice,
      salePrice: productDetail.originalSalePrice,
    });
  } catch (error) {
    console.log(error);
  }
};

export const _www2hmcom = (
  $: CheerioStatic,
  selector: InfoSelectors
): InfoResult => {
  const result = selectAll($, selector);

  const scriptHtml = $(selector.originalPrice).html();

  const SEARCH_TEXT = 'product_original_price : [';
  const start = scriptHtml.indexOf(SEARCH_TEXT) + SEARCH_TEXT.length;
  const end = scriptHtml.indexOf('.', start);
  const originalPrice = strToNumber(scriptHtml.slice(start, end));

  return correct({
    ...result,
    originalPrice,
  });
};

export const _romanticpiratescom = (
  $: CheerioStatic,
  selector: InfoSelectors
): InfoResult => {
  const result = selectAll($, selector);

  return {
    ...result,
    imageUrl: 'https://romanticpirates.com/' + result.imageUrl,
  };
};

export const _jemutshopcom = (
  $: CheerioStatic,
  selector: InfoSelectors
): InfoResult => {
  const result = selectAll($, selector);

  return {
    ...result,
    imageUrl: 'https://www.jemutshop.com/' + result.imageUrl,
  };
};

export const _beslowcokr = (
  $: CheerioStatic,
  selector: InfoSelectors
): InfoResult => {
  const result = selectAll($, selector);
  const myPrice = Number(
    parseValue($, 'originalPrice', 'div.detail-price >  span:nth-child(1)')
  );

  let brandKor = result.brandKor;
  if (brandKor === 'BESLOW STANDARD') brandKor = '비슬로우 스탠다드';
  if (brandKor === 'DIMITRI BLACK') brandKor = '디미트리 블랙';
  if (brandKor === 'OUTSTANDING') brandKor = '아웃스탠딩';
  if (brandKor === 'Ramolin') brandKor = '라모랭';
  if (brandKor === 'FRIZM WORKS') brandKor = '프리즘웍스';
  if (brandKor === 'BESLOW PURPLE') brandKor = '비슬로우 퍼플';
  if (brandKor === 'BESLOW ORIGINALS') brandKor = '비슬로우 오리지널스';
  if (brandKor === 'SHOOPEN X BESLOW') brandKor = '슈펜 X 비슬로우';
  if (brandKor === 'THE RESQ') brandKor = '더레스큐';
  if (brandKor === 'VANONE') brandKor = '반원';
  if (brandKor === 'MOAA') brandKor = '모아';
  if (brandKor === 'MAGOODGAN') brandKor = '맥우드건';
  if (brandKor === 'MONOFLOW') brandKor = '모노플로우';
  if (brandKor === 'node archive') brandKor = '노드 아카이브';
  if (brandKor === 'MOAA') brandKor = '모아';
  if (brandKor === 'BESLOW SLOWBOY') brandKor = '비슬로우 슬로우보이';

  return correct({
    ...result,
    imageUrl: $(selector.imageUrl).attr()['data-src'],
    originalPrice: result.originalPrice || myPrice,
    brandKor,
  });
};

export const _stussycokr = (
  $: CheerioStatic,
  selector: InfoSelectors
): InfoResult => {
  const result = selectAll($, selector);

  return correct({
    ...result,
    imageUrl: $(selector.imageUrl).attr()['data-lazy'],
  });
};

export const _barrelscokr = (
  $: CheerioStatic,
  selector: InfoSelectors
): InfoResult => {
  const result = selectAll($, selector);

  const name = result.name.slice(result.name.indexOf(']') + 2);
  const brandKor = result.brandKor.slice(1, result.name.indexOf(']'));

  return correct({
    ...result,
    name,
    brandKor,
    imageUrl: 'http://www.barrels.co.kr' + result.imageUrl,
  });
};

export const _underarmourcokr = (
  $: CheerioStatic,
  selector: InfoSelectors
): InfoResult => {
  const result = selectAll($, selector);

  const name = result.name.slice(0, result.name.length - 10);

  return correct({
    ...result,
    name,
  });
};

export const _thenorthfacekoreacokr = (
  $: CheerioStatic,
  selector: InfoSelectors
): InfoResult => {
  const result = selectAll($, selector);

  const name = result.name.slice(0, result.name.length - 8);
  const imageUrl = result.imageUrl.replace('?thumbnail', '');

  return correct({
    ...result,
    name,
    imageUrl,
  });
};

export const _shopadidascokr = (
  $: CheerioStatic,
  selector: InfoSelectors
): InfoResult => {
  const result = selectAll($, selector);

  const scriptHtml = $(selector.originalPrice).html();

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

export const _zaracom = (
  $: CheerioStatic,
  selector: InfoSelectors
): InfoResult => {
  const result = selectAll($, selector);

  let scriptHtml;
  $(selector.originalPrice).each((i, e) => {
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

export const _drmartenscokr = (
  $: CheerioStatic,
  selector: InfoSelectors
): InfoResult => {
  const result = selectAll($, selector);
  const ldJsonObject = getLdJsonObject($);

  const originalPrice = Number(ldJsonObject.offers.price);

  return correct({
    ...result,
    originalPrice,
    salePrice: originalPrice,
  });
};

export const _mdrmartenscokr = _drmartenscokr;

export const _naturestorecokr = (
  $: CheerioStatic,
  selector: InfoSelectors
): InfoResult => {
  const result = selectAll($, selector);

  const name = result.name.slice(20);

  return correct({
    ...result,
    name,
  });
};

export const _eduardocokr = (
  $: CheerioStatic,
  selector: InfoSelectors
): InfoResult => {
  const result = selectAll($, selector);

  const name = result.name.slice(result.name.lastIndexOf(']') + 1);

  return correct({
    ...result,
    name,
  });
};

export const _personalpackcom = (
  $: CheerioStatic,
  selector: InfoSelectors
): InfoResult => {
  const result = selectAll($, selector);

  return correct({
    ...result,
    imageUrl: 'http://www.personal-pack.com' + result.imageUrl,
  });
};

export const _mngucokr = (
  $: CheerioStatic,
  selector: InfoSelectors
): InfoResult => {
  const result = selectAll($, selector);
  let originalPrice = Number(
    $(selector.originalPrice)
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

export const _leirecokr = (
  $: CheerioStatic,
  selector: InfoSelectors
): InfoResult => {
  const result = selectAll($, selector);
  const imageUrl = $(selector.imageUrl).first().attr().content;

  return correct({
    ...result,
    imageUrl,
    images: result.images.filter((image) => !image.includes('staff')),
  });
};

export const _tbhshopcokr = (
  $: CheerioStatic,
  selector: InfoSelectors
): InfoResult => {
  const result = selectAll($, selector);
  const brandKor = result.brandKor.split(':')[0].trim();
  const imageUrl = 'http:' + result.imageUrl.split('tbhshop.co.kr:443/')[1];

  return correct({
    ...result,
    brandKor,
    imageUrl,
  });
};

export const _lludcokr = (
  $: CheerioStatic,
  selector: InfoSelectors
): InfoResult => {
  const result = selectAll($, selector);

  return correct({
    ...result,
    brandKor: result.brandKor.slice(0, result.brandKor.indexOf(',')),
  });
};

export const _ativekr = (
  $: CheerioStatic,
  selector: InfoSelectors
): InfoResult => {
  const result = selectAll($, selector);

  return correct({
    ...result,
    brandKor: result.brandKor.slice(0, result.brandKor.indexOf('(')),
  });
};

export const goodnationcokr = (
  $: CheerioStatic,
  selector: InfoSelectors
): InfoResult => {
  const result = selectAll($, selector);

  return correct({
    ...result,
    brandKor: '',
  });
};

export const _lambydcom = (
  $: CheerioStatic,
  selector: InfoSelectors
): InfoResult => {
  const result = selectAll($, selector);

  return correct({
    ...result,
    name: result.name.slice(0, result.name.length - 18),
  });
};

export const _monsterrepubliccokr = (
  $: CheerioStatic,
  selector: InfoSelectors
): InfoResult => {
  const result = selectAll($, selector);
  const scriptHtml = $(selector.imageUrl).html();

  const SEARCH_TEXT = '.jpg\' : "..';
  const start = scriptHtml.indexOf(SEARCH_TEXT) + SEARCH_TEXT.length;
  const end = scriptHtml.indexOf('"', start);
  const imageUrl =
    'http://monsterrepublic.co.kr/shop' + scriptHtml.slice(start, end);

  return correct({
    ...result,
    imageUrl,
  });
};

export const _ziosongziocom = (
  $: CheerioStatic,
  selector: InfoSelectors
): InfoResult => {
  const result = selectAll($, selector);

  return correct({
    ...result,
    imageUrl: 'http://www.ziosongzio.com' + result.imageUrl,
  });
};

export const _topten10mallcom = (
  $: CheerioStatic,
  selector: InfoSelectors
): InfoResult => {
  const result = selectAll($, selector);

  let { brandKor } = result;
  if (brandKor === 'TOPTEN10') brandKor = '탑텐';
  if (brandKor === 'POLHAM') brandKor = '폴햄';
  if (brandKor === 'ZIOZIA') brandKor = '지오지아';
  if (brandKor === 'AND Z') brandKor = '앤드지';

  const goodsNo = result.imageUrl.slice(result.imageUrl.indexOf(' / ') + 4);

  const salePriceStr = $(selector.salePrice).html();
  const salePrice = Number(
    salePriceStr.slice(0, salePriceStr.indexOf(' &#x')).replace(/[^0-9]/g, '')
  );

  return correct({
    ...result,
    imageUrl: 'https://d2gocqzpnajr77.cloudfront.net/' + goodsNo + '_M',
    brandKor,
    salePrice,
  });
};

export const _ssgcom = (
  $: CheerioStatic,
  selector: InfoSelectors
): InfoResult => {
  const result = selectAll($, selector);

  let brandKor =
    unescape($(selector.brandKor).last().text().trim()).replace('#', '') ||
    '신세계몰';
  if (brandKor.includes('(')) {
    brandKor = brandKor.slice(0, brandKor.indexOf('('));
  }

  return correct({
    ...result,
    brandKor,
  });
};

export const _mssgcom = _ssgcom;

export const _goodsellottecom = (
  $: CheerioStatic,
  selector: InfoSelectors
): InfoResult => {
  const result = selectAll($, selector);

  const brandKor = unescape($(selector.brandKor).last().text().trim());

  return correct({
    ...result,
    brandKor,
  });
};

export const _hyundaihmallcom = (
  $: CheerioStatic,
  selector: InfoSelectors
): InfoResult => {
  const result = selectAll($, selector);

  return correct({
    ...result,
    brandKor: '',
  });
};

export const _akmallcom = (
  $: CheerioStatic,
  selector: InfoSelectors
): InfoResult => {
  const result = selectAll($, selector);

  const brandKor = result.brandKor.slice(0, result.brandKor.indexOf('브'));

  return correct({
    ...result,
    brandKor,
  });
};

export const _thehyundaicom = (
  $: CheerioStatic,
  selector: InfoSelectors
): InfoResult => {
  const result = selectAll($, selector);

  const brandKorStr = $(selector.brandKor).html();
  let brandKor = unescape($(selector.brandKor).last().text().trim());
  if (brandKorStr.includes('img')) {
    brandKor = $(selector.brandKor + '> img')
      .last()
      .attr().alt;
  }

  return correct({
    ...result,
    brandKor,
  });
};

export const _mariomallcokr = (
  $: CheerioStatic,
  selector: InfoSelectors
): InfoResult => {
  const result = selectAll($, selector);

  const brandKor = result.brandKor.slice(0, result.brandKor.indexOf('브') - 1);

  return correct({
    ...result,
    brandKor,
  });
};

export const _fashionpluscokr = (
  $: CheerioStatic,
  selector: InfoSelectors
): InfoResult => {
  const result = selectAll($, selector);
  const ldJsonObject = getLdJsonObject($);

  const name = ldJsonObject.name;
  const brandKor = ldJsonObject.brand.name;
  const salePrice = strToNumber(ldJsonObject.offers.price);

  return correct({
    ...result,
    name,
    brandKor,
    salePrice,
  });
};

export const _shoppinginterparkcom = (
  $: CheerioStatic,
  selector: InfoSelectors
): InfoResult => {
  const result = selectAll($, selector);

  const originalPriceStr = $(selector.originalPrice).html();
  const ORIGINAL_SEARCH_TEXT = '"sale_price":';
  const SALE_SEARCH_TEXT = '"item_price":';
  const SALE_SEARCH_TEXT_END = 'var egsLogManager';
  const originalPrice = Number(
    originalPriceStr
      .slice(
        originalPriceStr.indexOf(ORIGINAL_SEARCH_TEXT) +
          ORIGINAL_SEARCH_TEXT.length,
        originalPriceStr.indexOf(SALE_SEARCH_TEXT)
      )
      .replace(/[^0-9]/g, '')
  );
  const salePrice = Number(
    originalPriceStr
      .slice(
        originalPriceStr.indexOf(SALE_SEARCH_TEXT) + SALE_SEARCH_TEXT.length,
        originalPriceStr.indexOf(SALE_SEARCH_TEXT_END)
      )
      .replace(/[^0-9]/g, '')
  );

  return correct({
    ...result,
    originalPrice,
    salePrice,
  });
};

export const _g9cokr = (
  $: CheerioStatic,
  selector: InfoSelectors
): InfoResult => {
  const result = selectAll($, selector);

  const name = result.name.slice(0, result.name.indexOf('|'));

  return correct({
    ...result,
    name,
  });
};

export const _4xrcokr = (
  $: CheerioStatic,
  selector: InfoSelectors
): InfoResult => {
  const result = selectAll($, selector);
  const hasBrandName = result.name.includes(':');

  const brandKor = hasBrandName
    ? result.name.slice(0, result.name.indexOf(':') - 1)
    : '4xr';
  const name = hasBrandName
    ? result.name.slice(result.name.indexOf(':') + 2)
    : result.name;
  const salePrice =
    result.salePrice < 100 ? result.originalPrice : result.salePrice;

  return correct({
    ...result,
    brandKor,
    salePrice,
    name,
    imageUrl: 'http://www.4xr.co.kr' + result.imageUrl,
  });
};

export const _gvgcokr = (
  $: CheerioStatic,
  selector: InfoSelectors
): InfoResult => {
  const result = selectAll($, selector);

  const brandKor = result.brandKor.slice(0, result.brandKor.indexOf('('));

  return correct({
    ...result,
    brandKor,
  });
};

export const _farfetchcom = (
  $: CheerioStatic,
  selector: InfoSelectors
): InfoResult => {
  const result = selectAll($, selector);

  return correct({
    ...result,
    name: result.name.slice(0, result.name.indexOf('-') - 1),
  });
};

export const _abokinet = (
  $: CheerioStatic,
  selector: InfoSelectors
): InfoResult => {
  const result = selectAll($, selector);

  return correct({
    ...result,
    imageUrl: 'https://www.aboki.net' + result.imageUrl,
  });
};

export const _jogunshopcom = (
  $: CheerioStatic,
  selector: InfoSelectors
): InfoResult => {
  const result = selectAll($, selector);

  const name = result.name.slice(0, result.name.indexOf('<br>'));

  return correct({
    ...result,
    name,
  });
};

export const _timemeccacokr = (
  $: CheerioStatic,
  selector: InfoSelectors
): InfoResult => {
  const result = selectAll($, selector);
  const isContainBrand = result.name.indexOf('[') === 0;
  const brandKor = isContainBrand
    ? result.name.slice(1, result.name.indexOf(']')).replace(/[A-Za-z]/g, '')
    : '';

  return correct({
    ...result,
    brandKor,
  });
};

export const _snuvcokr = (
  $: CheerioStatic,
  selector: InfoSelectors
): InfoResult => {
  const result = selectAll($, selector);

  const originalPriceStr = $(selector.originalPrice).html();
  const hasSalePrice = originalPriceStr.includes('strike');
  const originalPriceselector = hasSalePrice
    ? selector.originalPrice + ' > strike'
    : selector.originalPrice + ' > div';
  const originalPrice = strToNumber(
    unescape($(originalPriceselector).last().text().trim())
  );

  const brandKorselector = hasSalePrice
    ? selector.brandKor + ' > tr:nth-child(5) > td > div'
    : selector.brandKor + ' > tr:nth-child(4) > td > div';
  const brandKor = unescape($(brandKorselector).last().text().trim());

  return correct({
    ...result,
    originalPrice,
    brandKor,
    imageUrl: 'https://www.snuv.co.kr' + result.imageUrl,
  });
};

export const _labelarchivecom = (
  $: CheerioStatic,
  selector: InfoSelectors
): InfoResult => {
  const result = selectAll($, selector);
  const ldJsonObject = getLdJsonObject($);

  const name = result.name.slice(
    0,
    result.name.indexOf(' : LABEL ARCHIVE 라벨 아카이브')
  );
  const salePrice = ldJsonObject.offers.price;

  return correct({
    ...result,
    name,
    salePrice,
  });
};

export const _wvprojectcokr = (
  $: CheerioStatic,
  selector: InfoSelectors
): InfoResult => {
  const result = selectAll($, selector);

  return correct({
    ...result,
    imageUrl: 'https://www.wvproject.co.kr' + result.imageUrl,
  });
};

export const _heightsstorecom = (
  $: CheerioStatic,
  selector: InfoSelectors
): InfoResult => {
  const result = selectAll($, selector);

  let brandKor = result.brandKor.replace('See all brand product', '');
  if (brandKor === 'have a good time') brandKor = '해브어굿타임';
  if (brandKor === 'Stussy') brandKor = '스투시';
  if (brandKor === 'Richardson') brandKor = '리차드슨';
  if (brandKor === 'MISCHIEF') brandKor = '미스치프';

  return correct({
    ...result,
    brandKor,
  });
};

export const _urbanstoffcom = (
  $: CheerioStatic,
  selector: InfoSelectors
): InfoResult => {
  const result = selectAll($, selector);

  return correct({
    ...result,
  });
};

export const _gncostylecom = (
  $: CheerioStatic,
  selector: InfoSelectors
): InfoResult => {
  const result = selectAll($, selector);

  let { brandKor } = result;
  if (brandKor === 'T.I FOR MEN') brandKor = '티아이포맨';
  if (brandKor === 'COVETBLAN') brandKor = '코벳블랑';
  if (brandKor === 'Thursday Island') brandKor = '써스데이아일랜드';

  return correct({
    ...result,
    brandKor,
  });
};

export const _yanthirteencom = (
  $: CheerioStatic,
  selector: InfoSelectors
): InfoResult => {
  const result = selectAll($, selector);

  const SALE_SEARCH_TEXT = 'product_price';
  const SALE_SEARCH_TEXT_END = 'option_type';
  const html = $('html').html();
  const salePrice = Number(
    html
      .slice(html.indexOf(SALE_SEARCH_TEXT), html.indexOf(SALE_SEARCH_TEXT_END))
      .replace(/[^0-9]/g, '')
  );

  return correct({
    ...result,
    imageUrl: 'https://www.yanthirteen.com' + result.imageUrl,
    salePrice,
  });
};

export const _hfashionmallcom = (
  $: CheerioStatic,
  selector: InfoSelectors
): InfoResult => {
  const result = selectAll($, selector);

  const html = $('html').html();
  const BRAND_SERACH_TEXT = 'recopick:author" content="';
  const BRAND_SEARCH_TEXT_END = '<meta property="recopick:title';
  const brandKorStr = html.slice(
    html.indexOf(BRAND_SERACH_TEXT) + BRAND_SERACH_TEXT.length,
    html.indexOf(BRAND_SEARCH_TEXT_END)
  );
  let brandKor = brandKorStr.slice(0, brandKorStr.indexOf('">'));

  if (brandKor === 'TOMMY HILFIGER MEN') brandKor = '타미힐피거';
  if (brandKor === 'CALVIN KLEIN MEN') brandKor = '캘빈클라인';
  if (brandKor === 'TOMMY JEANS') brandKor = '타미진스';

  return correct({ ...result, brandKor });
};

export const _guglobalcom = (
  $: CheerioStatic,
  selector: InfoSelectors
): InfoResult => {
  const result = selectAll($, selector);

  const originalPrice = Number($(selector.originalPrice).attr('value'));

  return correct({ ...result, originalPrice });
};

export const _shinwonmallcom = (
  $: CheerioStatic,
  selector: InfoSelectors
): InfoResult => {
  const result = selectAll($, selector);
  let { brandKor } = result;
  if (brandKor === 'FAHRENHEIT') brandKor = '지이크 파렌하이트';
  if (brandKor === 'SIEG') brandKor = '지이크';
  if (brandKor === 'ISABEY') brandKor = '이사베이';
  if (brandKor === 'GINNASIX') brandKor = '기나식스';
  if (brandKor === 'iCONIQ') brandKor = '아이코닉';
  if (brandKor === 'MARKM') brandKor = '마크엠';
  if (brandKor === 'BESTIBELLI') brandKor = '베스띠벨리';
  if (brandKor === 'VIKI') brandKor = '비키';

  return correct({ ...result, brandKor });
};

export const _shopreebokcokr = (
  $: CheerioStatic,
  selector: InfoSelectors
): InfoResult => {
  const result = selectAll($, selector);

  const head = $('head').html();
  const ORIGINAL_SEARCH_TEXT =
    'jQuery("#sn_price").html("<span class=\'won\'></span>"';
  const SALE_SEARCH_TEXT =
    'jQuery("#ss_price").html("<span class=\'won\'></span>"';
  const SALE_SEARCH_TEXT_END = 'jQuery("#sn_price").show();';
  const originalPrice = Number(
    head
      .slice(
        head.indexOf(ORIGINAL_SEARCH_TEXT) + ORIGINAL_SEARCH_TEXT.length,
        head.indexOf(SALE_SEARCH_TEXT)
      )
      .replace(/[^0-9]/g, '')
  );
  const salePrice = Number(
    head
      .slice(
        head.indexOf(SALE_SEARCH_TEXT) + SALE_SEARCH_TEXT.length,
        head.indexOf(SALE_SEARCH_TEXT_END)
      )
      .replace(/[^0-9]/g, '')
  );

  return correct({
    ...result,
    originalPrice,
    salePrice,
  });
};

export const _toptentopten10mallcom = (
  $: CheerioStatic,
  selector: InfoSelectors
): InfoResult => {
  const result = selectAll($, selector);

  const salePriceStr = $(selector.salePrice).html();
  const salePrice = Number(
    salePriceStr
      .slice(0, salePriceStr.indexOf('&#xC6D0'))
      .replace(/[^0-9]/g, '')
  );

  return correct({ ...result, salePrice });
};

export const _skonoshopcom = (
  $: CheerioStatic,
  selector: InfoSelectors
): InfoResult => {
  const result = selectAll($, selector);

  const imageUrlStr = $(selector.imageUrl).html();
  const imageUrl = imageUrlStr.includes('<ul>')
    ? $('#lens_img').attr('src')
    : $(selector.imageUrl + ' > li > img').attr('src');

  return correct({ ...result, imageUrl: 'https://skonoshop.com' + imageUrl });
};

export const _guesskoreacom = (
  $: CheerioStatic,
  selector: InfoSelectors
): InfoResult => {
  const result = selectAll($, selector);

  return correct({
    ...result,
    brandKor: result.brandKor.slice(0, 2),
  });
};

export const _wooyoungmicom = (
  $: CheerioStatic,
  selector: InfoSelectors
): InfoResult => {
  const result = selectAll($, selector);

  return correct({
    ...result,
    name: result.name.split(',')[0],
  });
};

export const _shopmangocom = (
  $: CheerioStatic,
  selector: InfoSelectors
): InfoResult => {
  const result = selectAll($, selector);
  const scriptHtml = $(selector.salePrice).html();
  let search_text, start, end;

  search_text = '"originalPrice":';
  start = scriptHtml.indexOf(search_text) + search_text.length;
  end = scriptHtml.indexOf(',', start);
  const originalPrice = Number(scriptHtml.slice(start, end));

  search_text = '"salePrice":';
  start = scriptHtml.indexOf(search_text) + search_text.length;
  end = scriptHtml.indexOf(',', start);
  const salePrice = Number(scriptHtml.slice(start, end));

  return correct({
    ...result,
    name: result.name.split('-')[0].trim(),
    originalPrice,
    salePrice,
  });
};

export const _stylenandacom = (
  $: CheerioStatic,
  selector: InfoSelectors
): InfoResult => {
  const result = selectAll($, selector);

  return correct({
    ...result,
    name: result.name.split('#')[0].trim(),
  });
};

export const _stylelqcom = (
  $: CheerioStatic,
  selector: InfoSelectors
): InfoResult => {
  const result = selectAll($, selector);
  let originalPrice = Number(
    $(selector.originalPrice)
      .last()
      .text()
      .replace(/[^0-9]/g, '')
  );
  if (originalPrice === 0) {
    originalPrice = Number(
      $(
        'div.col.col-1-1-lg.col-1-2-xl.caption > div > div:nth-child(1) > div.col.desc'
      )
        .last()
        .text()
        .replace(/[^0-9]/g, '')
    );
  }
  return correct({
    ...result,
    name: result.name.slice(result.name.indexOf(']') + 1),
    originalPrice,
  });
};

export const _bottegavenetacom = (
  $: CheerioStatic,
  selector: InfoSelectors
): InfoResult => {
  const result = selectAll($, selector);

  return correct({
    ...result,
    name: result.name.split('-')[1].trim(),
  });
};

export const _etcseoulcom = (
  $: CheerioStatic,
  selector: InfoSelectors
): InfoResult => {
  const result = selectAll($, selector);
  // result.name이 '[brandName] name [color]' 인경우
  // parseValue에서 양쪽 []가 trim 되어 'brandName] name [color'만 남는다
  const splitIndex = result.name.indexOf(
    result.name[result.name.length - 1] === ']' ? '_' : ']'
  );

  return correct({
    ...result,
    brandKor: result.name.slice(0, splitIndex),
    name: result.name.slice(splitIndex + 1).trim(),
  });
};

export const _montblanccom = (
  $: CheerioStatic,
  selector: InfoSelectors
): InfoResult => {
  const result = selectAll($, selector);
  return correct({
    ...result,
    name: result.name.split('|')[0].trim(),
  });
};

export const _givenchycom = (
  $: CheerioStatic,
  selector: InfoSelectors
): InfoResult => {
  const result = selectAll($, selector);

  const scriptHtml = $('div.product-add-to-cart').html();
  let search_text, start, end;
  search_text = '"img":"';
  start = scriptHtml.indexOf(search_text) + search_text.length;
  end = scriptHtml.indexOf('"', start);
  const imageUrl = scriptHtml.slice(start, end);
  search_text = '"price":"';
  start = scriptHtml.indexOf(search_text) + search_text.length;
  end = scriptHtml.indexOf('"', start);
  const originalPrice = Number(scriptHtml.slice(start, end));
  const salePrice = Number(scriptHtml.slice(start, end)) || originalPrice;

  return correct({
    ...result,
    name: result.name.split('|')[0].trim(),
    imageUrl,
    originalPrice,
    salePrice,
  });
};

export const _monclercom = (
  $: CheerioStatic,
  selector: InfoSelectors
): InfoResult => {
  const result = selectAll($, selector);
  return correct({
    ...result,
    name: result.name.split('|')[0].trim(),
  });
};

export const _acnestudioscom = (
  $: CheerioStatic,
  selector: InfoSelectors
): InfoResult => {
  const result = selectAll($, selector);
  return correct({
    ...result,
    name: result.name.trim(),
  });
};

export const _stoneislandcom = (
  $: CheerioStatic,
  selector: InfoSelectors
): InfoResult => {
  const result = selectAll($, selector);
  return correct({
    ...result,
    name: result.name.split('Stone Island')[0].trim(),
  });
};

export const _alexandermcqueencom = (
  $: CheerioStatic,
  selector: InfoSelectors
): InfoResult => {
  const result = selectAll($, selector);
  return correct({
    ...result,
    name: result.name.split('|')[0].trim(),
  });
};

export const _diorcom = (
  $: CheerioStatic,
  selector: InfoSelectors
): InfoResult => {
  const result = selectAll($, selector);
  const scriptHtml = $(selector.originalPrice).html();
  const SEARCH_TEXT = '"price":';
  const start = scriptHtml.indexOf(SEARCH_TEXT) + SEARCH_TEXT.length;
  const end = scriptHtml.indexOf(',', start);
  const originalPrice = Number(scriptHtml.slice(start, end));

  return correct({
    ...result,
    name: result.name.split('-')[0].trim(),
    originalPrice,
  });
};

export const _shoptimberlandcokr = (
  $: CheerioStatic,
  selector: InfoSelectors
): InfoResult => {
  const result = selectAll($, selector);
  return correct({
    ...result,
    name: result.name.replace(' - Timberland', ''),
  });
};

export const _acha1com = (
  $: CheerioStatic,
  selector: InfoSelectors
): InfoResult => {
  const result = selectAll($, selector);
  return correct({
    ...result,
    name: result.name
      .slice(
        result.name.indexOf('%할인') >= 0
          ? result.name.indexOf('%할인') + 3 + 1
          : 0
      )
      .replace('[ACHA/아차]', ''),
  });
};

export const _coucoustorecom = (
  $: CheerioStatic,
  selector: InfoSelectors
): InfoResult => {
  const result = selectAll($, selector);
  const scriptHtml = $(selector.salePrice).html();
  const SEARCH_TEXT = '-&gt;';
  const start = scriptHtml.indexOf(SEARCH_TEXT) + SEARCH_TEXT.length;
  const end = scriptHtml.indexOf('&#xC6D0;', start);
  const salePrice = strToNumber(scriptHtml.slice(start, end));

  return correct({
    ...result,
    salePrice,
  });
};

export const _unalloyedkr = (
  $: CheerioStatic,
  selector: InfoSelectors
): InfoResult => {
  const result = selectAll($, selector);
  const scriptHtml = $(selector.name).html();
  const SEARCH_TEXT = '<span';
  const name = scriptHtml.includes(SEARCH_TEXT)
    ? scriptHtml.slice(0, scriptHtml.indexOf(SEARCH_TEXT))
    : scriptHtml;

  return correct({
    ...result,
    name,
  });
};

export const _iamshoponlinecom = (
  $: CheerioStatic,
  selector: InfoSelectors
): InfoResult => {
  const result = selectAll($, selector);

  const brandEng = result.name.slice(0, result.name.indexOf(':') - 1);

  return correct({
    ...result,
    name: result.name.slice(result.name.indexOf(':') + 1),
    brandKor: brandEng,
  });
};

export const _derobekr = (
  $: CheerioStatic,
  selector: InfoSelectors
): InfoResult => {
  const result = selectAll($, selector);
  return correct({
    ...result,
    name: result.name.replace('- 드로브 derobe 공식 온라인 스토어', ''),
  });
};

export const _glothescokr = (
  $: CheerioStatic,
  selector: InfoSelectors
): InfoResult => {
  const result = selectAll($, selector);

  return correct({
    ...result,
    name: result.name
      .slice(result.name.indexOf('.') + 1)
      .replace(' - 글로즈 스튜디오', ''),
  });
};

export const _ssolantcom = (
  $: CheerioStatic,
  selector: InfoSelectors
): InfoResult => {
  const result = selectAll($, selector);
  return correct({
    ...result,
    name: result.name.slice(result.name.indexOf(']') + 1),
  });
};

export const _filsonkoreacokr = (
  $: CheerioStatic,
  selector: InfoSelectors
): InfoResult => {
  const result = selectAll($, selector);
  return correct({
    ...result,
    imageUrl: 'http://www.filsonkorea.co.kr/shop/' + result.imageUrl.slice(3),
  });
};

export const _savagecokr = (
  $: CheerioStatic,
  selector: InfoSelectors
): InfoResult => {
  const result = selectAll($, selector);
  return correct({
    ...result,
    name: result.name.replace('(세비지)', ''),
  });
};

export const _hotsunglasscokr = (
  $: CheerioStatic,
  selector: InfoSelectors
): InfoResult => {
  const result = selectAll($, selector);
  return correct({
    ...result,
    brandKor: result.brandKor.replace(' - 핫선글라스', ''),
  });
};

export const _istyle24com = (
  $: CheerioStatic,
  selector: InfoSelectors
): InfoResult => {
  const result = selectAll($, selector);
  return correct({
    ...result,
    brandKor: $(
      '#product_total > div.product_wrap_top.clearfix > div.product-detail > div.product_brand > a'
    )
      .text()
      .replace('바로가기', ''),
  });
};

export const _patagoniacokr = (
  $: CheerioStatic,
  selector: InfoSelectors
): InfoResult => {
  const result = selectAll($, selector);
  return correct({
    ...result,
    imageUrl: 'http://www.patagonia.co.kr' + result.imageUrl,
  });
};

export const _varzarcom = (
  $: CheerioStatic,
  selector: InfoSelectors
): InfoResult => {
  const result = selectAll($, selector);
  return correct({
    ...result,
    name: result.name.replace('[바잘] ', ''),
  });
};

export const _layerstorekr = (
  $: CheerioStatic,
  selector: InfoSelectors
): InfoResult => {
  const result = selectAll($, selector);
  let brandKor = result.name.split(' ')[0];
  if (brandKor === 'LIFUL') brandKor = '라이풀';
  if (brandKor === 'KANCO') brandKor = '칸코';
  if (brandKor === 'FUZZ') brandKor = '퍼즈';

  return correct({
    ...result,
    brandKor,
  });
};

export const _byccokr = (
  $: CheerioStatic,
  selector: InfoSelectors
): InfoResult => {
  const result = selectAll($, selector);
  const txtCut = $('div.goods_tit > p.txtcut').text();

  return correct({
    ...result,
    name: (txtCut ? txtCut + ' ' : '') + result.name,
  });
};

export const _thesortiecom = (
  $: CheerioStatic,
  selector: InfoSelectors
): InfoResult => {
  const result = selectAll($, selector);

  const bodyHtml = $('body').html();
  const ORIGINAL_SEARCH_TEXT = '"prod_org_price":';
  const originalStart =
    bodyHtml.indexOf(ORIGINAL_SEARCH_TEXT) + ORIGINAL_SEARCH_TEXT.length;
  const originalEnd = bodyHtml.indexOf(',', originalStart);
  const originalPrice = Number(bodyHtml.slice(originalStart, originalEnd));

  const SALE_SEARCH_TEXT = '"prod_price":';
  const saleStart =
    bodyHtml.indexOf(SALE_SEARCH_TEXT) + SALE_SEARCH_TEXT.length;
  const saleEnd = bodyHtml.indexOf(',', saleStart);
  const salePrice = Number(bodyHtml.slice(saleStart, saleEnd));

  const images = selectImages(
    cheerio.load($('script#prodDetailPC').html()),
    'img',
    'data-original'
  );

  const isSoldout = $(selector.isSoldout).text().search('SOLDOUT') > -1;
  return correct({
    ...result,
    isSoldout,
    originalPrice,
    salePrice,
    images,
    name: result.name.replace('솔티 - ', '').split(':')[0],
  });
};

export const _deadendkrcafe24com = (
  $: CheerioStatic,
  selector: InfoSelectors
): InfoResult => {
  const result = selectAll($, selector);

  const origianlPriceText = $(selector.originalPrice).text();
  const originalPrice = Number(
    origianlPriceText
      .slice(0, origianlPriceText.indexOf('--->') + 1)
      .replace(/[^0-9]/g, '')
  );

  return correct({
    ...result,
    name: result.name.replace('솔티  - ', ''),
    originalPrice,
  });
};

export const _shopamoebaculturecom = (
  $: CheerioStatic,
  selector: InfoSelectors
): InfoResult => {
  const result = selectAll($, selector);
  return correct({
    ...result,
    imageUrl: 'http://shop.amoebaculture.com' + result.imageUrl,
  });
};

export const _fillikecom = (
  $: CheerioStatic,
  selector: InfoSelectors
): InfoResult => {
  const result = selectAll($, selector);

  return correct({
    ...result,
    name: result.name.replace(' : FILLIKE 필리케', ''),
  });
};

export const _hagokr = (
  $: CheerioStatic,
  selector: InfoSelectors
): InfoResult => {
  const result = selectAll($, selector);
  const brandKor = $(selector.brandKor).text();
  const originalPrice =
    result.originalPrice ||
    Number(
      $(
        '#frmView > div > div.info-block > div.item > ul > li:nth-child(1) > div > strong'
      )
        .text()
        .replace(/[^0-9]/g, '')
    );

  return correct({
    ...result,
    brandKor,
    originalPrice,
  });
};

export const _madgoatofficialcom = (
  $: CheerioStatic,
  selector: InfoSelectors
): InfoResult => {
  const result = selectAll($, selector);
  const scriptHtml = $(selector.originalPrice).html();

  const SEARCH_TEXT = 'name="price" value="';
  const start = scriptHtml.indexOf(SEARCH_TEXT) + SEARCH_TEXT.length;
  const end = scriptHtml.indexOf('"', start);
  const originalPrice = parseFloat(
    scriptHtml.slice(start, end).replace(/,/g, '')
  );
  return correct({
    ...result,
    originalPrice,
    imageUrl:
      'http://www.madgoat-official.com/shopimages/zzang6047/' +
      result.imageUrl +
      '3.jpg',
  });
};

export const _wuzustudiocom = (
  $: CheerioStatic,
  selector: InfoSelectors
): InfoResult => {
  const result = selectAll($, selector);

  const headHtml = $('head').html();
  const ORIGINAL_SEARCH_TEXT =
    '<meta property="product:price:amount" content="';
  const originalStart =
    headHtml.indexOf(ORIGINAL_SEARCH_TEXT) + ORIGINAL_SEARCH_TEXT.length;
  const originalEnd = headHtml.indexOf('" />', originalStart);
  const originalPrice = Number(headHtml.slice(originalStart, originalEnd));

  const SALE_SEARCH_TEXT =
    '<meta property="product:sale_price:amount" content="';
  const saleStart =
    headHtml.indexOf(SALE_SEARCH_TEXT) + SALE_SEARCH_TEXT.length;
  const saleEnd = headHtml.indexOf('" />', saleStart);
  const salePrice = Number(headHtml.slice(saleStart, saleEnd));

  const scriptHtml = $(selector.imageUrl).html();
  const SEARCH_TEXT = '<meta property="og:image" content="';
  const start = scriptHtml.indexOf(SEARCH_TEXT) + SEARCH_TEXT.length;
  const end = scriptHtml.indexOf('" />', start);
  const imageUrl = scriptHtml.slice(start, end);

  const isSoldout = $(selector.isSoldout).hasClass('displaynone');

  return correct({
    ...result,
    originalPrice,
    salePrice,
    imageUrl,
    isSoldout,
  });
};

export const _kingkr = (
  $: CheerioStatic,
  selector: InfoSelectors
): InfoResult => {
  const result = selectAll($, selector);
  const isSoldout = $(selector.isSoldout).hasClass('displaynone');

  return correct({
    ...result,
    name: (result.name.split('/')[1] || result.name).trim(),
    isSoldout,
  });
};

export const _costumeoclockcom = (
  $: CheerioStatic,
  selector: InfoSelectors,
  url: string
): InfoResult => {
  const result = selectAll($, selector);
  const [, categoryId] = url.match(/category\/(\d+)\//);
  const brandAlias = {
    66: '커스텀어클락',
    61: '세컨모놀로그',
    129: '몽돌',
  };
  return correct({
    ...result,
    brandKor: brandAlias[categoryId] ?? '커스텀어클락',
  });
};

export const _nodearchivecom = (
  $: CheerioStatic,
  selector: InfoSelectors
): InfoResult => {
  const result = selectAll($, selector);
  const images = [];
  $(selector.images)
    .find('img')
    .each((_, ele) => {
      images.push(ele.attribs.src || ele.attribs['ec-data-src']);
    });

  return correct({
    ...result,
    name: result.name.split('-')[0].trim(),
    images: images.map((image) => correctImageUrl(image, 'nodearchive.com')),
  });
};

export const _ourscopecokr = (
  $: CheerioStatic,
  selector: InfoSelectors
): InfoResult => {
  const result = selectAll($, selector);
  const images = [];
  $(selector.images)
    .find('img')
    .each((_, ele) => {
      images.push(ele.attribs.src || ele.attribs['ec-data-src']);
    });

  return correct({
    ...result,
    images: images.map((image) => correctImageUrl(image, 'ourscope.co.kr')),
  });
};

export const _mimthewardrobecom = (
  $: CheerioStatic,
  selector: InfoSelectors
): InfoResult => {
  const result = selectAll($, selector);
  const images = [];
  $(selector.images)
    .first()
    .find('img')
    .each((_, ele) => {
      images.push(ele.attribs.src || ele.attribs['ec-data-src']);
    });

  return correct({
    ...result,
    images: images.map((image) => correctImageUrl(image, 'mimthewardrobe.com')),
  });
};

export const _dgrecokr = (
  $: CheerioStatic,
  selector: InfoSelectors
): InfoResult => {
  const result = selectAll($, selector);
  let originalPrice = 0;
  const isSoldout = !$(selector.isSoldout).hasClass('hide');

  $(selector.originalPrice)
    .find('span.productPriceWithDiscountSpan')
    ?.each(
      (_, ele) =>
        (originalPrice = Number(ele.children[0].data.replace(/[^0-9]/g, '')))
    );

  $(selector.originalPrice)
    .find('span.productPriceSpan')
    ?.each(
      (_, ele) =>
        (originalPrice = Number(ele.children[0].data.replace(/[^0-9]/g, '')))
    );

  return correct({
    ...result,
    isSoldout,
    originalPrice,
  });
};

export const _esfaicokr = (
  $: CheerioStatic,
  selector: InfoSelectors
): InfoResult => {
  const result = selectAll($, selector);
  const images = [];
  let name;
  $(selector.images)
    .find('img')
    .each((_, ele) => {
      images.push(ele.attribs.src || ele.attribs['ec-data-src']);
    });

  if (result.name.search(']') > -1) {
    name = result.name.split(']')[1].trim();
  } else {
    name = result.name;
  }
  return correct({
    ...result,
    name,
    images: images.map((image) => correctImageUrl(image, 'esfai.co.kr')),
  });
};

export const _easestorecokr = (
  $: CheerioStatic,
  selector: InfoSelectors
): InfoResult => {
  const result = selectAll($, selector);
  const isSoldout = $(selector.isSoldout).hasClass('displaynone');

  return correct({
    ...result,
    isSoldout,
  });
};

export const _flareupcokr = (
  $: CheerioStatic,
  selector: InfoSelectors
): InfoResult => {
  const result = selectAll($, selector);
  const isSoldout = $(selector.isSoldout).hasClass('displaynone');

  return correct({
    ...result,
    isSoldout,
  });
};

export const _ojoskr = (
  $: CheerioStatic,
  selector: InfoSelectors
): InfoResult => {
  const result = selectAll($, selector);
  const isSoldout = !$(selector.isSoldout).hasClass('hide');
  return correct({
    ...result,
    isSoldout,
  });
};

export const _kutletshopcom = (
  $: CheerioStatic,
  selector: InfoSelectors
): InfoResult => {
  const result = selectAll($, selector);
  const isSoldout = !$(selector.isSoldout).hasClass('hide');
  return correct({
    ...result,
    isSoldout,
  });
};

export const _hyojicokr = (
  $: CheerioStatic,
  selector: InfoSelectors
): InfoResult => {
  const result = selectAll($, selector);
  const isSoldout = $(selector.isSoldout).text().search('품절') > -1;
  return correct({
    ...result,
    isSoldout,
    imageUrl: 'http://www.hyoji.co.kr' + result.imageUrl,
  });
};

export const _nomanualshopcom = (
  $: CheerioStatic,
  selector: InfoSelectors
): InfoResult => {
  const result = selectAll($, selector);
  const isSoldout = !$(selector.isSoldout).hasClass('hide');
  return correct({
    ...result,
    isSoldout,
  });
};

export const _inrowscokr = (
  $: CheerioStatic,
  selector: InfoSelectors
): InfoResult => {
  const result = selectAll($, selector);

  const salePriceStr = $(selector.salePrice).html();
  const salePrice = Number(
    salePriceStr
      .slice(
        salePriceStr.indexOf('</strike>') + 1,
        salePriceStr.indexOf('&#xA0')
      )
      .replace(/[^0-9]/g, '')
  );
  const isSoldout = $(selector.isSoldout).text().search('품절') > -1;

  return correct({
    ...result,
    imageUrl: 'http://www.inrows.co.kr' + result.imageUrl,
    salePrice,
    isSoldout,
  });
};

export const _13monthcom = (
  $: CheerioStatic,
  selector: InfoSelectors
): InfoResult => {
  const result = selectAll($, selector);

  const brandKor = result.images[0].includes('tmo')
    ? '티엠오바이써틴먼스'
    : '써틴먼스';
  const originalPrice = Number(
    parseValue($, 'originalPrice', 'strong#span_product_price_text')
  );

  return correct({
    ...result,
    brandKor,
    originalPrice: result.originalPrice || originalPrice,
    salePrice: result.salePrice || originalPrice,
  });
};

export const _chindownkr = (
  $: CheerioStatic,
  selector: InfoSelectors
): InfoResult => {
  const result = selectAll($, selector);
  const isSoldout = $(selector.isSoldout).hasClass('displaynone');

  return correct({
    ...result,
    isSoldout,
  });
};

export const _paulcorecokr = (
  $: CheerioStatic,
  selector: InfoSelectors
): InfoResult => {
  const result = selectAll($, selector);
  const salePriceText = $(selector.salePrice).text();
  const salePrice = Number(
    salePriceText
      .slice(0, salePriceText.indexOf('원') + 1)
      .replace(/[^0-9]/g, '')
  );
  return correct({
    ...result,
    salePrice,
  });
};

export const _maisonminedcom = (
  $: CheerioStatic,
  selector: InfoSelectors
): InfoResult => {
  const result = selectAll($, selector);
  const originalPrice = Number(
    parseValue($, 'originalPrice', 'span#span_product_price_custom')
  );
  const salePrice = Number(
    parseValue($, 'originalPrice', 'strong#span_product_price_text')
  );
  return correct({
    ...result,
    originalPrice: originalPrice || salePrice,
    salePrice: salePrice || result.salePrice,
  });
};

export const _namerclothingcom = (
  $: CheerioStatic,
  selector: InfoSelectors
): InfoResult => {
  const result = selectAll($, selector);
  const brandKor = result.name.includes('S.H.V.')
    ? '슬리퍼히트비디오'
    : '네이머클로딩';

  return correct({
    ...result,
    brandKor,
    name: result.name.replace('S.H.V. ', ''),
  });
};

export const _ohkooscom = (
  $: CheerioStatic,
  selector: InfoSelectors
): InfoResult => {
  const result = selectAll($, selector);
  const brandKor = result.brandKor === 'Big Union' ? '빅유니온' : '엠니';

  return correct({
    ...result,
    brandKor,
  });
};

export const _shop5ox2256cafe24com = (
  $: CheerioStatic,
  selector: InfoSelectors
): InfoResult => {
  const result = selectAll($, selector);
  const brandKor = $('meta[name="keywords"]')
    .attr('content')
    .toLowerCase()
    .includes('big union')
    ? '빅유니온'
    : '엠니';

  return correct({
    ...result,
    brandKor,
  });
};

export const _waze8690scafe24com = (
  $: CheerioStatic,
  selector: InfoSelectors
): InfoResult => {
  const result = selectAll($, selector);
  const isSoldout = !$(selector.isSoldout).hasClass('displaynone');
  return correct({
    ...result,
    isSoldout,
  });
};

export const _oohahhcokr = (
  $: CheerioStatic,
  selector: InfoSelectors
): InfoResult => {
  const result = selectAll($, selector);
  let { brandKor } = result;
  if (brandKor === 'Big Union') brandKor = '빅유니온';
  if (brandKor.includes('M.Nii')) brandKor = '엠니';
  const isSoldout = $(selector.isSoldout).attr('href').includes('OutOfStock');
  return correct({
    ...result,
    isSoldout,
  });
};

export const _charmskr = (
  $: CheerioStatic,
  selector: InfoSelectors
): InfoResult => {
  const result = selectAll($, selector);
  const isSoldout = $(selector.isSoldout).hasClass('displaynone');
  return correct({
    ...result,
    isSoldout,
  });
};

export const _mmglstorecom = (
  $: CheerioStatic,
  selector: InfoSelectors
): InfoResult => {
  const result = selectAll($, selector);

  const scriptHtml = $('#fbe_product_detail_script').html();
  const SEARCH_TEXT = `content_name: '`;
  const start = scriptHtml.indexOf(SEARCH_TEXT) + SEARCH_TEXT.length;
  const end = scriptHtml.indexOf(`',`, start);
  const name = scriptHtml.slice(start, end);

  return correct({
    ...result,
    name,
    images: result.images.slice(1),
  });
};

export const _edenmadecokr = (
  $: CheerioStatic,
  selector: InfoSelectors
): InfoResult => {
  const result = selectAll($, selector);

  return correct({
    ...result,
    isSoldout: $(selector.isSoldout).text().trim() === '품절',
  });
};

export const _msskr = (
  $: CheerioStatic,
  selector: InfoSelectors
): InfoResult => {
  const result = selectAll($, selector);
  result.brandKor.indexOf(')') + 1;
  const brandName = result.brandKor.slice(0, result.brandKor.indexOf(')') + 1);
  const name = result.name.replace(brandName, '').split('-')[0].trim();

  return correct({
    ...result,
    brandKor: brandName.split('(')[0],
    name,
  });
};

export const _oryanycokr = (
  $: CheerioStatic,
  selector: InfoSelectors
): InfoResult => {
  const result = selectAll($, selector);

  return correct({
    ...result,
    name: result.name.slice(
      result.name.indexOf('[') + 1,
      result.name.indexOf(']')
    ),
  });
};

export const _adlieloscom = (
  $: CheerioStatic,
  selector: InfoSelectors
): InfoResult => {
  const result = selectAll($, selector);

  return correct({
    ...result,
    isSoldout: $(selector.isSoldout).text() !== 'SOLD OUT',
  });
};

export const _brumancokr = (
  $: CheerioStatic,
  selector: InfoSelectors
): InfoResult => {
  const result = selectAll($, selector);

  return correct({
    ...result,
    isSoldout: $(selector.isSoldout).hasClass('displaynone'),
  });
};

export const _solidhommecom = (
  $: CheerioStatic,
  selector: InfoSelectors
): InfoResult => {
  const result = selectAll($, selector);

  return correct({
    ...result,
    name: result.name.replace(' - 솔리드옴므 공식 온라인 스토어', ''),
  });
};

export const _thehandsomecom = (
  $: CheerioStatic,
  selector: InfoSelectors
): InfoResult => {
  const result = selectAll($, selector);

  const brandKor =
    {
      'TIME HOMME': '타임옴므',
      'SYSTEM HOMME': '시스템옴므',
    }[result.brandKor] || result.brandKor;

  return correct({
    ...result,
    brandKor,
  });
};

export const _smartstorenavercom = (
  $: CheerioStatic,
  selector: InfoSelectors
): InfoResult => {
  const result = selectAll($, selector);
  const ldJsonObject = getLdJsonObject($);

  let [name, brandKor] = result.name.split(' : ');

  const isSoldout =
    $(selector.isSoldout).text().search('구매하실 수 없는') > -1;

  const images = [];
  const scriptHtml = $('body').html();
  const SEARCH_TEXT = `nmp.registerModule(nmp.front.sellershop.product.show.detail_info, {\n\t\tsAuthenticationType : \"NORMAL\",\n\t\tbSeOne : true,\n\t\tpcHtml : \"`;
  const start = scriptHtml.indexOf(SEARCH_TEXT) + SEARCH_TEXT.length;
  const end = scriptHtml.indexOf(`"\n    });`, start);
  const detail = cheerio.load(scriptHtml.slice(start, end), {
    decodeEntities: true,
  });
  detail('img').each((_, ele) => {
    const detailImageUrl = (
      ele.attribs.src || ele.attribs['ec-data-src']
    ).replace(/\"|\\/gi, '');
    images.push(detailImageUrl);
  });

  return correct({
    ...result,
    isSoldout,
    name,
    brandKor,
    images,
    salePrice: ldJsonObject.offers.price,
  });
};

export const _msmartstorenavercom = _smartstorenavercom;

export const _sculptorpagecom = (
  $: CheerioStatic,
  selector: InfoSelectors
): InfoResult => {
  const result = selectAll($, selector);
  const isSoldout = !$('div.xans-element-.xans-product.xans-product-action')
    .last()
    .hasClass('displaynone');

  return correct({
    ...result,
    isSoldout,
  });
};

export const _polyterustorecom = (
  $: CheerioStatic,
  selector: InfoSelectors
): InfoResult => {
  const result = selectAll($, selector);
  const isSoldout = !$('#shopProductCartErrorDiv').hasClass('hide');
  return correct({
    ...result,
    isSoldout,
  });
};

export const _showindowcokr = (
  $: CheerioStatic,
  selector: InfoSelectors
): InfoResult => {
  const result = selectAll($, selector);

  return correct({
    ...result,
    brandKor: result.brandKor.split('#').reverse()[0],
  });
};

export const _newbalancecom = (
  $: CheerioStatic,
  selector: InfoSelectors
): InfoResult => {
  const result = selectAll($, selector);
  return correct({
    ...result,
    imageUrl: $(selector.imageUrl).attr()['data-src'],
  });
};

export const _aecawhitecom = (
  $: CheerioStatic,
  selector: InfoSelectors
): InfoResult => {
  const result = selectAll($, selector);

  const salePrice = $(selector.salePrice)
    .html()
    ?.replace('&#x20A9;', '')
    .split('<span')[0]
    .trim();

  return correct({
    ...result,
    salePrice: strToNumber(salePrice) || result.originalPrice,
  });
};

export const _krburberrycom = (
  $: CheerioStatic,
  selector: InfoSelectors
): InfoResult => {
  const result = selectAll($, selector);

  const { name } = result;
  const nameLastIndex = Math.min(name.lastIndexOf('-'), name.lastIndexOf('|'));

  return correct({
    ...result,
    name: name.slice(0, nameLastIndex > 0 ? nameLastIndex : name.length),
  });
};

export const _applecom = (
  $: CheerioStatic,
  selector: InfoSelectors
): InfoResult => {
  const result = selectAll($, selector);

  const scriptHtml = $('head').html();
  const SEARCH_TEXT = `,"price":`;
  const start = scriptHtml.indexOf(SEARCH_TEXT) + SEARCH_TEXT.length;
  const end = scriptHtml.indexOf(`,`, start);
  const priceStr = scriptHtml.slice(start, end);
  const originalPrice = Number(priceStr.slice(0, priceStr.lastIndexOf('.')));

  return correct({
    ...result,
    name: result.name.replace('구입하기', ''),
    originalPrice,
  });
};

export const _beamscojp = (
  $: CheerioStatic,
  selector: InfoSelectors
): InfoResult => {
  const result = selectAll($, selector);

  return correct({
    ...result,
    originalPrice:
      result.originalPrice || strToNumber($('div.item-price').text()),
  });
};

export const _haharchivenet = (
  $: CheerioStatic,
  selector: InfoSelectors
): InfoResult => {
  const result = selectAll($, selector);

  return correct({
    ...result,
    isSoldout: !$(selector.isSoldout).hasClass('hide'),
  });
};

export const _agingccccom = (
  $: CheerioStatic,
  selector: InfoSelectors,
  url: string
): InfoResult => {
  const result = selectAll($, selector);

  const cateNo = new URLSearchParams('?' + url.split('?')[1]).get('cate_no');
  const brandKor =
    {
      208: '포이어',
      215: '야세',
      214: '에이징CCC',
    }[cateNo] || '에이징CCC';

  return correct({
    ...result,
    brandKor,
  });
};

export const _uniongarmentscokr = (
  $: CheerioStatic,
  selector: InfoSelectors
): InfoResult => {
  const result = selectAll($, selector);

  return correct({
    ...result,
    isSoldout: !result.isSoldout,
  });
};

export const _lotuffcokr = (
  $: CheerioStatic,
  selector: InfoSelectors
): InfoResult => {
  const result = selectAll($, selector);
  const isSoldout = $(selector.isSoldout).attr('alt') === '품절';

  return correct({
    ...result,
    name: result.name.split('|')[0],
    isSoldout,
  });
};

export const _blond9com = (
  $: CheerioStatic,
  selector: InfoSelectors
): InfoResult => {
  const result = selectAll($, selector);
  const isSoldout = $(selector.isSoldout).text().search('품절') > -1;

  return correct({
    ...result,
    name: result.name.split(',')[0].trim(),
    isSoldout,
  });
};

export const _ourlegacyse = (
  $: CheerioStatic,
  selector: InfoSelectors
): InfoResult => {
  const nextPageProps = getNextPageProps($);

  const { product } = nextPageProps.blocks[0].props;

  const {
    priceAsNumber: salePrice,
    priceBeforeDiscountAsNumber: originalPrice,
  } = Object.values(
    (Object.values(product.markets)[0] as any).pricelists
  )[0] as any;

  return correct({
    name: product.metaTitle,
    brandKor: '아워레가시',
    imageUrl: product.media.full[0],
    originalPrice,
    salePrice,
  });
};

export const _yooxcom = (
  $: CheerioStatic,
  selector: InfoSelectors
): InfoResult => {
  const result = selectAll($, selector);

  const isSoldout = $(selector.isSoldout).length > 0;

  return correct({
    ...result,
    isSoldout,
  });
};

export const _itempage3auctioncokr = (
  $: CheerioStatic,
  selector: InfoSelectors
): InfoResult => {
  const result = selectAll($, selector);

  return correct({
    ...result,
    name: result.name.replace(' - 옥션', ''),
  });
};

export const _kreamcokr = (
  $: CheerioStatic,
  selector: InfoSelectors
): InfoResult => {
  const result = selectAll($, selector);
  const splittedTitle = result.name.split('|');
  const salePrices = $('ul.select_list > li span.price')
    .toArray()
    .map((object) => strToNumber(object.children[0].data))
    .filter((price) => price !== 0);
  const salePrice =
    salePrices?.length > 0
      ? Math.min.apply(Math, salePrices)
      : strToNumber($('div.price > div.amount > span.num').text());
  const originalPrice = salePrice;

  return correct({
    ...result,
    name: splittedTitle[0].trim(),
    brandKor: splittedTitle[1].trim(),
    originalPrice,
    salePrice,
  });
};

export const _endclothingcom = (
  $: CheerioStatic,
  selector: InfoSelectors
): InfoResult => {
  const result = selectAll($, selector);
  const ldJsonObject = getLdJsonObject($, 2);

  const name = ldJsonObject.name;
  const brandKor = ldJsonObject.brand.name;

  return correct({
    ...result,
    name,
    brandKor,
  });
};

export const _worthwhilemovementcom = (
  $: CheerioStatic,
  selector: InfoSelectors
): InfoResult => {
  const result = selectAll($, selector);
  const ldJsonObject = getLdJsonObject($);

  const originalPrice = Number(ldJsonObject.offers.price);
  const isSoldout = !$(selector.isSoldout).hasClass('hide');

  return correct({
    ...result,
    originalPrice,
    salePrice: originalPrice,
    isSoldout,
  });
};

export const _buffalobootscom = (
  $: CheerioStatic,
  selector: InfoSelectors
): InfoResult => {
  const result = selectAll($, selector);
  const originalPrice = Number(
    $(selector.originalPrice)
      .text()
      .replace(/\,.+/, '')
      .replace(/[^0-9]/gi, '')
  );
  const salePrice = Number(
    $(selector.salePrice)
      .last()
      .text()
      .replace(/\,.+/, '')
      .replace(/[^0-9]/gi, '')
  );

  return correct({
    ...result,
    name: result.name.replace('Shop', '').split('|')[0],
    originalPrice,
    salePrice,
  });
};

export const _riseandbelowcom = (
  $: CheerioStatic,
  selector: InfoSelectors
): InfoResult => {
  const result = selectAll($, selector);

  return correct({
    ...result,
    images: [result.imageUrl],
  });
};

export const _niftydokr = (
  $: CheerioStatic,
  selector: InfoSelectors
): InfoResult => {
  const result = selectAll($, selector);

  const [brandEng, name] = result.name.split(']');
  const brandKor = brandEng.replace(/\[|\]/gi, '');

  return correct({
    ...result,
    name,
    brandKor,
    salePrice: strToNumber($(selector.salePrice).text().split('원')[0]),
  });
};

export const _kaneiteicom = (
  $: CheerioStatic,
  selector: InfoSelectors
): InfoResult => {
  const result = selectAll($, selector);
  const ldJsonObject = getLdJsonObject($);

  return correct({
    ...result,
    originalPrice: parseInt(ldJsonObject.offers.price),
  });
};

export const _longvacakr = (
  $: CheerioStatic,
  selector: InfoSelectors
): InfoResult => {
  const result = selectAll($, selector);
  const ldJsonObject = getLdJsonObject($);

  const originalPrice = Number(ldJsonObject.offers.price);

  const images = result.images.map(
    (image) => 'https://contents.sixshop.com' + image
  );

  $('#productDescriptionDetailPage img').each((_i, ele) => {
    images.push(ele.attribs['data-src']);
  });

  return correct({
    ...result,
    originalPrice,
    isSoldout: !$(selector.isSoldout)?.hasClass('hide'),
    images,
  });
};

export const _begin202com = (
  $: CheerioStatic,
  selector: InfoSelectors
): InfoResult => {
  const result = selectAll($, selector);

  return correct({
    ...result,
    imageUrl: 'https://begin202.com' + result.imageUrl,
  });
};

export const _lacostecom = (
  $: CheerioStatic,
  selector: InfoSelectors
): InfoResult => {
  const result = selectAll($, selector);
  const ldJsonObject = getLdJsonObject($, 1);

  return correct({
    ...result,
    salePrice: ldJsonObject.offers[0].price,
  });
};

export const _ocokoreacomshopMobile = (
  $: CheerioStatic,
  selector: InfoSelectors
): InfoResult => {
  const result = selectAll($, selector);

  const price = $(selector.originalPrice)
    .text()
    .split('\n')
    .filter((value) => value.trim())
    .map((value) => parseInt(value.trim().replace(',', '')));
  const originalPrice = price[0];
  const salePrice = price[1] || price[0];

  return correct({
    ...result,
    name: result.name.split('\n')[1]?.trim(),
    brandKor: $(selector.brandKor).text(),
    originalPrice,
    salePrice,
  });
};

export const _29cmcokr = async (
  _$: CheerioStatic,
  _selector: InfoSelectors,
  url: string
): Promise<InfoResult> => {
  const id = url.split('/').reverse()[0].split('?')[0];
  try {
    const result = await axios
      .get(`https://cache.29cm.co.kr/item/detail/${id}/`, {
        timeout: 30000,
      })
      .then((res) => res.data);

    return correct({
      name: result.item_name,
      brandKor: result.front_brand.brand_name_kor,
      imageUrl: 'https://img.29cm.co.kr' + result.item_images[0].image_url,
      originalPrice: result.sale_info[0].consumer_price,
      salePrice: result.sale_info[0].total_sale_price,
    });
  } catch (error) {
    console.log(error);
  }
};

export const _hivercokr = async (
  $: CheerioStatic,
  selector: InfoSelectors,
  url: string
): Promise<InfoResult> => {
  const AuthorizationToken = `3b17176f2eb5fdffb9bafdcc3e4bc192b013813caddccd0aad20c23ed272f076_1423639497`;
  const productId = url.split('/').reverse()[0].split('?')[0];
  try {
    const result = await axios
      .get(
        `https://capi.hiver.co.kr/v1/web/products/${productId}?service-type=hiver&res-type=section1`,
        {
          timeout: 30000,
          headers: {
            Authorization: AuthorizationToken,
          },
        }
      )
      .then((res) => res.data.data);

    return correct({
      name: result.name,
      brandKor: result.seller.name,
      imageUrl: result.image_thumbnail_url,
      originalPrice: result.price,
      salePrice: result.sale_price,
    });
  } catch (error) {
    console.log(error);
  }
};

export const _vacantkr = (
  $: CheerioStatic,
  selector: InfoSelectors
): InfoResult => {
  const result = selectAll($, selector);

  return correct({
    ...result,
    name: $(selector.name).first().attr().content,
    imageUrl: $(selector.imageUrl).first().attr().content,
  });
};

export const _mamagaricom = (
  $: CheerioStatic,
  selector: InfoSelectors,
  url: string
): InfoResult => {
  const result = selectAll($, selector);

  return correct({
    ...result,
    imageUrl: 'http://www.mamagari.com' + result.imageUrl,
  });
};

export const _hundredmakercom = (
  $: CheerioStatic,
  selector: InfoSelectors,
  url: string
): InfoResult => {
  const result = selectAll($, selector);

  return correct({
    ...result,
    brandKor: result.name.split(' ')[0],
  });
};

export const _samsonitecokr = (
  $: CheerioStatic,
  selector: InfoSelectors,
  url: string
): InfoResult => {
  const result = selectAll($, selector);
  const productName = $('.product-name').text();

  return correct({
    ...result,
    name: [result.name, productName].join(' '),
  });
};

export const _newcheapchicstore = (
  $: CheerioStatic,
  selector: InfoSelectors
): InfoResult => {
  const result = selectAll($, selector);
  const ldJsonObject = getLdJsonObject($);

  return correct({
    ...result,
    originalPrice: parseInt(ldJsonObject.offers.price),
  });
};

export const _thefabrickr = (
  $: CheerioStatic,
  selector: InfoSelectors
): InfoResult => {
  const result = selectAll($, selector);
  const ldJsonObject = getLdJsonObject($);

  return correct({
    ...result,
    originalPrice: parseInt(ldJsonObject.offers.price),
  });
};

export const _concepts1onecokr = (
  $: CheerioStatic,
  selector: InfoSelectors
): InfoResult => {
  const result = selectAll($, selector);

  const aTagText = $(selector.name).find('a').text();
  const name = $(selector.name).text().replace(aTagText, '');

  return correct({
    ...result,
    name,
  });
};

export const _danswercom = (
  $: CheerioStatic,
  selector: InfoSelectors
): InfoResult => {
  const result = selectAll($, selector);

  const imgEle = $('div.detail-img div.swiper-slide');

  const imageUrl =
    'https://d-answer.com/' +
    imgEle
      .attr()
      .style.replace("background-image:url('", '')
      .replace("');", '');

  return correct({
    ...result,
    imageUrl,
  });
};

export const _senseofnycom = (
  $: CheerioStatic,
  selector: InfoSelectors
): InfoResult => {
  const result = selectAll($, selector);

  const ldJsonObject = getLdJsonObject($);

  const brandKor = ldJsonObject.name.split(' ')[0];
  const name = ldJsonObject.name.replace(brandKor, '').trim();
  const originalPrice = ldJsonObject.offers.price;

  return correct({
    ...result,
    name,
    brandKor,
    originalPrice,
  });
};

export const _bylegacycokr = (
  $: CheerioStatic,
  selector: InfoSelectors
): InfoResult => {
  const result = selectAll($, selector);
  const images = result.images.filter((url) => !url.includes('washing'));

  return correct({
    ...result,
    images,
  });
};

export const _googongfastcom = (
  $: CheerioStatic,
  selector: InfoSelectors
): InfoResult => {
  const result = selectAll($, selector);

  return correct({
    ...result,
    name: result.name.replace(': 구공페스트', '').trim(),
  });
};

export const _krmoscotcom = async (
  $: CheerioStatic,
  selector: InfoSelectors
): Promise<InfoResult> => {
  const result = selectAll($, selector);

  const scriptHtml = $('head').html();
  const SEARCH_TEXT = `,"variants":[{"id":`;
  const start = scriptHtml.indexOf(SEARCH_TEXT) + SEARCH_TEXT.length;
  const end = scriptHtml.indexOf(`,"price":`, start);
  const variantId = scriptHtml.slice(start, end);

  const { data } = await axios.get(
    `https://api.flow.io/moscot/shopify/localized/variants/experience/republic-of-korea/map?country=KOR&limit=100&currency=KRW&variant_id[0]=${variantId}`,
    {
      timeout: 30000,
    }
  );

  return correct({
    ...result,
    originalPrice: data[variantId].prices.item.amount,
  });
};

export const _coorkr = (
  $: CheerioStatic,
  selector: InfoSelectors
): InfoResult => {
  const result = selectAll($, selector);

  return correct({
    ...result,
    imageUrl: result.imageUrl
      ? 'http://coor.kr' + result.imageUrl
      : $('meta[property="og:image"]').last().attr().content,
  });
};

export const _ourpascom = (
  $: CheerioStatic,
  selector: InfoSelectors
): InfoResult => {
  const result = selectAll($, selector);

  return correct({
    ...result,
    name: result.name.replace(': OURPAS', '').trim(),
  });
};

export const _combatcinemacokr = (
  $: CheerioStatic,
  selector: InfoSelectors
): InfoResult => {
  const result = selectAll($, selector);

  return correct({
    ...result,
    imageUrl: 'https://combatcinema.co.kr' + result.imageUrl,
  });
};

export const _freitagch = (
  $: CheerioStatic,
  selector: InfoSelectors
): InfoResult => {
  const result = selectAll($, selector);
  const name = result.name.split('|')[0];

  const scriptHtml = $(
    '#block-freitag-content > article > section:nth-child(2)'
  ).html();

  const SEARCH_TEXT = 'cover":["';
  const start = scriptHtml.indexOf(SEARCH_TEXT) + SEARCH_TEXT.length;
  const end = scriptHtml.indexOf('"', start);
  const coverId = scriptHtml.slice(start, end);

  const imageUrl =
    'https://freitag.rokka.io/freitag_944_944_focal_scale_crop/' +
    coverId +
    '.jpg';

  return correct({
    ...result,
    name,
    imageUrl,
  });
};

export const _sivillagecom = (
  $: CheerioStatic,
  selector: InfoSelectors
): InfoResult => {
  const result = selectAll($, selector);

  const nameStr = result.name.replace(/\[|-/, '').trim();
  const [brandKor, name] = nameStr.split(']');

  const opHtml = $(selector.originalPrice).html();
  const spHtml = $(selector.salePrice).html();

  return correct({
    ...result,
    name,
    brandKor,
    originalPrice: strToNumber(opHtml?.slice(0, opHtml.indexOf('<em'))),
    salePrice: strToNumber(spHtml?.slice(0, spHtml.indexOf('<em'))),
  });
};

export const _obscurastorecom = (
  $: CheerioStatic,
  selector: InfoSelectors
): InfoResult => {
  const result = selectAll($, selector);

  return correct({
    ...result,
    name: result.name.replace('| 옵스큐라 스토어', '').trim(),
  });
};

export const _mamagaricomm = (
  $: CheerioStatic,
  selector: InfoSelectors
): InfoResult => {
  const result = selectAll($, selector);

  return correct({
    ...result,
    imageUrl: 'http://mamagari.com' + result.imageUrl,
  });
};

export const _dwstorecokr = (
  $: CheerioStatic,
  selector: InfoSelectors
): InfoResult => {
  const result = selectAll($, selector);

  const originalPrice =
    result.originalPrice > 0
      ? result.originalPrice
      : strToNumber($('#shopProductPrice > span.productPriceSpan').text());

  return correct({
    ...result,
    originalPrice,
  });
};

export const _vdrstorecom = (
  $: CheerioStatic,
  selector: InfoSelectors
): InfoResult => {
  const result = selectAll($, selector);

  return correct({
    ...result,
    isSoldout: $(selector.isSoldout)?.text() === 'SOLD OUT',
  });
};

export const _uttutcom = (
  $: CheerioStatic,
  selector: InfoSelectors
): InfoResult => {
  const result = selectAll($, selector);

  return correct({
    ...result,
    name: result.name.replace(': UTTUT 어텃', '').trim(),
  });
};

export const _insonlinestorecom = (
  $: CheerioStatic,
  selector: InfoSelectors
): InfoResult => {
  const result = selectAll($, selector);

  const name = result.name.split('|')[0].split(']');

  return correct({
    ...result,
    name: name[1].trim(),
    brandKor: name[0],
  });
};

export const _iterpeoplecom = (
  $: CheerioStatic,
  selector: InfoSelectors
): InfoResult => {
  const result = selectAll($, selector);
  const ldJsonObject = getLdJsonObject($);

  const originalPrice = strToNumber(ldJsonObject.offers.price);

  return correct({
    ...result,
    originalPrice,
  });
};

export const _nocluecokr = (
  $: CheerioStatic,
  selector: InfoSelectors
): InfoResult => {
  const result = selectAll($, selector);
  const ldJsonObject = getLdJsonObject($);

  const originalPrice = strToNumber(ldJsonObject.offers.price);

  return correct({
    ...result,
    originalPrice,
  });
};

// price currency: SEK
export const _soundslifekr = (
  $: CheerioStatic,
  selector: InfoSelectors
): InfoResult => {
  const result = selectAll($, selector);

  return correct({
    ...result,
    name: result.name.split('|')[1].trim(),
  });
};

export const _layerunionnet = (
  $: CheerioStatic,
  selector: InfoSelectors
): InfoResult => {
  const result = selectAll($, selector);

  return correct({
    ...result,
    imageUrl: 'http://www.layerunion.net' + result.imageUrl,
  });
};

export const _ladyvolumecom = (
  $: CheerioStatic,
  selector: InfoSelectors,
  url: string
): InfoResult => {
  const result = selectAll($, selector);

  const ladyCategories = [24, 25, 26, 27, 57, 58, 59, 60, 62, 72, 73, 84];

  const category = Number(url.match(/(?<=category\/)(\d+)/)[0]);

  const brandKor = ladyCategories.includes(category) ? '레이디볼륨' : '브이투';

  return correct({
    ...result,
    brandKor,
    images: result.images.filter(
      (imageUrl) => !imageUrl?.match(/\/(txt|btn|ico)/g)
    ),
  });
};

export const _v2koreacokr = _ladyvolumecom;

export const _ieycokr = (
  $: CheerioStatic,
  selector: InfoSelectors
): InfoResult => {
  const result = selectAll($, selector);

  return correct({
    ...result,
    name: result.name.replace('IEY 이에이', '').trim(),
  });
};

export const _yohannrehandcom = (
  $: CheerioStatic,
  selector: InfoSelectors
): InfoResult => {
  const result = selectAll($, selector);

  return correct({
    ...result,
    imageUrl: 'http://www.yohannrehand.com/' + result.imageUrl,
  });
};

export const _fairplay142com = (
  $: CheerioStatic,
  selector: InfoSelectors
): InfoResult => {
  const result = selectAll($, selector);

  return correct({
    ...result,
    imageUrl: 'http://fairplay142.com' + result.imageUrl,
  });
};

export const _oldlaundrycokr = ($: CheerioStatic): InfoResult => {
  const ldJsonObject = getLdJsonObject($);
  const { name, image: imageUrl, brand, offers } = ldJsonObject;
  const originalPrice = strToNumber(offers.price);
  const salePrice = originalPrice;

  return correct({
    name,
    imageUrl,
    brandKor: brand,
    originalPrice,
    salePrice,
  });
};

export const _hangleeyewearcom = ($: CheerioStatic): InfoResult => {
  const ldJsonObject = getLdJsonObject($);
  const { name, image: imageUrl, offers } = ldJsonObject;
  const originalPrice = parseInt(offers.price);
  const salePrice = strToNumber(
    $('span.productDiscountPriceSpan').text().split(' ')[0]
  );

  return correct({
    name,
    imageUrl,
    brandKor: '한글안경',
    originalPrice,
    salePrice,
  });
};

export const _demilmfgcom = ($: CheerioStatic): InfoResult => {
  const ldJsonObject = getLdJsonObject($, 1);
  const { name, image: imageUrl, offers } = ldJsonObject['@graph'][1];
  const originalPrice = strToNumber(offers[0].price);
  const salePrice = originalPrice;

  return correct({
    name,
    imageUrl,
    brandKor: '데밀',
    originalPrice,
    salePrice,
  });
};

export const _gonakcokr = ($: CheerioStatic): InfoResult => {
  const ldJsonObject = getLdJsonObject($);
  const { name, image: imageUrl, brand, offers } = ldJsonObject;
  const originalPrice = strToNumber(offers.price);
  const salePrice =
    strToNumber($('span.productDiscountPriceSpan').text().split(' ')[0]) ||
    originalPrice;

  return correct({
    name,
    imageUrl,
    brandKor: brand,
    originalPrice,
    salePrice,
  });
};

export const _jdsportscokr = (
  $: CheerioStatic,
  selector: InfoSelectors
): InfoResult => {
  const result = selectAll($, selector);

  const splitedName = result.name.split(']');
  const name = splitedName[1];
  const brandKor = splitedName[0].replace(/\[|\]/gi, '');

  return correct({
    ...result,
    name,
    brandKor,
  });
};

export const _reebonzcokr = (
  $: CheerioStatic,
  selector: InfoSelectors
): InfoResult => {
  const result = selectAll($, selector);

  const brandKor = result.brandKor.split('\n')[0];

  return correct({
    ...result,
    brandKor,
  });
};

export const _wonderwallkr = async (
  $: CheerioStatic,
  selector: InfoSelectors,
  url: string
): Promise<InfoResult> => {
  const result = selectAll($, selector);

  const urlSplittedList = url.split('/');
  const itemId = urlSplittedList[urlSplittedList.length - 1];
  const { originalPrice, price: salePrice } = await axios
    .get(`https://api.wonderwall.kr/v2/goods/${itemId}`)
    .then((res) => res.data.data);

  return correct({
    ...result,
    originalPrice,
    salePrice,
  });
};

export const _balaancokr = async (
  _$: CheerioStatic,
  _selector: InfoSelectors,
  url: string
): Promise<InfoResult> => {
  const SEARCH_TEXT = 'goodsno=';
  const start = url.indexOf(SEARCH_TEXT) + SEARCH_TEXT.length;
  const end = url.indexOf('&', start);
  const itemId = url.slice(start, end !== -1 ? end : undefined);

  const {
    goodsnm: name,
    brand: { kr_name: brandKor },
    img_i: imageUrl,
    consumer: originalPrice,
    price: salePrice,
  } = await axios
    .get(`https://api.balaan.co.kr/v1/goods/recent?goodsnoString=${itemId}`)
    .then((res) => res.data.data?.[itemId]);

  return correct({
    name,
    brandKor,
    imageUrl,
    originalPrice,
    salePrice,
  });
};

export const _thombrownecom = async (
  _$: CheerioStatic,
  _selector: InfoSelectors,
  url: string
): Promise<InfoResult> => {
  const urlSplittedList = url.split('/');
  const itemIdList = url.split('/')[urlSplittedList.length - 1].split('-');
  const itemId = itemIdList[itemIdList.length - 1] || 13010095;

  const {
    result: { shortDescription: name },
    imageGroups,
    price: { formattedPriceWithoutCurrency },
  } = await axios
    .get(`https://www.thombrowne.com/kr/api/products/${itemId}`)
    .then((res) => res.data);

  const imageUrl = imageGroups[0].images.find(
    ({ size }) => size >= parseInt('800')
  ).url;

  const originalPrice = strToNumber(formattedPriceWithoutCurrency);

  return correct({
    name,
    brandKor: '톰브라운',
    imageUrl,
    originalPrice,
    salePrice: originalPrice,
  });
};

export const _mainstancecokr = (
  $: CheerioStatic,
  selector: InfoSelectors,
  url: string
): InfoResult => {
  const result = selectAll($, selector);

  const brandEng = url.match(/(\w+)-shop/i)[1];
  const brandKor =
    {
      IFELSE: '이프엘스',
      YELLOWCORVINA: '옐로우코비나',
      ACROSSTHEUNIVERSE: '어크로스 더 유니버스',
      AIRE: '아이레',
    }[brandEng] || brandEng;

  const images$ = cheerio.load($(selector.images).html());
  const images = [];
  images$('img').each((_i, ele) => {
    images.push(ele.attribs['data-original']);
  });

  return correct({
    ...result,
    brandKor,
    images,
  });
};

export const _anecdotecokr = (
  $: CheerioStatic,
  selector: InfoSelectors
): InfoResult => {
  const result = selectAll($, selector);

  return correct({
    ...result,
    name: result.name.split(',')[0],
  });
};

export const _brandnavercomralphlauren = ($: CheerioStatic): InfoResult => {
  const ldJsonObject = getLdJsonObject($);
  const { name, image: imageUrl, offers } = ldJsonObject;
  const originalPrice = parseInt(offers.price);
  const salePrice = originalPrice;

  return correct({
    name,
    imageUrl,
    brandKor: '폴로 랄프로렌',
    originalPrice,
    salePrice,
  });
};

export const _unboncokr = (
  $: CheerioStatic,
  selector: InfoSelectors
): InfoResult => {
  const result = selectAll($, selector);

  const scriptHtml = $('body').html();

  const SEARCH_TEXT = "var product_name = '";
  const start = scriptHtml.indexOf(SEARCH_TEXT) + SEARCH_TEXT.length;
  const end = scriptHtml.indexOf("';", start);
  const name = scriptHtml.slice(start, end);

  return correct({
    ...result,
    name,
  });
};

export const _hiphopercom = async (
  $: CheerioStatic,
  selector: InfoSelectors,
  url: string
): Promise<InfoResult> => {
  const itemCode = url.match(/\/item\/(\w+)/)[1];
  const {
    it_name: name,
    br_name: brandKor,
    it_img1: imageUrl,
    it_price: originalPrice,
    it_sale_price: salePrice,
    it_explain,
  } = await axios
    .get(`https://shop-api.hiphoper.io/shop/api/item/${itemCode}`)
    .then((res) => res.data.dataList.itemInfo);

  const images$ = cheerio.load(it_explain);
  const images = [];
  images$('img').each((_i, ele) => {
    images.push(ele.attribs['src']);
  });

  return correct({
    name,
    brandKor,
    imageUrl,
    originalPrice,
    salePrice,
    images,
  });
};

export const _bbybstorecom = (
  $: CheerioStatic,
  selector: InfoSelectors
): InfoResult => {
  const result = selectAll($, selector);
  const name = result.name.split('|')[0].trim();

  return correct({
    ...result,
    name,
  });
};

export const _oomstudiocokr = (
  $: CheerioStatic,
  selector: InfoSelectors
): InfoResult => {
  const result = selectAll($, selector);
  const name = result.name.split('|')[0].trim();

  return correct({
    ...result,
    imageUrl: result.images[0],
    name,
  });
};

export const _apartfromthatstorecom = (
  $: CheerioStatic,
  selector: InfoSelectors
): InfoResult => {
  const result = selectAll($, selector);

  return correct({
    ...result,
    name: result.name.replace('- apart from that', '').trim(),
  });
};

export const _shoppingnavercom = (
  $: CheerioStatic,
  _: InfoSelectors
): InfoResult => {
  const ldJsonObject = getLdJsonObject($);
  const {
    name,
    image: imageUrl,
    description: brandKor,
    offers: { price: salePrice },
  } = ldJsonObject;
  const scriptHtml = $('body').html();
  const SEARCH_TEXT = 'window.__PRELOADED_STATE__=';
  const start = scriptHtml.indexOf(SEARCH_TEXT) + SEARCH_TEXT.length;
  const end = scriptHtml.indexOf('</script>', start);
  const state = scriptHtml.slice(start, end);
  const originalPrice = JSON.parse(state).product.A.windowProduct.salePrice;

  return correct({
    name,
    brandKor,
    imageUrl,
    originalPrice: originalPrice ?? salePrice,
    salePrice,
  });
};

export const _gachiofficialcom = (
  $: CheerioStatic,
  selector: InfoSelectors
): InfoResult => {
  const result = selectAll($, selector);

  return correct({
    ...result,
    name: result.name.split('|')[0].split('>')[0],
  });
};

export const _okmallcom = (
  $: CheerioStatic,
  selector: InfoSelectors
): InfoResult => {
  const result = selectAll($, selector);
  const imageUrl = $(selector.imageUrl)[0].attribs.content;

  return correct({
    ...result,
    imageUrl: 'http:' + imageUrl,
  });
};

export const _licflocom = (
  $: CheerioStatic,
  selector: InfoSelectors
): InfoResult => {
  const result = selectAll($, selector);

  return correct({
    ...result,
    name: result.name.split(':')[0].trim(),
    brandKor: '릭플로',
  });
};

export const _yslcom = ($: CheerioStatic, _: InfoSelectors): InfoResult => {
  const ldJsonObject = getLdJsonObject($);
  const {
    name,
    image: imageUrl,
    offers: { price },
    brand: { slogan: brandKor },
  } = ldJsonObject;
  const salePrice = strToNumber(price);

  return correct({
    name,
    brandKor,
    imageUrl,
    originalPrice: salePrice,
    salePrice,
  });
};

export const _ffaicokr = async (
  $: CheerioStatic,
  selector: InfoSelectors
): Promise<InfoResult> => {
  const { originalPrice } = selectAll($, selector);
  const ldJsonObject = getLdJsonObject($);
  const {
    name,
    image,
    offers: { price: salePrice },
    brand: { name: brandKor },
  } = ldJsonObject;
  const imageshtml = $('#prodDetailPC').html();
  const _$ = await getCheerio(imageshtml, '');
  const images = _$('img')
    .toArray()
    .map((element) => element.attribs['data-original']);

  return correct({
    name,
    brandKor,
    imageUrl: image[0],
    originalPrice: originalPrice ?? salePrice,
    salePrice,
    images,
  });
};

export const _frogworldcokr = async (
  $: CheerioStatic,
  selector: InfoSelectors,
  url: string
): Promise<InfoResult> => {
  const productCode = url.match(/\/product\/(\d+)/)[1];
  const {
    data: {
      data: { name, brandName: brandKor, imageUrl, lowestPrice },
    },
  } = await axios.get(
    `https://v2-frog-api-prod.frogbyhinter.com/product/${productCode}`
  );

  return {
    name,
    brandKor,
    imageUrl,
    originalPrice: lowestPrice,
    salePrice: lowestPrice,
  };
};

export const _japangadacom = (
  $: CheerioStatic,
  selector: InfoSelectors
): InfoResult => {
  const result = selectAll($, selector);

  return correct({
    ...result,
    brandKor: result.brandKor.split('(')[0].trim(),
  });
};

export const _ssfshopcom = (
  $: CheerioStatic,
  selector: InfoSelectors
): InfoResult => {
  const result = selectAll($, selector);
  const priceList = $('div.tag > div.price > em')
    .text()
    .trim()
    .split(/ | |\n/);
  const salePrice = strToNumber(priceList[0]);
  const originalPrice = strToNumber(priceList[1] ?? priceList[0]);
  let images = [];
  $('div.product_view img, div.detail_view img').map((_, element) => {
    images.push('http:' + element.attribs['data-original']);
  });
  const isSoldout = $(selector.isSoldout).text().includes('품절');

  return correct({
    ...result,
    originalPrice,
    salePrice,
    images,
    isSoldout,
  });
};

export const _glpkthesouvenirshopcom = (
  $: CheerioStatic,
  selector: InfoSelectors
): InfoResult => {
  const result = selectAll($, selector);

  return { ...result };
};

export const _glamoodcom = (
  $: CheerioStatic,
  selector: InfoSelectors
): InfoResult => {
  const result = selectAll($, selector);

  const splitIndex = result.brandKor.indexOf(' ');
  const brandKor = result.brandKor.slice(0, splitIndex);
  const name = result.brandKor
    .slice(splitIndex + 1)
    .replace('- Glamood Outlet', '')
    .trim();

  const imageUrl = $(selector.imageUrl).attr()['data-src'];

  return { ...result, brandKor, name, imageUrl };
};

export const _minjukimco = (
  $: CheerioStatic,
  selector: InfoSelectors
): InfoResult => {
  const result = selectAll($, selector);

  return { ...result, name: result.name.replace('— MINJUKIM', '').trim() };
};

export const _hazzyscom = (
  $: CheerioStatic,
  selector: InfoSelectors
): InfoResult => {
  const result = selectAll($, selector);

  return { ...result, imageUrl: result.imageUrl.split('?')[0] };
};

export const _themuseumvisitorcom = (
  $: CheerioStatic,
  selector: InfoSelectors
): InfoResult => {
  const result = selectAll($, selector);
  const ldJsonObject = getLdJsonObject($);

  return {
    ...result,
    name: ldJsonObject.name,
    salePrice: ldJsonObject.offers.price,
  };
};

export const _laserbimcom = (
  $: CheerioStatic,
  selector: InfoSelectors
): InfoResult => {
  const result = selectAll($, selector);
  const startIdx = result.name.indexOf('[');
  const name = result.name.slice(startIdx + 1, result.name.length - 1);

  return {
    ...result,
    name,
  };
};

export const _shopvanscokr = (
  $: CheerioStatic,
  selector: InfoSelectors
): InfoResult => {
  const result = selectAll($, selector);
  const name = $(selector.name).attr('data-name');
  const originalPrice = $(selector.originalPrice).attr('data-price');

  return {
    ...result,
    name,
    originalPrice: parseInt(originalPrice),
  };
};
