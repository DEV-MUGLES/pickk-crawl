import { NowRequest, NowResponse } from '@now/node';
import CrawlService from '../services/crawl';

export default async (req: NowRequest, res: NowResponse) => {
  const { url } = req.query;
  const crawlServiceInstance = new CrawlService(url.toString());
  try {
    const data = await crawlServiceInstance.crawl();
    res.json({ ...data, url });
  } catch (err) {
    res.status(500).send({
      message: err ? err.message : '',
    });
  }
};
