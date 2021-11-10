import { NowResponse } from '@now/node';

import * as crawlers from '../../src/crawlers';

export default (_, res: NowResponse) => {
  const carriers = Object.values(crawlers).map(({ carrierId, info }) => ({
    id: carrierId,
    ...info,
  }));

  res.json(carriers);
};
