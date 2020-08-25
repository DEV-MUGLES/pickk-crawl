import * as crawlers from './crawlers';

import { requestHtml, getHostName } from '../../lib';

export default class OptionCrawlService {
  private url: string;
  private crawlerName: string;

  constructor(url: string) {
    this.url = encodeURI(url);
    this.crawlerName = '_' + getHostName(this.url).replace(/\.|-|_|\//g, '');
  }

  crawl = async (): Promise<any> => {
    const html = await requestHtml(this.url);
    return crawlers[this.crawlerName](this.url, html);
  };
}
