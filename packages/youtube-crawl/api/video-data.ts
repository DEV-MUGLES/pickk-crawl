import { VercelRequest, VercelResponse } from '@vercel/node';

import { YoutubeCrawlService } from '../services';

export default async (req: VercelRequest, res: VercelResponse) => {
  try {
    const $youtube = await YoutubeCrawlService.load(req.query.code as string);
    const videoData = await $youtube.scrapVideoData();
    res.json(videoData);
  } catch (err) {
    res.status(500).send({
      message: err ? err.message : '',
    });
  }
};
