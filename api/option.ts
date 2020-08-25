import { NowRequest, NowResponse } from '@now/node';
import OptionCrawlService from '../services/option';

export default async (req: NowRequest, res: NowResponse) => {
  const { url } = req.query;

  try {
    const optionCrawlService = new OptionCrawlService(url.toString());
    const data = await optionCrawlService.crawl();
    res.json({ ...data, url });
  } catch (err) {
    res.status(500).send({
      message: err ? err.message : '',
    });
  }
};
