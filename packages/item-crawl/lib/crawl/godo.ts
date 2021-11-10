import * as cheerio from 'cheerio';

import { OptionResult } from 'types';

export const getGodoSubOptionData = (html: string): string[] => {
  const SEARCH_TEXT = "opt['1'] = new Array";
  if (html.indexOf(SEARCH_TEXT) < 0) {
    throw new Error();
  }

  const start = html.indexOf(SEARCH_TEXT) + SEARCH_TEXT.length;
  const end = html.indexOf(';', start);
  const subOptionScript = html.slice(start, end);
  const result = subOptionScript
    .split(/[\s\\n'"()]/)
    .join('')
    .split(',,')
    .slice(1) // '==옴션선택==' 제거
    .map((v) => v.split(',')[0])
    .map((v) => v.split('품절')[0]);

  return result;
};

/**  ex) '==색상2 선택==' => '색상2' */
const formatGodoAddoptOptionName = (name: string) => {
  return name.split(/[=]/).join('').split(' ')[0];
};

export const getGodoAddoptOptionResult = (
  html: string,
  $: cheerio.Root
): OptionResult => {
  const values = {};

  const addoptOptionSelector = 'select[name="addopt[]"]';
  const valueSelector = 'option';
  const valueStartIndex = 1;

  $(addoptOptionSelector).each((i, container) => {
    const inner$ = cheerio.load(container);
    const optionName = formatGodoAddoptOptionName(
      (inner$(
        valueSelector
      )[0] as cheerio.TagElement).children[0].data.toString()
    );
    values[optionName] = [];
    inner$(valueSelector).each((j, ele) => {
      const valueIndex = j - valueStartIndex;
      if (valueIndex < 0) {
        return;
      }

      values[optionName].push(
        (ele as cheerio.TagElement).children[0].data
          .split('(')[0]
          .toString()
          .trim()
      );
    });
  });

  return {
    values,
    isSoldout: [],
    optionPriceVariants: [],
    productPriceVariants: [],
  };
};
