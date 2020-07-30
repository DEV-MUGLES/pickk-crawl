import axios from 'axios';
import * as cheerio from 'cheerio';
import * as yaml from 'js-yaml';
import * as fs from 'fs';
import * as path from 'path';

import * as crawlers from './crawlers';
import phanties from './phanties';

import { ISelecter } from '../../interfaces/ISelecter';
import { requestHtml, correct, selectAll, getHostName } from '../../lib';
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

  private getHost = (url: string): string => getHostName(url);

  private getSelecter = (host: string): ISelecter => {
    const selecters = yaml.safeLoad(
      fs.readFileSync(path.resolve(__dirname, './selecters.yml'), 'utf8')
    );

    return selecters[host] || selecters.base;
  };

  public crawl = async (): Promise<CrawlResult> => {
    if (phanties.includes(this.host)) {
      return axios
        .get(`https://pickk-crawl.tk/info/?url=${this.url}`)
        .then((res) => correct(res.data));
    }

    const body = await requestHtml(this.url);
    const $ = cheerio.load(body);

    const crawlerName = '_' + this.host.replace(/\.|-|_|\//g, '');

    const result = correct(
      (crawlers[crawlerName] || selectAll)($, this.selecter)
    );

    const brandHost =
      this.host.indexOf('m.') === 0 ? this.host.slice(2) : this.host;

    const correctImageUrl = (imageUrl: string): string => {
      const baseUrl = `https://${new URL(this.url).hostname}`;

      if (imageUrl.indexOf('//') === 0) {
        return `https:${imageUrl}`;
      }
      if (imageUrl[0] === '/') {
        return baseUrl + imageUrl;
      }
      return imageUrl;
    };
    const images = result.images?.map(correctImageUrl) || [];

    return {
      ...result,
      brandKor: brandNames[brandHost] || result.brandKor,
      images,
    };
  };
}
