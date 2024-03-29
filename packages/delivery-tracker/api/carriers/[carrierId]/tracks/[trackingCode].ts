import * as Sentry from '@sentry/node';
import { NowRequest, NowResponse } from '@now/node';

import { getCrawler } from '../../../../src/lib';

Sentry.init({ dsn: process.env.NEXT_PUBLIC_SENTRY_DSN });

export default async (req: NowRequest, res: NowResponse) => {
  const { carrierId, trackingCode } = req.query;

  if (!carrierId || !trackingCode) {
    res.status(400).send({
      message: 'Bad Request',
    });
    return;
  }

  const crawler = getCrawler(carrierId.toString());
  if (!crawler) {
    Sentry.captureException({
      code: 404,
      carrierId,
      trackingCode,
      message: `${carrierId} is not supported carrier`,
    });
    res.status(404).send({
      message: 'not supported carrier',
    });
    return;
  }

  try {
    const crawlerInstance = new crawler(trackingCode.toString());
    const result = await crawlerInstance.crawl();
    res.json({
      carrier: {
        id: carrierId,
        ...crawler.info,
      },
      ...result,
    });
  } catch (err) {
    const code = err.code || 500;

    if (code === 500) {
      Sentry.captureException(err);
    }

    res.status(code).send({
      message: err?.message || '',
    });
  }
};
