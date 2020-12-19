import BaseCrawler from '../crawlers/base';
import * as crawlers from '../crawlers';

export const getCrawler = (carrierId: string): typeof BaseCrawler => {
  const Crawler = Object.values(crawlers).find(
    (crawler) => crawler.carrierId === carrierId
  );

  return Crawler;
};
