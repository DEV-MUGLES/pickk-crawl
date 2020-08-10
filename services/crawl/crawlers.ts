import { ISelecter } from "interfaces/ISelecter";
import { parseValue, selectAll, correct, strToNumber } from "../../lib";
import { CrawlResult } from "../../types/Crawl";
import { correctImageUrl } from ".";

export const _storemusinsacom = (
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
      .replace(/[^0-9]/g, "")
  );
  const salePrice = $(selecter.salePrice).html()
    ? Number(
        $(selecter.salePrice)
          .last()
          .text()
          .replace(/[^0-9]/g, "")
      )
    : originalPrice;

  return {
    name: name.slice(name.indexOf(") ") + 2, name.indexOf(" - ")),
    brandKor: brandKor.slice(0, brandKor.indexOf("(")),
    imageUrl,
    originalPrice,
    salePrice,
  };
};

export const _mstoremusinsacom = _storemusinsacom;

export const _espionagecokr = (
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

export const _noirlarmescokr = (
  $: CheerioStatic,
  selecter: ISelecter
): CrawlResult => {
  const result = selectAll($, selecter);
  const myPrice = Number(parseValue($, "originalPrice", "p.price > span"));

  return {
    ...result,
    originalPrice: result.originalPrice || myPrice,
    salePrice: result.salePrice || myPrice,
  };
};

export const _conversecokr = (
  $: CheerioStatic,
  selecter: ISelecter
): CrawlResult => {
  const result = selectAll($, selecter);
  const myPrice = Number(
    parseValue($, "originalPrice", "p.product-price > span")
  );

  return {
    ...result,
    originalPrice: result.originalPrice || myPrice,
    salePrice: result.salePrice || myPrice,
  };
};

export const _zavanascom = (
  $: CheerioStatic,
  selecter: ISelecter
): CrawlResult => {
  const result = selectAll($, selecter);
  const myPrice = Number(
    parseValue(
      $,
      "originalPrice",
      "div.table-opt > table > tbody > tr:nth-child(1) > td > div"
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

export const _placofficialcom = (
  $: CheerioStatic,
  selecter: ISelecter
): CrawlResult => {
  const result = selectAll($, selecter);

  return {
    ...result,
    imageUrl: "https://plac-official.com/" + result.imageUrl,
  };
};

export const _giordanocokr = (
  $: CheerioStatic,
  selecter: ISelecter
): CrawlResult => {
  const result = selectAll($, selecter);

  return correct({
    ...result,
    name: result.name.slice(0, result.name.length - 6),
  });
};

export const _spaoelandmallcom = (
  $: CheerioStatic,
  selecter: ISelecter
): CrawlResult => {
  const result = selectAll($, selecter);

  return correct({
    ...result,
    imageUrl:
      result.imageUrl ||
      "https:" + (parseValue($, "imageUrl", "#d_elevate_img") as string),
  });
};

export const _shoopenelandmallcom = (
  $: CheerioStatic,
  selecter: ISelecter
): CrawlResult => {
  const result = selectAll($, selecter);

  return correct({
    ...result,
    imageUrl:
      result.imageUrl ||
      "https:" + (parseValue($, "imageUrl", "#d_elevate_img") as string),
  });
};

export const _wconceptcokr = (
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

export const _lfmallcokr = (
  $: CheerioStatic,
  selecter: ISelecter
): CrawlResult => {
  const result = selectAll($, selecter);

  return correct({
    ...result,
    brandKor: result.brandKor.slice(1, result.brandKor.indexOf("]")),
  });
};

export const _www2hmcom = (
  $: CheerioStatic,
  selecter: ISelecter
): CrawlResult => {
  const result = selectAll($, selecter);

  const scriptHtml = $(selecter.originalPrice).html();

  const SEARCH_TEXT = "product_original_price : [";
  const start = scriptHtml.indexOf(SEARCH_TEXT) + SEARCH_TEXT.length;
  const end = scriptHtml.indexOf(".", start);
  const originalPrice = strToNumber(scriptHtml.slice(start, end));

  return correct({
    ...result,
    originalPrice,
  });
};

export const _romanticpiratescom = (
  $: CheerioStatic,
  selecter: ISelecter
): CrawlResult => {
  const result = selectAll($, selecter);

  return {
    ...result,
    imageUrl: "https://romanticpirates.com/" + result.imageUrl,
  };
};

export const _jemutshopcom = (
  $: CheerioStatic,
  selecter: ISelecter
): CrawlResult => {
  const result = selectAll($, selecter);

  return {
    ...result,
    imageUrl: "https://www.jemutshop.com/" + result.imageUrl,
  };
};

export const _beslowcokr = (
  $: CheerioStatic,
  selecter: ISelecter
): CrawlResult => {
  const result = selectAll($, selecter);
  const myPrice = Number(
    parseValue($, "originalPrice", "div.detail-price >  span:nth-child(1)")
  );

  let brandKor = result.brandKor;
  if (brandKor === "BESLOW STANDARD") brandKor = "비슬로우 스탠다드";
  if (brandKor === "DIMITRI BLACK") brandKor = "디미트리 블랙";
  if (brandKor === "OUTSTANDING") brandKor = "아웃스탠딩";
  if (brandKor === "Ramolin") brandKor = "라모랭";
  if (brandKor === "FRIZM WORKS") brandKor = "프리즘웍스";
  if (brandKor === "BESLOW PURPLE") brandKor = "비슬로우 퍼플";
  if (brandKor === "BESLOW ORIGINALS") brandKor = "비슬로우 오리지널스";
  if (brandKor === "SHOOPEN X BESLOW") brandKor = "슈펜 X 비슬로우";
  if (brandKor === "THE RESQ") brandKor = "더레스큐";
  if (brandKor === "VANONE") brandKor = "반원";
  if (brandKor === "MOAA") brandKor = "모아";
  if (brandKor === "MAGOODGAN") brandKor = "맥우드건";
  if (brandKor === "MONOFLOW") brandKor = "모노플로우";
  if (brandKor === "node archive") brandKor = "노드 아카이브";
  if (brandKor === "MOAA") brandKor = "모아";
  if (brandKor === "MOAA") brandKor = "모아";

  return correct({
    ...result,
    imageUrl: $(selecter.imageUrl).attr()["data-src"],
    originalPrice: result.originalPrice || myPrice,
    brandKor,
  });
};

export const _stussycokr = (
  $: CheerioStatic,
  selecter: ISelecter
): CrawlResult => {
  const result = selectAll($, selecter);

  return correct({
    ...result,
    imageUrl: $(selecter.imageUrl).attr()["data-lazy"],
  });
};

export const _barrelscokr = (
  $: CheerioStatic,
  selecter: ISelecter
): CrawlResult => {
  const result = selectAll($, selecter);

  const name = result.name.slice(result.name.indexOf("]") + 2);
  const brandKor = result.brandKor.slice(1, result.name.indexOf("]"));

  return correct({
    ...result,
    name,
    brandKor,
    imageUrl: "http://www.barrels.co.kr" + result.imageUrl,
  });
};

export const _underarmourcokr = (
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

export const _thenorthfacekoreacokr = (
  $: CheerioStatic,
  selecter: ISelecter
): CrawlResult => {
  const result = selectAll($, selecter);

  const name = result.name.slice(0, result.name.length - 8);
  const imageUrl = result.imageUrl.replace("?thumbnail", "");

  return correct({
    ...result,
    name,
    imageUrl,
  });
};

export const _shopadidascokr = (
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

export const _zaracom = (
  $: CheerioStatic,
  selecter: ISelecter
): CrawlResult => {
  const result = selectAll($, selecter);

  let scriptHtml;
  $(selecter.originalPrice).each((i, e) => {
    if (e?.children[0]?.data !== undefined) {
      if (e.children[0].data.indexOf("price") > -1) {
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

  if (scriptHtml[saleEnd + 1] === "o") {
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
  selecter: ISelecter
): CrawlResult => {
  const result = selectAll($, selecter);

  const scriptHtml = $(selecter.originalPrice).html();

  const ORIGINAL_SEARCH_TEXT = '{"original":';
  const originalStart =
    scriptHtml.indexOf(ORIGINAL_SEARCH_TEXT) + ORIGINAL_SEARCH_TEXT.length;
  const originalEnd = scriptHtml.indexOf(",", originalStart);
  const originalPrice = strToNumber(
    scriptHtml.slice(originalStart, originalEnd)
  );

  const SALE_SEARCH_TEXT = ',"basic":';
  const saleStart =
    scriptHtml.indexOf(SALE_SEARCH_TEXT) + SALE_SEARCH_TEXT.length;
  const saleEnd = scriptHtml.indexOf(",", saleStart);
  const salePrice = strToNumber(scriptHtml.slice(saleStart, saleEnd));

  return correct({
    ...result,
    originalPrice,
    salePrice,
  });
};

export const _discoveryexpeditioncom = (
  $: CheerioStatic,
  selecter: ISelecter
): CrawlResult => {
  const result = selectAll($, selecter);

  let salePrice = result.salePrice;

  if (result.originalPrice !== 0) {
    const salePriceStr = $(selecter.salePrice).html();
    salePrice = Number(
      salePriceStr
        .slice(salePriceStr.indexOf("</del>"), salePriceStr.length - 8)
        .replace(/[^0-9]/g, "")
    );
  }

  return correct({
    ...result,
    salePrice,
  });
};

export const _naturestorecokr = (
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

export const _eduardocokr = (
  $: CheerioStatic,
  selecter: ISelecter
): CrawlResult => {
  const result = selectAll($, selecter);

  const name = result.name.slice(result.name.lastIndexOf("]") + 1);

  return correct({
    ...result,
    name,
  });
};

export const _personalpackcom = (
  $: CheerioStatic,
  selecter: ISelecter
): CrawlResult => {
  const result = selectAll($, selecter);

  return correct({
    ...result,
    imageUrl: "http://www.personal-pack.com" + result.imageUrl,
  });
};

export const _mngucokr = (
  $: CheerioStatic,
  selecter: ISelecter
): CrawlResult => {
  const result = selectAll($, selecter);
  let originalPrice = Number(
    $(selecter.originalPrice)
      .last()
      .text()
      .slice(12)
      .replace(/[^0-9]/g, "")
  );
  if (originalPrice === 0) {
    originalPrice = Number(
      $(
        "#layoutContent > div > div > div > div.infoArea > div > div.prd-detail > div > p:nth-child(1) > span > span > span > span > span > span > span > span > span > span > span > span > span > font > span"
      )
        .last()
        .text()
        .slice(12)
        .replace(/[^0-9]/g, "")
    );
  }

  return correct({
    ...result,
    originalPrice,
  });
};

export const _leirecokr = (
  $: CheerioStatic,
  selecter: ISelecter
): CrawlResult => {
  const result = selectAll($, selecter);

  return correct({
    ...result,
    imageUrl: "",
  });
};

export const _tbhshopcokr = (
  $: CheerioStatic,
  selecter: ISelecter
): CrawlResult => {
  const result = selectAll($, selecter);
  let { brandKor } = result;
  if (brandKor === "Mind Bridge") brandKor = "마인드브릿지";
  if (brandKor === "JUCY JUDY") brandKor = "쥬씨주디";
  if (brandKor === "BASIC HOUSE") brandKor = "베이직하우스";

  return correct({
    ...result,
    brandKor,
  });
};

export const _lludcokr = (
  $: CheerioStatic,
  selecter: ISelecter
): CrawlResult => {
  const result = selectAll($, selecter);

  return correct({
    ...result,
    brandKor: result.brandKor.slice(0, result.brandKor.indexOf(",")),
  });
};

export const _ativekr = (
  $: CheerioStatic,
  selecter: ISelecter
): CrawlResult => {
  const result = selectAll($, selecter);

  return correct({
    ...result,
    brandKor: result.brandKor.slice(0, result.brandKor.indexOf("(")),
  });
};

export const _lab101com = (
  $: CheerioStatic,
  selecter: ISelecter
): CrawlResult => {
  const result = selectAll($, selecter);

  const salePriceStr = $(selecter.salePrice).html();
  const salePrice = Number(
    salePriceStr
      .slice(salePriceStr.indexOf("</span>") + 1)
      .replace(/[^0-9]/g, "")
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
    brandKor: "",
  });
};

export const _inrowscokr = (
  $: CheerioStatic,
  selecter: ISelecter
): CrawlResult => {
  const result = selectAll($, selecter);

  const salePriceStr = $(selecter.salePrice).html();
  const salePrice = Number(
    salePriceStr
      .slice(
        salePriceStr.indexOf("</strike>") + 1,
        salePriceStr.indexOf("&#xA0")
      )
      .replace(/[^0-9]/g, "")
  );

  return correct({
    ...result,
    imageUrl: "http://www.inrows.co.kr" + result.imageUrl,
    salePrice,
  });
};

export const _lambydcom = (
  $: CheerioStatic,
  selecter: ISelecter
): CrawlResult => {
  const result = selectAll($, selecter);

  return correct({
    ...result,
    name: result.name.slice(0, result.name.length - 18),
  });
};

export const _monsterrepubliccokr = (
  $: CheerioStatic,
  selecter: ISelecter
): CrawlResult => {
  const result = selectAll($, selecter);
  const scriptHtml = $(selecter.imageUrl).html();

  const SEARCH_TEXT = ".jpg' : \"..";
  const start = scriptHtml.indexOf(SEARCH_TEXT) + SEARCH_TEXT.length;
  const end = scriptHtml.indexOf('"', start);
  const imageUrl =
    "http://monsterrepublic.co.kr/shop" + scriptHtml.slice(start, end);

  return correct({
    ...result,
    imageUrl,
  });
};

export const _ziosongziocom = (
  $: CheerioStatic,
  selecter: ISelecter
): CrawlResult => {
  const result = selectAll($, selecter);

  return correct({
    ...result,
    imageUrl: "http://www.ziosongzio.com" + result.imageUrl,
  });
};

export const _topten10mallcom = (
  $: CheerioStatic,
  selecter: ISelecter
): CrawlResult => {
  const result = selectAll($, selecter);

  let { brandKor } = result;
  if (brandKor === "TOPTEN10") brandKor = "탑텐";
  if (brandKor === "POLHAM") brandKor = "폴햄";
  if (brandKor === "ZIOZIA") brandKor = "지오지아";
  if (brandKor === "AND Z") brandKor = "앤드지";

  const goodsNo = result.imageUrl.slice(result.imageUrl.indexOf(" / ") + 4);

  const salePriceStr = $(selecter.salePrice).html();
  const salePrice = Number(
    salePriceStr.slice(0, salePriceStr.indexOf(" &#x")).replace(/[^0-9]/g, "")
  );

  return correct({
    ...result,
    imageUrl: "https://d2gocqzpnajr77.cloudfront.net/" + goodsNo + "_M",
    brandKor,
    salePrice,
  });
};

export const _kolonmallcom = (
  $: CheerioStatic,
  selecter: ISelecter
): CrawlResult => {
  const result = selectAll($, selecter);

  let { brandKor } = result;
  if (brandKor === "CUSTOMELLOW") brandKor = "커스텀멜로우";
  if (brandKor === "SERIES") brandKor = "시리즈";
  if (brandKor === "COURONNE") brandKor = "쿠론";
  if (brandKor === "KOLON SPORT") brandKor = "코오롱스포츠";
  if (brandKor === "HEAD") brandKor = "헤드";
  if (brandKor === "SUECOMMA BONNIE") brandKor = "슈콤마보니";

  return correct({
    ...result,
    brandKor,
  });
};

export const _ssgcom = ($: CheerioStatic, selecter: ISelecter): CrawlResult => {
  const result = selectAll($, selecter);

  let brandKor = unescape($(selecter.brandKor).last().text().trim()).replace(
    "#",
    ""
  );
  if (brandKor.includes("(")) {
    brandKor = brandKor.slice(0, brandKor.indexOf("("));
  }

  return correct({
    ...result,
    brandKor,
  });
};

export const _goodsellottecom = (
  $: CheerioStatic,
  selecter: ISelecter
): CrawlResult => {
  const result = selectAll($, selecter);

  const brandKor = unescape($(selecter.brandKor).last().text().trim());

  return correct({
    ...result,
    brandKor,
  });
};

export const _hyundaihmallcom = (
  $: CheerioStatic,
  selecter: ISelecter
): CrawlResult => {
  const result = selectAll($, selecter);

  return correct({
    ...result,
    brandKor: "",
  });
};

export const _akmallcom = (
  $: CheerioStatic,
  selecter: ISelecter
): CrawlResult => {
  const result = selectAll($, selecter);

  const brandKor = result.brandKor.slice(0, result.brandKor.indexOf("브"));

  return correct({
    ...result,
    brandKor,
  });
};

export const _thehyundaicom = (
  $: CheerioStatic,
  selecter: ISelecter
): CrawlResult => {
  const result = selectAll($, selecter);

  const brandKorStr = $(selecter.brandKor).html();
  let brandKor = unescape($(selecter.brandKor).last().text().trim());
  if (brandKorStr.includes("img")) {
    brandKor = $(selecter.brandKor + "> img")
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
  selecter: ISelecter
): CrawlResult => {
  const result = selectAll($, selecter);

  const brandKor = result.brandKor.slice(0, result.brandKor.indexOf("브") - 1);

  return correct({
    ...result,
    brandKor,
  });
};

export const _departmentssgcom = (
  $: CheerioStatic,
  selecter: ISelecter
): CrawlResult => {
  const result = selectAll($, selecter);

  let brandKor = unescape($(selecter.brandKor).last().text().trim()).replace(
    "#",
    ""
  );
  if (brandKor.includes("(")) {
    brandKor = brandKor.slice(0, brandKor.indexOf("("));
  }

  return correct({
    ...result,
    brandKor,
  });
};

export const _fashionpluscokr = (
  $: CheerioStatic,
  selecter: ISelecter
): CrawlResult => {
  const result = selectAll($, selecter);

  const salePriceStr = $(selecter.salePrice).html();
  const salePrice = Number(
    salePriceStr.slice(0, salePriceStr.indexOf("<span>")).replace(/[^0-9]/g, "")
  );

  return correct({
    ...result,
    salePrice,
  });
};

export const _coupangcom = (
  $: CheerioStatic,
  selecter: ISelecter
): CrawlResult => {
  const result = selectAll($, selecter);

  const brandKor = unescape($(selecter.brandKor).last().text().trim());

  return correct({
    ...result,
    brandKor,
  });
};

export const _shoppinginterparkcom = (
  $: CheerioStatic,
  selecter: ISelecter
): CrawlResult => {
  const result = selectAll($, selecter);

  const originalPriceStr = $(selecter.originalPrice).html();
  const ORIGINAL_SEARCH_TEXT = '"sale_price":';
  const SALE_SEARCH_TEXT = '"item_price":';
  const SALE_SEARCH_TEXT_END = "var egsLogManager";
  const originalPrice = Number(
    originalPriceStr
      .slice(
        originalPriceStr.indexOf(ORIGINAL_SEARCH_TEXT) +
          ORIGINAL_SEARCH_TEXT.length,
        originalPriceStr.indexOf(SALE_SEARCH_TEXT)
      )
      .replace(/[^0-9]/g, "")
  );
  const salePrice = Number(
    originalPriceStr
      .slice(
        originalPriceStr.indexOf(SALE_SEARCH_TEXT) + SALE_SEARCH_TEXT.length,
        originalPriceStr.indexOf(SALE_SEARCH_TEXT_END)
      )
      .replace(/[^0-9]/g, "")
  );

  return correct({
    ...result,
    originalPrice,
    salePrice,
  });
};

export const _g9cokr = ($: CheerioStatic, selecter: ISelecter): CrawlResult => {
  const result = selectAll($, selecter);

  const name = result.name.slice(0, result.name.indexOf("|"));

  return correct({
    ...result,
    name,
  });
};

export const _4xrcokr = (
  $: CheerioStatic,
  selecter: ISelecter
): CrawlResult => {
  const result = selectAll($, selecter);
  const hasBrandName = result.name.includes(":");

  const brandKor = hasBrandName
    ? result.name.slice(0, result.name.indexOf(":") - 1)
    : "4xr";
  const name = hasBrandName
    ? result.name.slice(result.name.indexOf(":") + 2)
    : result.name;
  const salePrice =
    result.salePrice < 100 ? result.originalPrice : result.salePrice;

  return correct({
    ...result,
    brandKor,
    salePrice,
    name,
    imageUrl: "http://www.4xr.co.kr" + result.imageUrl,
  });
};

export const _gvgcokr = (
  $: CheerioStatic,
  selecter: ISelecter
): CrawlResult => {
  const result = selectAll($, selecter);

  const brandKor = result.brandKor.slice(0, result.brandKor.indexOf("("));

  return correct({
    ...result,
    brandKor,
  });
};

export const _farfetchcom = (
  $: CheerioStatic,
  selecter: ISelecter
): CrawlResult => {
  const result = selectAll($, selecter);

  let { brandKor } = result;
  if (brandKor === "Balenciaga") brandKor = "발렌시아가";
  if (brandKor === "Bottega Veneta") brandKor = "보테가 베네타";
  if (brandKor === "Burberry") brandKor = "버버리";
  if (brandKor === "Chloé") brandKor = "끌로에";
  if (brandKor === "Gucci") brandKor = "구찌";
  if (brandKor === "Jil Sander") brandKor = "질 샌더";
  if (brandKor === "Isabel Marant Étoile") brandKor = "이자벨마랑 에뚜왈";
  if (brandKor === "Maison Margiela") brandKor = "메종 마르지엘라";
  if (brandKor === "Marni") brandKor = "마르니";
  if (brandKor === "Prada") brandKor = "프라다";
  if (brandKor === "Saint Laurent") brandKor = "생로랑";
  if (brandKor === "Valentino") brandKor = "발렌티노";
  if (brandKor === "Versace") brandKor = "베르사체";
  if (brandKor === "Alexander McQueen") brandKor = "알랙산더 맥퀸";
  if (brandKor === "Golden Goose") brandKor = "골든구스";
  if (brandKor === "Isabel Marant") brandKor = "이자벨마랑";
  if (brandKor === "Jimmy Choo") brandKor = "지미 추";
  if (brandKor === "Manolo Blahnik") brandKor = "마놀로 블라닉";
  if (brandKor === "STUART WEITZMAN") brandKor = "스튜어트 와이츠먼";
  if (brandKor === "A.P.C.") brandKor = "아페쎄";
  if (brandKor === "Givenchy") brandKor = "지방시";
  if (brandKor === "Loewe") brandKor = "로에베";
  if (brandKor === "Salvatore Ferragamo") brandKor = "살바토레 페레가모";
  if (brandKor === "Stella Mccartney") brandKor = "스텔라 매카트니";
  if (brandKor === "Off-White") brandKor = "오프화이트";
  if (brandKor === "Stone Island") brandKor = "스톤아일랜드";
  if (brandKor === "Thom Browne") brandKor = "톰 브라운";
  if (brandKor === "Church's") brandKor = "처치스";
  if (brandKor === "Marsèll") brandKor = "마르셀";
  if (brandKor === "Officine Creative") brandKor = "오피치네 크레아티베";
  if (brandKor === "Santoni") brandKor = "산토니";
  if (brandKor === "Tod's") brandKor = "토즈";
  if (brandKor === "Adidas") brandKor = "아디다스";
  if (brandKor === "Common Projects") brandKor = "커먼 프로젝트";
  if (brandKor === "Nike") brandKor = "나이키";

  const name = result.name.slice(0, result.name.indexOf("-") - 1);
  return correct({
    ...result,
    brandKor,
    name,
  });
};

export const _abokinet = (
  $: CheerioStatic,
  selecter: ISelecter
): CrawlResult => {
  const result = selectAll($, selecter);

  return correct({
    ...result,
    imageUrl: "https://www.aboki.net" + result.imageUrl,
  });
};

export const _jogunshopcom = (
  $: CheerioStatic,
  selecter: ISelecter
): CrawlResult => {
  const result = selectAll($, selecter);

  const name = result.name.slice(0, result.name.indexOf("<br>"));

  return correct({
    ...result,
    name,
  });
};

export const _timemeccacokr = (
  $: CheerioStatic,
  selecter: ISelecter
): CrawlResult => {
  const result = selectAll($, selecter);
  const isContainBrand = result.name.indexOf("[") === 0;
  const brandKor = isContainBrand
    ? result.name.slice(1, result.name.indexOf("]")).replace(/[A-Za-z]/g, "")
    : "";

  return correct({
    ...result,
    brandKor,
  });
};

export const _snuvcokr = (
  $: CheerioStatic,
  selecter: ISelecter
): CrawlResult => {
  const result = selectAll($, selecter);

  const originalPriceStr = $(selecter.originalPrice).html();
  const hasSalePrice = originalPriceStr.includes("strike");
  const originalPriceSelecter = hasSalePrice
    ? selecter.originalPrice + " > strike"
    : selecter.originalPrice + " > div";
  const originalPrice = strToNumber(
    unescape($(originalPriceSelecter).last().text().trim())
  );

  const brandKorSelecter = hasSalePrice
    ? selecter.brandKor + " > tr:nth-child(5) > td > div"
    : selecter.brandKor + " > tr:nth-child(4) > td > div";
  const brandKor = unescape($(brandKorSelecter).last().text().trim());

  return correct({
    ...result,
    originalPrice,
    brandKor,
    imageUrl: "https://www.snuv.co.kr" + result.imageUrl,
  });
};

export const _labelarchivecom = (
  $: CheerioStatic,
  selecter: ISelecter
): CrawlResult => {
  const result = selectAll($, selecter);

  const name = result.name.slice(
    0,
    result.name.indexOf(" : LABEL ARCHIVE 라벨 아카이브")
  );

  return correct({
    ...result,
    name,
  });
};

export const _flukecompanycom = (
  $: CheerioStatic,
  selecter: ISelecter
): CrawlResult => {
  const result = selectAll($, selecter);

  return correct({
    ...result,
    imageUrl: "https://www.flukecompany.com" + result.imageUrl,
  });
};

export const _wvprojectcokr = (
  $: CheerioStatic,
  selecter: ISelecter
): CrawlResult => {
  const result = selectAll($, selecter);

  return correct({
    ...result,
    imageUrl: "https://www.wvproject.co.kr" + result.imageUrl,
  });
};

export const _samsonitemallcokr = (
  $: CheerioStatic,
  selecter: ISelecter
): CrawlResult => {
  const result = selectAll($, selecter);

  const isSale = $(selecter.salePrice).html().includes("strong");
  const salePrice = isSale
    ? result.salePrice.toString().replace(result.originalPrice.toString(), "")
    : result.salePrice;

  return correct({
    ...result,
    salePrice: Number(salePrice),
  });
};

export const _heightsstorecom = (
  $: CheerioStatic,
  selecter: ISelecter
): CrawlResult => {
  const result = selectAll($, selecter);

  let brandKor = result.brandKor.replace("See all brand product", "");
  if (brandKor === "have a good time") brandKor = "해브어굿타임";
  if (brandKor === "Stussy") brandKor = "스투시";
  if (brandKor === "Richardson") brandKor = "리차드슨";
  if (brandKor === "MISCHIEF") brandKor = "미스치프";

  return correct({
    ...result,
    brandKor,
  });
};

export const _urbanstoffcom = (
  $: CheerioStatic,
  selecter: ISelecter
): CrawlResult => {
  const result = selectAll($, selecter);

  const salePriceStr = $(selecter.salePrice).html();
  const saleAmount = Number(
    salePriceStr.replace("&#xC6D0;", "").replace(/[^0-9-]/g, "")
  );

  const salePrice =
    saleAmount < 0 ? result.originalPrice + saleAmount : result.originalPrice;
  const imageUrl =
    "https://www.urbanstoff.com/shop" +
    $(selecter.imageUrl).last().attr().src.slice(2);

  return correct({
    ...result,
    imageUrl,
    salePrice,
  });
};

export const _gncostylecom = (
  $: CheerioStatic,
  selecter: ISelecter
): CrawlResult => {
  const result = selectAll($, selecter);

  let { brandKor } = result;
  if (brandKor === "T.I FOR MEN") brandKor = "티아이포맨";
  if (brandKor === "COVETBLAN") brandKor = "코벳블랑";
  if (brandKor === "Thursday Island") brandKor = "써스데이아일랜드";

  return correct({
    ...result,
    brandKor,
  });
};

export const _yanthirteencom = (
  $: CheerioStatic,
  selecter: ISelecter
): CrawlResult => {
  const result = selectAll($, selecter);

  const SALE_SEARCH_TEXT = "product_price";
  const SALE_SEARCH_TEXT_END = "option_type";
  const html = $("html").html();
  const salePrice = Number(
    html
      .slice(html.indexOf(SALE_SEARCH_TEXT), html.indexOf(SALE_SEARCH_TEXT_END))
      .replace(/[^0-9]/g, "")
  );

  return correct({
    ...result,
    imageUrl: "https://www.yanthirteen.com" + result.imageUrl,
    salePrice,
  });
};

export const _hfashionmallcom = (
  $: CheerioStatic,
  selecter: ISelecter
): CrawlResult => {
  const result = selectAll($, selecter);

  const html = $("html").html();
  const BRAND_SERACH_TEXT = 'recopick:author" content="';
  const BRAND_SEARCH_TEXT_END = '<meta property="recopick:title';
  const brandKorStr = html.slice(
    html.indexOf(BRAND_SERACH_TEXT) + BRAND_SERACH_TEXT.length,
    html.indexOf(BRAND_SEARCH_TEXT_END)
  );
  let brandKor = brandKorStr.slice(0, brandKorStr.indexOf('">'));

  if (brandKor === "TOMMY HILFIGER") brandKor = "타미힐피거";
  if (brandKor === "CALVIN KLEIN") brandKor = "캘빈클라인";

  return correct({ ...result, brandKor });
};

export const _guglobalcom = (
  $: CheerioStatic,
  selecter: ISelecter
): CrawlResult => {
  const result = selectAll($, selecter);

  const originalPrice = Number($(selecter.originalPrice).attr("value"));

  return correct({ ...result, originalPrice });
};

export const _shinwonmallcom = (
  $: CheerioStatic,
  selecter: ISelecter
): CrawlResult => {
  const result = selectAll($, selecter);
  let { brandKor } = result;
  if (brandKor === "FAHRENHEIT") brandKor = "지이크 파렌하이트";
  if (brandKor === "SIEG") brandKor = "지이크";
  if (brandKor === "ISABEY") brandKor = "이사베이";
  if (brandKor === "GINNASIX") brandKor = "기나식스";
  if (brandKor === "iCONIQ") brandKor = "아이코닉";
  if (brandKor === "MARKM") brandKor = "마크엠";
  if (brandKor === "BESTIBELLI") brandKor = "베스띠벨리";
  if (brandKor === "VIKI") brandKor = "비키";

  return correct({ ...result, brandKor });
};

export const _shopreebokcokr = (
  $: CheerioStatic,
  selecter: ISelecter
): CrawlResult => {
  const result = selectAll($, selecter);

  const head = $("head").html();
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
      .replace(/[^0-9]/g, "")
  );
  const salePrice = Number(
    head
      .slice(
        head.indexOf(SALE_SEARCH_TEXT) + SALE_SEARCH_TEXT.length,
        head.indexOf(SALE_SEARCH_TEXT_END)
      )
      .replace(/[^0-9]/g, "")
  );

  return correct({
    ...result,
    originalPrice,
    salePrice,
  });
};

export const _toptentopten10mallcom = (
  $: CheerioStatic,
  selecter: ISelecter
): CrawlResult => {
  const result = selectAll($, selecter);

  const salePriceStr = $(selecter.salePrice).html();
  const salePrice = Number(
    salePriceStr
      .slice(0, salePriceStr.indexOf("&#xC6D0"))
      .replace(/[^0-9]/g, "")
  );

  return correct({ ...result, salePrice });
};

export const _skonoshopcom = (
  $: CheerioStatic,
  selecter: ISelecter
): CrawlResult => {
  const result = selectAll($, selecter);

  const imageUrlStr = $(selecter.imageUrl).html();
  const imageUrl = imageUrlStr.includes("<ul>")
    ? $("#lens_img").attr("src")
    : $(selecter.imageUrl + " > li > img").attr("src");

  return correct({ ...result, imageUrl: "https://skonoshop.com" + imageUrl });
};

export const _guesskoreacom = (
  $: CheerioStatic,
  selecter: ISelecter
): CrawlResult => {
  const result = selectAll($, selecter);

  return correct({
    ...result,
    brandKor: result.brandKor.slice(0, 2),
  });
};

export const _wooyoungmicom = (
  $: CheerioStatic,
  selecter: ISelecter
): CrawlResult => {
  const result = selectAll($, selecter);

  return correct({
    ...result,
    name: result.name.split(",")[0],
  });
};

export const _shopmangocom = (
  $: CheerioStatic,
  selecter: ISelecter
): CrawlResult => {
  const result = selectAll($, selecter);
  const scriptHtml = $(selecter.salePrice).html();
  let search_text, start, end;

  search_text = '"originalPrice":';
  start = scriptHtml.indexOf(search_text) + search_text.length;
  end = scriptHtml.indexOf(",", start);
  const originalPrice = Number(scriptHtml.slice(start, end));

  search_text = '"salePrice":"';
  start = scriptHtml.indexOf(search_text) + search_text.length;
  end = scriptHtml.indexOf('"', start);
  const salePrice = Number(scriptHtml.slice(start, end));

  return correct({
    ...result,
    name: result.name.split("-")[0].trim(),
    originalPrice,
    salePrice,
  });
};

export const _stylenandacom = (
  $: CheerioStatic,
  selecter: ISelecter
): CrawlResult => {
  const result = selectAll($, selecter);

  return correct({
    ...result,
    name: result.name.split("#")[0].trim(),
  });
};

export const _stylelqcom = (
  $: CheerioStatic,
  selecter: ISelecter
): CrawlResult => {
  const result = selectAll($, selecter);
  let originalPrice = Number(
    $(selecter.originalPrice)
      .last()
      .text()
      .replace(/[^0-9]/g, "")
  );
  if (originalPrice === 0) {
    originalPrice = Number(
      $(
        "div.col.col-1-1-lg.col-1-2-xl.caption > div > div:nth-child(1) > div.col.desc"
      )
        .last()
        .text()
        .replace(/[^0-9]/g, "")
    );
  }
  return correct({
    ...result,
    name: result.name.slice(result.name.indexOf("]") + 1),
    originalPrice,
  });
};

export const _bottegavenetacom = (
  $: CheerioStatic,
  selecter: ISelecter
): CrawlResult => {
  const result = selectAll($, selecter);

  return correct({
    ...result,
    name: result.name.split("-")[1].trim(),
  });
};

export const _etcseoulcom = (
  $: CheerioStatic,
  selecter: ISelecter
): CrawlResult => {
  const result = selectAll($, selecter);
  const [brandKor, name] = result.name.split("]");
  return correct({
    ...result,
    brandKor: brandKor.trim(),
    name: name.trim() + "]",
  });
};

export const _montblanccom = (
  $: CheerioStatic,
  selecter: ISelecter
): CrawlResult => {
  const result = selectAll($, selecter);
  return correct({
    ...result,
    name: result.name.split("|")[0].trim(),
  });
};

export const _thombrownecom = (
  $: CheerioStatic,
  selecter: ISelecter
): CrawlResult => {
  const result = selectAll($, selecter);
  const [name, brandKor] = result.name.split("|");
  return correct({
    ...result,
    name: name.trim(),
    brandKor: brandKor.trim(),
  });
};

export const _givenchycom = (
  $: CheerioStatic,
  selecter: ISelecter
): CrawlResult => {
  const result = selectAll($, selecter);
  const scriptHtml = $(selecter.salePrice).html();
  let search_text, start, end;
  search_text = 'itemprop="image" src="';
  start = scriptHtml.indexOf(search_text) + search_text.length;
  end = scriptHtml.indexOf('"', start);
  const imageUrl = scriptHtml.slice(start, end);
  search_text = '<meta itemprop="price" content="';
  start = scriptHtml.indexOf(search_text) + search_text.length;
  end = scriptHtml.indexOf(".", start);
  const originalPrice = Number(scriptHtml.slice(start, end));
  const salePrice = originalPrice;
  return correct({
    ...result,
    name: result.name.split("|")[0].trim(),
    imageUrl,
    originalPrice,
    salePrice,
  });
};

export const _monclercom = (
  $: CheerioStatic,
  selecter: ISelecter
): CrawlResult => {
  const result = selectAll($, selecter);
  return correct({
    ...result,
    name: result.name.split("|")[0].trim(),
  });
};

export const _acnestudioscom = (
  $: CheerioStatic,
  selecter: ISelecter
): CrawlResult => {
  const result = selectAll($, selecter);
  return correct({
    ...result,
    name: result.name.trim(),
  });
};

export const _stoneislandcom = (
  $: CheerioStatic,
  selecter: ISelecter
): CrawlResult => {
  const result = selectAll($, selecter);
  return correct({
    ...result,
    name: result.name.split("Stone Island")[0].trim(),
  });
};

export const _alexandermcqueencom = (
  $: CheerioStatic,
  selecter: ISelecter
): CrawlResult => {
  const result = selectAll($, selecter);
  return correct({
    ...result,
    name: result.name.split("|")[0].trim(),
  });
};

export const _diorcom = (
  $: CheerioStatic,
  selecter: ISelecter
): CrawlResult => {
  const result = selectAll($, selecter);
  const scriptHtml = $(selecter.originalPrice).html();
  const SEARCH_TEXT = '"price":';
  const start = scriptHtml.indexOf(SEARCH_TEXT) + SEARCH_TEXT.length;
  const end = scriptHtml.indexOf(",", start);
  const originalPrice = Number(scriptHtml.slice(start, end));

  return correct({
    ...result,
    name: result.name.split("-")[0].trim(),
    originalPrice,
  });
};

export const _shoptimberlandcokr = (
  $: CheerioStatic,
  selecter: ISelecter
): CrawlResult => {
  const result = selectAll($, selecter);
  return correct({
    ...result,
    name: result.name.replace(" - Timberland", ""),
  });
};

export const _acha1com = (
  $: CheerioStatic,
  selecter: ISelecter
): CrawlResult => {
  const result = selectAll($, selecter);
  return correct({
    ...result,
    name: result.name
      .slice(
        result.name.indexOf("%할인") >= 0
          ? result.name.indexOf("%할인") + 3 + 1
          : 0
      )
      .replace("[ACHA/아차]", ""),
  });
};

export const _coucoustorecom = (
  $: CheerioStatic,
  selecter: ISelecter
): CrawlResult => {
  const result = selectAll($, selecter);
  const scriptHtml = $(selecter.salePrice).html();
  const SEARCH_TEXT = "-&gt;";
  const start = scriptHtml.indexOf(SEARCH_TEXT) + SEARCH_TEXT.length;
  const end = scriptHtml.indexOf("&#xC6D0;", start);
  const salePrice = strToNumber(scriptHtml.slice(start, end));

  return correct({
    ...result,
    salePrice,
  });
};

export const _unalloyedkr = (
  $: CheerioStatic,
  selecter: ISelecter
): CrawlResult => {
  const result = selectAll($, selecter);
  const scriptHtml = $(selecter.name).html();
  const SEARCH_TEXT = "<span";
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
  selecter: ISelecter
): CrawlResult => {
  const result = selectAll($, selecter);

  let brandKor = result.name.slice(0, result.name.indexOf(":") - 1);
  if (brandKor === "N.HOOLYWOOD") brandKor = "엔 헐리우드";
  if (brandKor === "IVSI") brandKor = "아이비즈아이";
  if (brandKor === "Auralee") brandKor = "오라리";
  if (brandKor === "BIRTHDAYSUIT") brandKor = "벌스데이수트";
  if (brandKor === "Camiel Fortgens") brandKor = "카미엘 포트겐스";
  if (brandKor === "OUR LEGACY") brandKor = "아워레가시";
  if (brandKor === "SALOMON") brandKor = "살로몬";
  if (brandKor === "KIM CLOTHING") brandKor = "킴클로딩";
  if (brandKor === "NEEDLES") brandKor = "니들스";
  if (brandKor === "AECA WHITE") brandKor = "에이카화이트";
  if (brandKor === "AFTER PRAY") brandKor = "애프터프레이";
  if (brandKor === "ATELIER KHJ") brandKor = "아뜰리에 케이에이치제이";
  if (brandKor === "Ancient Greek Sandals") brandKor = "에인션트 그릭 샌들";
  if (brandKor === "ASICS") brandKor = "아식스";
  if (brandKor === "Bauhaus-Archiv") brandKor = "바우하우스";
  if (brandKor === "Baracuta") brandKor = "바라쿠타";
  if (brandKor === "BIRKENSTOCK") brandKor = "버켄스탁";
  if (brandKor === "Bonne Suit") brandKor = "보네 수트";
  if (brandKor === "BROWNYARD") brandKor = "브라운야드";
  if (brandKor === "CHAMPION") brandKor = "챔피온";
  if (brandKor === "CLAMP") brandKor = "클램프";
  if (brandKor === "CLASS") brandKor = "클래스";
  if (brandKor === "Common Projects") brandKor = "커먼프로젝트";
  if (brandKor === "de bonne facture") brandKor = "드 보네 팩터";
  if (brandKor === "Document") brandKor = "도큐먼트";
  if (brandKor === "Dr. Martens") brandKor = "닥터마틴";
  if (brandKor === "Eastlogue") brandKor = "이스트로그";
  if (brandKor === "Engineered Garments") brandKor = "엔지니어드가먼츠";
  if (brandKor === "E. Tautz") brandKor = "이타우즈";
  if (brandKor === "ERNEST W. BAKER") brandKor = "어니스트베이커";

  return correct({
    ...result,
    name: result.name.slice(result.name.indexOf(":") + 1),
    brandKor,
  });
};

export const _derobekr = (
  $: CheerioStatic,
  selecter: ISelecter
): CrawlResult => {
  const result = selectAll($, selecter);
  return correct({
    ...result,
    name: result.name.replace("- 드로브 derobe 공식 온라인 스토어", ""),
  });
};

export const _glothescokr = (
  $: CheerioStatic,
  selecter: ISelecter
): CrawlResult => {
  const result = selectAll($, selecter);
  const scriptHtml = $(selecter.salePrice).html();
  const SEARCH_TEXT = "&#xC6D0;";
  const salePrice = Number(
    (scriptHtml.includes(SEARCH_TEXT)
      ? scriptHtml.slice(0, scriptHtml.indexOf(SEARCH_TEXT))
      : scriptHtml
    ).replace(/[^0-9]/g, "")
  );
  return correct({
    ...result,
    name: result.name.slice(result.name.indexOf(".") + 1),
    salePrice,
  });
};

export const _ssolantcom = (
  $: CheerioStatic,
  selecter: ISelecter
): CrawlResult => {
  const result = selectAll($, selecter);
  return correct({
    ...result,
    name: result.name.slice(result.name.indexOf("]") + 1),
  });
};

export const _shoemarkercokr = (
  $: CheerioStatic,
  selecter: ISelecter
): CrawlResult => {
  const result = selectAll($, selecter);

  let brandKor = result.brandKor;
  if (brandKor === "ADIDAS") brandKor = "아디다스";
  if (brandKor === "NIKE") brandKor = "나이키";
  if (brandKor === "CROCS") brandKor = "크록스";
  if (brandKor === "CLAYONG") brandKor = "클레용";
  if (brandKor === "FILA") brandKor = "휠라";
  if (brandKor === "PUMA") brandKor = "푸마";
  if (brandKor === "CONVERSE") brandKor = "컨버스";
  if (brandKor === "REEBOK") brandKor = "리복";
  if (brandKor === "FREDPERRY") brandKor = "프레드페리";
  if (brandKor === "SUPERGA") brandKor = "수페르가";
  if (brandKor === "LACOSTE") brandKor = "라코스테";
  if (brandKor === "NEW BALANCE") brandKor = "뉴발란스";
  if (brandKor === "TEVA") brandKor = "테바";
  if (brandKor === "NERDY") brandKor = "널디";
  if (brandKor === "HEAD") brandKor = "헤드";
  if (brandKor === "6FT") brandKor = "식스핏";
  if (brandKor === "DR. MARTENS") brandKor = "닥터마틴";
  if (brandKor === "MLB") brandKor = "MLB";
  if (brandKor === "ROMANTIC MOVE") brandKor = "로맨틱무브";
  if (brandKor === "SKONO") brandKor = "스코노";
  if (brandKor === "MARVEL") brandKor = "마블";
  if (brandKor === "LEMINE") brandKor = "르마인";
  if (brandKor === "BSQT") brandKor = "BSQT";
  if (brandKor === "SKECHERS") brandKor = "스케처스";

  return correct({
    ...result,
    brandKor,
  });
};

export const _filsonkoreacokr = (
  $: CheerioStatic,
  selecter: ISelecter
): CrawlResult => {
  const result = selectAll($, selecter);
  return correct({
    ...result,
    imageUrl: "http://www.filsonkorea.co.kr/shop/" + result.imageUrl.slice(3),
  });
};

export const _savagecokr = (
  $: CheerioStatic,
  selecter: ISelecter
): CrawlResult => {
  const result = selectAll($, selecter);
  return correct({
    ...result,
    name: result.name.replace("(세비지)", ""),
  });
};

export const _hotsunglasscokr = (
  $: CheerioStatic,
  selecter: ISelecter
): CrawlResult => {
  const result = selectAll($, selecter);
  return correct({
    ...result,
    brandKor: result.brandKor.replace(" - 핫선글라스", ""),
  });
};

export const _istyle24com = (
  $: CheerioStatic,
  selecter: ISelecter
): CrawlResult => {
  const result = selectAll($, selecter);
  return correct({
    ...result,
    brandKor: $(
      "#product_total > div.product_wrap_top.clearfix > div.product-detail > div.product_brand > a"
    )
      .text()
      .replace("바로가기", ""),
  });
};

export const _patagoniacokr = (
  $: CheerioStatic,
  selecter: ISelecter
): CrawlResult => {
  const result = selectAll($, selecter);
  return correct({
    ...result,
    imageUrl: "http://www.patagonia.co.kr" + result.imageUrl,
  });
};

export const _varzarcom = (
  $: CheerioStatic,
  selecter: ISelecter
): CrawlResult => {
  const result = selectAll($, selecter);
  return correct({
    ...result,
    name: result.name.replace("[바잘] ", ""),
  });
};

export const _layerstorekr = (
  $: CheerioStatic,
  selecter: ISelecter
): CrawlResult => {
  const result = selectAll($, selecter);
  let brandKor = result.name.split(" ")[0];
  if (brandKor === "LIFUL") brandKor = "라이풀";
  if (brandKor === "KANCO") brandKor = "칸코";
  if (brandKor === "FUZZ") brandKor = "퍼즈";

  return correct({
    ...result,
    brandKor,
  });
};

export const _byccokr = (
  $: CheerioStatic,
  selecter: ISelecter
): CrawlResult => {
  const result = selectAll($, selecter);
  const txtCut = $("div.goods_tit > p.txtcut").text();

  return correct({
    ...result,
    name: (txtCut ? txtCut + " " : "") + result.name,
  });
};

export const _thesortiecom = (
  $: CheerioStatic,
  selecter: ISelecter
): CrawlResult => {
  const result = selectAll($, selecter);

  return correct({
    ...result,
    name: result.name.replace("솔티  - ", ""),
  });
};

export const _deadendkrcafe24com = (
  $: CheerioStatic,
  selecter: ISelecter
): CrawlResult => {
  const result = selectAll($, selecter);

  const origianlPriceText = $(selecter.originalPrice).text();
  const originalPrice = Number(
    origianlPriceText
      .slice(0, origianlPriceText.indexOf("--->") + 1)
      .replace(/[^0-9]/g, "")
  );

  return correct({
    ...result,
    name: result.name.replace("솔티  - ", ""),
    originalPrice,
  });
};

export const _shopamoebaculturecom = (
  $: CheerioStatic,
  selecter: ISelecter
): CrawlResult => {
  const result = selectAll($, selecter);
  return correct({
    ...result,
    imageUrl: "http://shop.amoebaculture.com" + result.imageUrl,
  });
};

export const _fillikecom = (
  $: CheerioStatic,
  selecter: ISelecter
): CrawlResult => {
  const result = selectAll($, selecter);

  return correct({
    ...result,
    name: result.name.replace(" : FILLIKE 필리케", ""),
  });
};

export const _hagokr = ($: CheerioStatic, selecter: ISelecter): CrawlResult => {
  const result = selectAll($, selecter);
  const brandKor = $(selecter.brandKor).text();
  const originalPrice =
    result.originalPrice ||
    Number(
      $(
        "#frmView > div > div.info-block > div.item > ul > li:nth-child(1) > div > strong"
      )
        .text()
        .replace(/[^0-9]/g, "")
    );

  return correct({
    ...result,
    brandKor,
    originalPrice,
  });
};

export const _madgoatofficialcom = (
  $: CheerioStatic,
  selecter: ISelecter
): CrawlResult => {
  const result = selectAll($, selecter);
  const scriptHtml = $(selecter.originalPrice).html();

  const SEARCH_TEXT = 'name="price" value="';
  const start = scriptHtml.indexOf(SEARCH_TEXT) + SEARCH_TEXT.length;
  const end = scriptHtml.indexOf('"', start);
  const originalPrice = parseFloat(
    scriptHtml.slice(start, end).replace(/,/g, "")
  );
  return correct({
    ...result,
    originalPrice,
  });
};

export const _wuzustudiocom = (
  $: CheerioStatic,
  selecter: ISelecter
): CrawlResult => {
  const result = selectAll($, selecter);
  const scriptHtml = $(selecter.imageUrl).html();
  const SEARCH_TEXT = '<meta property="og:image" content="';
  const start = scriptHtml.indexOf(SEARCH_TEXT) + SEARCH_TEXT.length;
  const end = scriptHtml.indexOf('" />', start);
  const imageUrl = scriptHtml.slice(start, end);
  const salePrice = Number(
    $(selecter.salePrice)
      .text()
      .split("(")[0]
      .trim()
      .replace(/[^0-9]/g, "")
  );
  return correct({
    ...result,
    salePrice,
    imageUrl,
  });
};

export const _hyojicokr = (
  $: CheerioStatic,
  selecter: ISelecter
): CrawlResult => {
  const result = selectAll($, selecter);

  return correct({
    ...result,
    imageUrl: "http://www.hyoji.co.kr" + result.imageUrl,
  });
};

export const _kingkr = ($: CheerioStatic, selecter: ISelecter): CrawlResult => {
  const result = selectAll($, selecter);
  const isSoldout = (
    $(selecter.isSoldout)
        .hasClass('displaynone')
  );

  return correct({
    ...result,
    name: (result.name.split("/")[1] || result.name).trim(),
    isSoldout
  });
};

export const _costumeoclockcom = (
  $: CheerioStatic,
  selecter: ISelecter
): CrawlResult => {
  const result = selectAll($, selecter);
  const [brandKor, name] = result.name.split("[")[1].split("]");

  return correct({
    ...result,
    name: name.trim(),
    brandKor,
  });
};

export const _smartstorenavercomjuanhomme = (
  $: CheerioStatic,
  selecter: ISelecter
): CrawlResult => {
  const result = selectAll($, selecter);
  let isSoldout = (
    $(selecter.isSoldout)
      .text()
      .search('구매하실 수 없는') > -1
  );

  return correct({
    ...result,
    isSoldout,
    name: result.name.replace(" : JUAN HOMME", ""),
  });
};

export const _nodearchivecom = (
  $: CheerioStatic,
  selecter: ISelecter
): CrawlResult => {
  const result = selectAll($, selecter);
  const images = [];
  $(selecter.images)
    .find("img")
    .each((_, ele) => {
      images.push(ele.attribs["src"] || ele.attribs["ec-data-src"]);
    });

  return correct({
    ...result,
    name: result.name.split("-")[0].trim(),
    images: images.map((image) => correctImageUrl(image, "nodearchive.com")),
  });
};

export const _ourscopecokr = (
  $: CheerioStatic,
  selecter: ISelecter
): CrawlResult => {
  const result = selectAll($, selecter);
  const images = [];
  $(selecter.images)
    .find("img")
    .each((_, ele) => {
      images.push(ele.attribs["src"] || ele.attribs["ec-data-src"]);
    });

  return correct({
    ...result,
    images: images.map((image) => correctImageUrl(image, "ourscope.co.kr")),
  });
};

export const _mimthewardrobecom = (
  $: CheerioStatic,
  selecter: ISelecter
): CrawlResult => {
  const result = selectAll($, selecter);
  const images = [];
  $(selecter.images)
    .first()
    .find("img")
    .each((_, ele) => {
      images.push(ele.attribs["src"] || ele.attribs["ec-data-src"]);
    });

  return correct({
    ...result,
    images: images.map((image) => correctImageUrl(image, "mimthewardrobe.com")),
  });
};

export const _dgrecokr = (
  $: CheerioStatic,
  selecter: ISelecter
): CrawlResult => {
  const result = selectAll($, selecter);
  let originalPrice = 0;
  const isSoldout = (
    !$(selecter.isSoldout)
        .hasClass('hide')
  );

  $(selecter.originalPrice)
    .find("span.productPriceWithDiscountSpan")
    ?.each(
      (_, ele) =>
        (originalPrice = Number(ele.children[0].data.replace(/[^0-9]/g, "")))
    );

  $(selecter.originalPrice)
    .find("span.productPriceSpan")
    ?.each(
      (_, ele) =>
        (originalPrice = Number(ele.children[0].data.replace(/[^0-9]/g, "")))
    );

  return correct({
    ...result,
    isSoldout,
    originalPrice,
  });
};

export const _esfaicokr = (
  $: CheerioStatic,
  selecter: ISelecter
): CrawlResult => {
  const result = selectAll($, selecter);
  const images = []
  let name
  $(selecter.images)
    .find("img")
    .each((_, ele) => {
      images.push(ele.attribs["src"] || ele.attribs["ec-data-src"]);
    });

  if (result.name.search(']') > -1) { name = result.name.split(']')[1].trim() }
    else {name = result.name}
  return correct({
    ...result,
    name,
    images: images.map((image) => correctImageUrl(image, "esfai.co.kr")),
  });
};


export const _easestorecokr = ($: CheerioStatic, selecter: ISelecter): CrawlResult => {
  const result = selectAll($, selecter);
  const isSoldout = (
    $(selecter.isSoldout)
        .hasClass('displaynone')
  );

  return correct({
    ...result,
    isSoldout,
  });
};

export const _flareupcokr = ($: CheerioStatic, selecter: ISelecter): CrawlResult => {
  const result = selectAll($, selecter);
  const isSoldout = (
    $(selecter.isSoldout)
        .hasClass('displaynone')
  );

  return correct({
    ...result,
    isSoldout,
  });
};


export const _ojoskr = (
  $: CheerioStatic,
  selecter: ISelecter
): CrawlResult => {
  const result = selectAll($, selecter);
  const isSoldout = (
     !$(selecter.isSoldout)
        .hasClass('hide')
  );
  return correct({
    ...result,
   isSoldout,
  });
};

export const _kutletshopcom = (
  $: CheerioStatic,
  selecter: ISelecter
): CrawlResult => {
  const result = selectAll($, selecter);
  const isSoldout = (
     !$(selecter.isSoldout)
        .hasClass('hide')
  );
  return correct({
    ...result,
   isSoldout,
  });
};

export const _hyojicokr = (
  $: CheerioStatic,
  selecter: ISelecter
): CrawlResult => {
  const result = selectAll($, selecter);
  let isSoldout = (
    $(selecter.isSoldout)
      .text()
      .search('품절') > -1
  );
  return correct({
    ...result,
   isSoldout,
  });
};

export const _nomanualofficialcom = (
  $: CheerioStatic,
  selecter: ISelecter
): CrawlResult => {
  const result = selectAll($, selecter);
  const isSoldout = (
     !$(selecter.isSoldout)
        .hasClass('hide')
  );
  return correct({
    ...result,
   isSoldout,
  });
};

export const _inrowscokr = (
  $: CheerioStatic,
  selecter: ISelecter
): CrawlResult => {
  const result = selectAll($, selecter);
  let isSoldout = (
    $(selecter.isSoldout)
      .text()
      .search('품절') > -1
  );
  return correct({
    ...result,
   isSoldout,
  });
};

