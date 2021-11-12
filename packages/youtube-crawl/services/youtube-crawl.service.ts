import axios from 'axios';
import * as cheerio from 'cheerio';

import { YOUTUBE_BASE_URL } from '../constants';
import {
  getViewCountFrom,
  hasVideoData,
  getDurationMsFrom,
  convertToSecond,
} from '../helpers';
import { VideoData } from '../types';

export class YoutubeCrawlService {
  constructor(private readonly html: string, private readonly code: string) {}

  static async load(code: string) {
    const { data: html } = await axios({
      method: 'get',
      baseURL: YOUTUBE_BASE_URL,
      params: {
        v: code,
      },
    });
    return new YoutubeCrawlService(html, code);
  }

  async scrapVideoData(): Promise<VideoData> {
    const $ = cheerio.load(this.html);
    const scripts = $('script').contents().toArray();
    const { data } = scripts.filter(hasVideoData)[0];

    return {
      code: this.code,
      viewCount: getViewCountFrom(data),
      duration: convertToSecond(getDurationMsFrom(data)),
    };
  }
}
