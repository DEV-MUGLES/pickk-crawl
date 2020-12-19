import { NowRequest, NowResponse } from '@now/node';

import TrackService from '../../../../src/services/track';
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
    const trackServiceInstance = new TrackService(
      carrierId.toString(),
      trackingCode.toString()
    );
    res.json({ carrierId, trackingCode });
  } catch (err) {
    res.status(500).send({
      message: err ? err.message : '',
    });
  }
};
