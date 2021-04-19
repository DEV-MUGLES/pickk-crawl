import axios from 'axios';

import * as scrapers from './scrapers';
import * as crawlers from './crawlers';
import puppeties from './puppeties';

import { requestHtml, getHostName } from '../../lib';

export default class OptionCrawlService {
  private url: string;
  private crawlerName: string;

  constructor(url: string) {
    this.url = encodeURI(url);
    this.crawlerName = '_' + getHostName(this.url).replace(/\.|-|_|\//g, '');
  }

  crawl = async (inputHtml?: string): Promise<any> => {
    if (puppeties.includes(getHostName(this.url))) {
      return axios
        .get(`https://13.125.36.195/api/crawl/option/?url=${this.url}`, {
          timeout: 30000,
        })
        .then((res) => res.data);
    }

    const html = inputHtml || (await requestHtml(this.url));

    if (scrapers[this.crawlerName]) {
      return await scrapers[this.crawlerName](this.url, html);
    }

    return (crawlers[this.crawlerName] || crawlers.cafe24)(this.url, html)
      .result;
  };
}
