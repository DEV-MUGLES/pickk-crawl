import axios from 'axios';
import * as cheerio from 'cheerio';

import { YOUTUBE_BASE_URL } from '../constants';
import { getViewCountFrom, hasVideoData, getDurationFrom } from '../helpers';
import { VideoData } from '../types';

export class YoutubeCrawlService {
  private readonly html: string;

  constructor(html: string) {
    this.html = html;
  }

  static async load(code: string) {
    const { data } = await axios({
      method: 'get',
      baseURL: YOUTUBE_BASE_URL,
      params: {
        v: code,
      },
    });
    return new YoutubeCrawlService(data);
  }

  async scrapVideoData(): Promise<VideoData> {
    const $ = cheerio.load(this.html);
    const scripts = $('script').contents().toArray();
    const { data } = scripts.filter(hasVideoData)[0];

    return {
      viewCount: getViewCountFrom(data),
      durationMs: getDurationFrom(data),
    };
  }
}
