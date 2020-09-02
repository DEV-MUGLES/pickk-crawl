import axios from 'axios';

import * as crawlers from './crawlers';
import phanties from './phanties';

import { requestHtml, getHostName } from '../../lib';

export default class OptionCrawlService {
  private url: string;
  private crawlerName: string;

  constructor(url: string) {
    this.url = encodeURI(url);
    this.crawlerName = '_' + getHostName(this.url).replace(/\.|-|_|\//g, '');
  }

  crawl = async (): Promise<any> => {
    if (phanties.includes(getHostName(this.url))) {
      console.log(this.url);
      return axios
        .get(`https://pickk-crawl.tk/option/?url=${this.url}`)
        .then((res) => res.data);
    }

    const html = await requestHtml(this.url);
    return (crawlers[this.crawlerName] || crawlers.cafe24)(this.url, html)
      .result;
  };
}
