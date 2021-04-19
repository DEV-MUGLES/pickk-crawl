import axios from 'axios';
import * as cheerio from 'cheerio';
import * as yaml from 'js-yaml';
import * as fs from 'fs';
import * as path from 'path';

import * as crawlers from './crawlers';
import puppeties from './puppeties';

import { requestHtml, correct, getHostName } from '../../lib';
import { InfoResult, InfoSelectors } from '../../types';
import { brandNames, getBrandKor } from './brand-names';

export default class InfoCrawlService {
  private url: string;
  private host: string;
  private selectors: InfoSelectors;
  public result: InfoResult;

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

  public crawl = async (html?: string): Promise<InfoCrawlService> => {
    if (puppeties.includes(this.host)) {
      return axios
        .get(`http://13.125.36.195/api/crawl/info/?url=${this.url}`, {
          timeout: 30000,
        })
        .then((res) => {
          this.result = correct(res.data);
          return this;
        });
    }

    const crawlerName = '_' + this.host.replace(/\.|-|_|\//g, '');
    const $ = await getCheerio(html, this.url);

    const result = correct(
      await crawlers[crawlerName]($, this.selectors, this.url)
    );

    this.result = result;
    return this;
  };

  public formatBrandKor = (): InfoCrawlService => {
    const brandHost = this.host.replace(/^m\./, '');

    this.result = {
      ...this.result,
      brandKor: brandNames[brandHost] || getBrandKor(this.result.brandKor),
    };

    return this;
  };

  public formatImages = (): InfoCrawlService => {
    const images =
      this.result.images
        ?.filter((image) => image)
        ?.map((image) => {
          try {
            return decodeURI(
              correctImageUrl(image, new URL(this.url).hostname)
            );
          } catch {
            return null;
          }
        })
        ?.filter((image) => image) || [];

    this.result = {
      ...this.result,
      images,
    };

    return this;
  };

  public formatIsSoldout = (): InfoCrawlService => {
    this.result = {
      ...this.result,
      isSoldout: this.result.isSoldout || false,
    };

    return this;
  };
}

export const getCheerio = async (html, url) => {
  let body;
  try {
    body = html || (await requestHtml(url));
  } catch (error) {
    body = '';
  }

  return cheerio.load(body);
};

export const formatResult = (result: InfoResult, host: string, url: string) => {
  if (!result || !host || !url) {
    return null;
  }

  const brandHost = host.indexOf('m.') === 0 ? host.slice(2) : host;
  const brandKor = brandNames[brandHost] || getBrandKor(result.brandKor);

  const images =
    result.images
      ?.filter((image) => image)
      ?.map((image) => {
        try {
          return decodeURI(correctImageUrl(image, new URL(url).hostname));
        } catch {
          return null;
        }
      })
      ?.filter((image) => image) || [];

  return {
    ...result,
    brandKor,
    images,
    isSoldout: result.isSoldout || false,
  };
};

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
