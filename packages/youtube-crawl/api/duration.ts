import { VercelRequest, VercelResponse } from '@vercel/node';

import { YoutubeCrawlService } from '../services';

export default async (req: VercelRequest, res: VercelResponse) => {
  try {
    const { code } = req.query;
    const $youtube = await YoutubeCrawlService.load(code as string);
    const { durationMs } = await $youtube.scrapVideoData();
    res.json({ duration: durationMs });
  } catch (err) {
    res.status(400).send({ error: err });
  }
};
