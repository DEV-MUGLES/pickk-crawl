import axios from 'axios';

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
        .get(`https://pickk-crawl.tk/api/crawl/option/?url=${this.url}`)
        .then((res) => res.data);
    }

    const html = inputHtml || (await requestHtml(this.url));
    return (crawlers[this.crawlerName] || crawlers.cafe24)(this.url, html)
      .result;
  };
}
