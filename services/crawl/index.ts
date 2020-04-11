import * as cheerio from 'cheerio';
import * as yaml from 'js-yaml';
import * as fs from 'fs';
import * as path from 'path';

import * as crawlers from './crawlers';

import { ISelecter } from '../../interfaces/ISelecter';
import { requestHtml, parseValue, correct, selectAll } from '../../lib';
import { CrawlResult } from '../../types/Crawl';
import { brandNames } from './brand-names';

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

    const crawlerName = this.host.replace(/\.|-/g, '');

    const result = correct(
      (crawlers[crawlerName] || selectAll)($, this.selecter)
    );

    return {
      ...result,
      brandKor:
        brandNames[this.host] !== undefined
          ? brandNames[this.host]
          : result.brandKor,
    };
  };
}
