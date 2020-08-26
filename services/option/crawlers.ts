import OptionCralwer from './Crawler';
import { OptionResult } from 'types/option';

export const cafe24 = (url: string, html: string): OptionResult => {
  return new OptionCralwer(url, html).cafe24().result;
};

export const _josephtcokr = (url: string, html: string): OptionResult => {
  return new OptionCralwer(url, html)
    .crawlOptionNames('div.item_add_option_box > dl > dt')
    .crawlValues(
      'div.item_add_option_box > dl > dd > select',
      'option',
      (ele) => ele.children[0].data.includes('품절'),
      0,
      1
    ).result;
};

export const _nomanualofficialcom = (
  url: string,
  html: string
): OptionResult => {
  return new OptionCralwer(url, html)
    .crawlOptionNames(
      'div.shopProductOptionListDiv > div > span.custom-select-option-name'
    )
    .crawlValues(
      'div.shopProductOptionListDiv > div.productOption > div.customSelectDiv',
      'div.custom-select-option-info',
      (ele) => ele.children[0].data.includes('품절'),
      1,
      1
    ).result;
};
