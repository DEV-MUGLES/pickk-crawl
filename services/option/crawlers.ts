import OptionCralwer from './Crawler';
import { OptionResult } from 'types/option';

export const cafe24 = (url: string, html: string): OptionResult => {
  return new OptionCralwer(url, html).cafe24().result;
};

const smartstore = (url: string, html: string): OptionResult => {
  return new OptionCralwer(url, html).smartstore().result;
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

export const _ojoskr = _nomanualofficialcom;

export const _dgrecokr = _nomanualofficialcom;

export const _oohahhcokr = (url: string, html: string): OptionResult => {
  return new OptionCralwer(url, html)
    .crawlOptionNames(
      'form.variations_form.cart > table > tbody > tr > td.label > label'
    )
    .crawlValues(
      'form.variations_form.cart > table > tbody > tr > td.value > select',
      'option',
      () => false, // 옵션 개별 품절 여부는 보류중
      0,
      1
    ).result;
};

export const _hyojicokr = (url: string, html: string): OptionResult => {
  return new OptionCralwer(url, html)
    .crawlOptionNames(
      'div.info > div.table-opt > table > tbody > tr > td > div.opt-wrap > dl:nth-child(1) > dt'
    )
    .crawlValues(
      'div.info > div.table-opt > table > tbody > tr > td > div.opt-wrap > dl:nth-child(1) > dd',
      'option',
      null,
      0,
      1
    )
    .checkItemIsSoldout(
      'div.table-opt tbody tr p.soldout',
      (ins) => ins.text().search('품절') > -1
    ).result;
};

export const _smartstorenavercomjuanhomme = smartstore;
