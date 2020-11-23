import * as cheerio from 'cheerio';

import {
  getCafe24Data,
  formatCafe24Data,
  getCafe24OptionNames,
  getSmartstoreOptionData,
  getMakeshopOptionData,
  getAllCombination,
  cleanUpString,
} from '../../lib';
import { OptionResult } from '../../types/option';

export default class OptionCralwer {
  private url: string;
  private html: string;
  private optionNames: string[];
  private $: CheerioStatic;
  result: OptionResult;

  constructor(url: string, html: string) {
    this.url = url;
    this.html = html;
    this.$ = cheerio.load(html);
    this.optionNames = [];
    this.result = {
      values: {},
      isSoldout: [],
      optionPriceVariants: [],
      productPriceVariants: [],
    } as OptionResult;
  }

  cafe24 = (): OptionCralwer => {
    try {
      this.optionNames = getCafe24OptionNames(this.html);
      const data = getCafe24Data(this.html);
      const option = formatCafe24Data(data, this.optionNames);

      this.result = { ...this.result, ...option };
      return this;
    } catch {
      return this;
    }
  };

  smartstore = (): OptionCralwer => {
    this.result = { ...this.result, ...getSmartstoreOptionData(this.html) };
    return this;
  };

  makeshop = (): OptionCralwer => {
    const { optionNames, result } = getMakeshopOptionData(this.html);
    this.optionNames = optionNames;
    this.result = { ...this.result, ...result };

    return this;
  };

  crawlOptionNames = (
    selector: string,
    startIndex: number = 0,
    attributeName?: string
  ): OptionCralwer => {
    this.result.values = {};

    this.$(selector).each((index, ele) => {
      if (index < startIndex) {
        return;
      }
      const optionName = (attributeName
        ? ele.attribs[attributeName]
        : ele.children[0].data
      )?.toString();
      this.optionNames.push(optionName);
      this.result.values[optionName] = [];
    });
    return this;
  };

  // checkIsSoldout은 option이 1가지일 때만 정상 작동합니다.
  crawlValues = (
    containerSelector: string,
    valueSelector: string,
    checkIsSoldout: (ele: CheerioElement) => boolean,
    containerStartIndex: number = 0,
    valueStartIndex: number = 0
  ): OptionCralwer => {
    this.$(containerSelector).each((i, container) => {
      if (i < containerStartIndex) {
        return;
      }
      const inner$ = cheerio.load(container);
      inner$(valueSelector).each((j, ele) => {
        if (j < valueStartIndex) {
          return;
        }
        this.result.values[this.optionNames[i - containerStartIndex]].push(
          cleanUpString(ele.children[0].data.toString())
        );
        if (checkIsSoldout?.(ele)) {
          this.result.isSoldout.push([j - valueStartIndex]);
        }
      });
    });
    return this;
  };

  // 옵션 단위 품절 check가 불가능하고, 아이템 단위 품절 check만 가능할 때 사용합니다. 아이템이 품절인 경우 모든 옵션을 품절로 처리합니다.
  checkitemIsSoldout = (
    selector: string,
    checkIsSoldout?: (ins: Cheerio) => boolean
  ): OptionCralwer => {
    const cheerioInstance = this.$(selector);
    const isSoldout = checkIsSoldout
      ? checkIsSoldout(cheerioInstance)
      : !cheerioInstance.hasClass('displaynone');

    if (!isSoldout) {
      return this;
    }

    const sizes = this.optionNames.map(
      (optionName) => this.result.values[optionName].length
    );
    getAllCombination([], sizes, this.result.isSoldout);

    return this;
  };
}
