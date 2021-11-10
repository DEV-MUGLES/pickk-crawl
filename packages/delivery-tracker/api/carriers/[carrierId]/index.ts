import { NowRequest, NowResponse } from '@now/node';

import { getCrawler } from '../../../src/lib';

export default (req: NowRequest, res: NowResponse) => {
  const { carrierId } = req.query;

  const crawler = getCrawler(carrierId.toString());
  if (!crawler) {
    res.status(404).send({
      message: 'not supported carrier',
    });
    return;
  }

  res.json({
    id: crawler.carrierId,
    ...crawler.info,
  });
};
