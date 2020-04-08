import axios from 'axios';
import * as cheerio from 'cheerio';
import * as yaml from 'js-yaml';
import * as fs from 'fs';
import * as path from 'path';

import { ISelecter } from 'interfaces/ISelecter';

export default class CrawlService {
  private url: string;
  private host: string;
  private selecter: ISelecter;

  constructor(url: string) {
    this.url = encodeURI(url);
    this.host = this.getHost(this.url);
    this.selecter = this.getSelecter(this.host);
  }

  private getHost = (url: string): string => {
    return new URL(url).hostname;
  };

  private getSelecter = (host: string): ISelecter => {
    const selecters = yaml.safeLoad(
      fs.readFileSync(path.resolve(__dirname, './selecters.yml'), 'utf8')
    );
    return selecters[host] || selecters.base;
  };

  public crawl = async () => {
    const { data: body } = await axios(this.url);
    const $ = cheerio.load(body);
    return Object.keys(this.selecter).reduce((acc, key) => {
      return {
        ...acc,
        [key]: this.getValue($, key, this.selecter[key]),
      };
    }, {});
  };

  private getValue = ($: CheerioStatic, key: string, selecter: string) => {
    if (selecter.includes('meta')) {
      return $(selecter).last().attr().content;
    }
    if (key === 'originalPrice' || key === 'salePrice') {
      return $(selecter)
        .last()
        .text()
        .replace(/[^0-9]/g, '');
    }
    return $(selecter).last().text().trim();
  };
}
