import axios from 'axios';
import * as cheerio from 'cheerio';

import { OptionResult } from '../../types';

export const _mainstancecokr = async (
  url: string,
  html: string
): Promise<OptionResult> => {
  const values = {
    Size: [],
  };
  const isSoldout = [];

  const { data: optionData } = await axios.post(
    'https://mainstance.co.kr/shop/load_option.cm',
    `prod_idx=${url.match(/(\d+)$/)[1]}`,
    {
      headers: {
        referer: 'https://mainstance.co.kr/IFELSE-Shop/?idx=71',
        'content-type': 'application/x-www-form-urlencoded',
      },
    }
  );
  const $ = cheerio.load(optionData.option_html);

  $('div.dropdown-item > a > span.margin-bottom-lg').each((_, ele) => {
    values.Size.push((ele as cheerio.TagElement).children[0].data);
  });
  $('div.dropdown-item > a > span.no-margin > strong').each((index, ele) => {
    if ((ele as cheerio.TagElement).children[0].data.includes('품절')) {
      isSoldout.push([index]);
    }
  });

  return {
    values,
    isSoldout,
    optionPriceVariants: [],
    productPriceVariants: [],
  };
};
