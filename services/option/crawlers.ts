import OptionCralwer from './Crawler';

export const cafe24 = (url: string, html: string): OptionCralwer => {
  return new OptionCralwer(url, html).cafe24();
};

export const _smartstorenavercom = (
  url: string,
  html: string
): OptionCralwer => {
  return new OptionCralwer(url, html).smartstore();
};

const makeshop = (url: string, html: string): OptionCralwer => {
  return new OptionCralwer(url, html).makeshop();
};

const sixshop = (url: string, html: string): OptionCralwer => {
  return new OptionCralwer(url, html)
    .crawlOptionNames(
      '#shopProductContentInfo > div.shopProductOptionListDiv > div.productOption > span.custom-select-option-name'
    )
    .crawlValues(
      '#shopProductContentInfo > div.shopProductOptionListDiv > div.productOption > div.customSelectDiv > div.selectBox > div.custom-select-box-list-inner',
      'div.custom-select-option > div.custom-select-option-info',
      (ele) => ele.children[0].data.includes('품절'),
      0,
      1
    );
};

export const _josephtcokr = (url: string, html: string): OptionCralwer => {
  return new OptionCralwer(url, html)
    .crawlOptionNames('div.item_add_option_box > dl > dt')
    .crawlValues(
      'div.item_add_option_box > dl > dd > select',
      'option',
      (ele) => ele.children[0].data.includes('품절'),
      0,
      1
    );
};

export const _nomanualshopcom = (url: string, html: string): OptionCralwer => {
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
    );
};

export const _ojoskr = _nomanualshopcom;

export const _dgrecokr = _nomanualshopcom;

export const _oohahhcokr = (url: string, html: string): OptionCralwer => {
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
    );
};

export const _inrowscokr = makeshop;

export const _hyojicokr = (url: string, html: string): OptionCralwer =>
  makeshop(url, html);

export const _coorkr = (url: string, html: string): OptionCralwer => {
  return new OptionCralwer(url, html)
    .crawlOptionNames(
      '#form1 > div > div.table-opt > table > tbody > tr:nth-child(2) > td > div > dl:not(:last-child) > dd > select',
      0,
      'label'
    )
    .crawlValues(
      '#form1 > div > div.table-opt > table > tbody > tr:nth-child(2) > td > div > dl:nth-child(1) > dd > select',
      'option',
      (ele) => ele.children[0].data.includes('품절'),
      0,
      1
    )
    .checkitemIsSoldout(
      '#form1 > div > div.prd-btns > div:nth-child(1)',
      (ins) => ins.text().search('SOLD OUT') > -1
    );
};

export const _personalpackcom = (url: string, html: string): OptionCralwer => {
  return new OptionCralwer(url, html)
    .crawlOptionNames('#poweroption > tbody > tr:nth-child(2) > td.vo_title')
    .crawlValues(
      '#optionlist_0',
      'option',
      (ele) => ele.children[0].data.includes('품절'),
      0,
      1
    )
    .checkitemIsSoldout(
      '#soldout_out',
      (ins) => ins.text().search('품절') > -1
    );
};

export const _aecawhitecom = (url: string, html: string): OptionCralwer => {
  return new OptionCralwer(url, html)
    .crawlOptionNames(
      'tbody.xans-product-option > tr > td > select',
      0,
      'option_title'
    )
    .crawlValues(
      'select',
      'option',
      (ele) => ele.children[0].data.includes('SOLD OUT'),
      0,
      2,
      (value) => value.split('[')[0]
    )
    .checkitemIsSoldout(
      '#soldout_out',
      (ins) => ins.text().search('SOLD OUT') > -1
    );
};

export const _longvacakr = sixshop;

export const _kutletshopcom = (url: string, html: string): OptionCralwer => {
  return new OptionCralwer(url, html)
    .crawlOptionNames(
      '#shopProductContentInfo span.custom-select-option-name',
      0
    )
    .crawlValues(
      '#shopProductContentInfo div.productOption > div.customSelectDiv',
      'div.custom-select-option-info',
      (ele) => ele.children[0].data.includes('품절'),
      0,
      1,
      (value) => value.split('(')[0].trim()
    )
    .checkitemIsSoldout(
      '#shopProductCartErrorDiv',
      (ins) => !ins.hasClass('hide')
    );
};

export const _v2koreacokr = (url: string, html: string): OptionCralwer => {
  return new OptionCralwer(url, html)
    .cafe24()
    .checkitemIsSoldout('div.infoArea div.btnArea span');
};
