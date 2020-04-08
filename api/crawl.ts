import { NowRequest, NowResponse } from '@now/node';
import CrawlService from '../services/crawl';

export default async (req: NowRequest, res: NowResponse) => {
  const { url } = req.query;
  const crawlServiceInstance = new CrawlService(url.toString());
  const data = await crawlServiceInstance.crawl();
  res.json({ ...data, url });
};
