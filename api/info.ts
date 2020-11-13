import { NowRequest, NowResponse } from '@now/node';
import InfoCrawlService from '../services/info';

export default async (req: NowRequest, res: NowResponse) => {
  const { url } = req.query;
  const infoCrawlServiceInstance = new InfoCrawlService(url.toString());

  try {
    const data = await infoCrawlServiceInstance.crawl();
    res.json({ ...data, url });
  } catch (err) {
    res.status(500).send({
      message: err ? err.message : '',
    });
  }
};
