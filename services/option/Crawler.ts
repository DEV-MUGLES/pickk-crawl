import * as cheerio from 'cheerio';

import {
  getCafe24Data,
  formatCafe24Data,
  getCafe24OptionNames,
  cleanUpString,
} from '../../lib';
import { OptionResult } from '../../types/option';

export default class OptionCralwer {
  private url: string;
  private html: string;
  private optionNames: string[];
  result: OptionResult;

  constructor(url: string, html: string) {
    this.url = url;
    this.html = html;
    this.optionNames = [];
    this.result = {
      isSoldOut: [],
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

  crawlOptionNames = (
    selector: string,
    startIndex: number = 0
  ): OptionCralwer => {
    this.result.values = {};

    const $ = cheerio.load(this.html);
    $(selector).each((index, ele) => {
      if (index < startIndex) {
        return;
      }
      const optionName = ele.children[0].data.toString();
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
    const $ = cheerio.load(this.html);
    $(containerSelector).each((i, container) => {
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
          this.result.isSoldOut.push([j - valueStartIndex]);
        }
      });
    });
    return this;
  };
}
