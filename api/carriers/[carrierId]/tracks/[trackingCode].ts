import { NowRequest, NowResponse } from '@now/node';

import { getCrawler } from '../../../../src/lib';

export default async (req: NowRequest, res: NowResponse) => {
  const { carrierId, trackingCode } = req.query;

  const crawler = getCrawler(carrierId.toString());
  if (!crawler) {
    res.status(404).send({
      message: 'not supported carrier',
    });
    return;
  }

  try {
    const crawlerInstance = new crawler(trackingCode.toString());
    const result = await crawlerInstance.crawl();
    res.json(result);
  } catch (err) {
    res.status(500).send({
      message: err ? err.message : '',
    });
  }
};
