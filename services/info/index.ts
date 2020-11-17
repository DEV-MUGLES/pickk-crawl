import axios from 'axios';
import * as cheerio from 'cheerio';
import * as yaml from 'js-yaml';
import * as fs from 'fs';
import * as path from 'path';

import * as crawlers from './crawlers';
import phanties from './phanties';

import { requestHtml, correct, selectAll, getHostName } from '../../lib';
import { InfoResult, InfoSelectors } from '../../types';
import { brandNames } from './brand-names';

export default class InfoCrawlService {
  private url: string;
  private host: string;
  private selectors: InfoSelectors;

  constructor(url: string) {
    this.url = encodeURI(url);
    this.host = this.getHost(this.url);
    this.selectors = this.getSelectors(this.host);
  }

  private getHost = (url: string): string => getHostName(url);

  private getSelectors = (host: string): InfoSelectors => {
    const selectors = yaml.safeLoad(
      fs.readFileSync(path.resolve(__dirname, './selectors.yml'), 'utf8')
    );

    return selectors[host] || selectors['base'];
  };

  public crawl = async (html?: string): Promise<InfoResult> => {
    if (phanties.includes(this.host)) {
      return axios
        .get(`https://pickk-crawl.tk/info/?url=${this.url}`)
        .then((res) => correct(res.data));
    }

    const body = html || (await requestHtml(this.url));
    const $ = cheerio.load(body);

    const crawlerName = '_' + this.host.replace(/\.|-|_|\//g, '');

    const result = correct(
      (crawlers[crawlerName] || selectAll)($, this.selectors)
    );

    const brandHost =
      this.host.indexOf('m.') === 0 ? this.host.slice(2) : this.host;

    const images =
      result.images
        ?.filter((image) => image)
        ?.map((image) => correctImageUrl(image, new URL(this.url).hostname)) ||
      [];

    return {
      ...result,
      brandKor: brandNames[brandHost] || result.brandKor,
      images,
      isSoldout: result.isSoldout || false,
    };
  };
}

export const correctImageUrl = (imageUrl: string, hostname: string): string => {
  const baseUrl = `https://${hostname}`;

  if (imageUrl.indexOf('//') === 0) {
    return `https:${imageUrl}`;
  }
  if (imageUrl[0] === '/') {
    return baseUrl + imageUrl;
  }
  return imageUrl;
};
