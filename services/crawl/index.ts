import * as cheerio from 'cheerio';
import * as yaml from 'js-yaml';
import * as fs from 'fs';
import * as path from 'path';

import * as crawlers from './crawlers';

import { ISelecter } from '../../interfaces/ISelecter';
import { requestHtml, parseValue, correct } from '../../lib';
import { CrawlResult } from '../../types/Crawl';

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
    return new URL(url).hostname.replace('www.', '');
  };

  private getSelecter = (host: string): ISelecter => {
    const selecters = yaml.safeLoad(
      fs.readFileSync(path.resolve(__dirname, './selecters.yml'), 'utf8')
    );
    return selecters[host] || selecters.base;
  };

  public crawl = async (): Promise<CrawlResult> => {
    const body = await requestHtml(this.url);
    const $ = cheerio.load(body);

    const crawlerName = this.host.replace(/\./g, '');
    if (crawlers[crawlerName]) {
      return crawlers[crawlerName]($, this.selecter);
    }

    const result = Object.keys(this.selecter).reduce((acc, key) => {
      return {
        ...acc,
        [key]: parseValue($, key, this.selecter[key]),
      };
    }, {} as CrawlResult);
    return correct(result);
  };
}
