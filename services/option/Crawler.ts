import {
  getCafe24Data,
  formatCafe24Data,
  getCafe24OptionNames,
} from '../../lib';
import { OptionResult } from '../../types/option';

export default class OptionCralwer {
  url: string;
  html: string;
  optionNames: string[];
  result: OptionResult;

  constructor(url: string, html: string) {
    this.url = url;
    this.html = html;
    this.result = {} as OptionResult;
  }

  cafe24 = (): OptionCralwer => {
    this.optionNames = getCafe24OptionNames(this.html);
    const data = getCafe24Data(this.html);
    const option = formatCafe24Data(data, this.optionNames);

    this.result = { ...this.result, ...option };
    return this;
  };
}
