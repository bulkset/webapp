import { Router } from 'express';
import { getChannelSettings } from '../db.js';

const router = Router();

router.get('/settings', (req, res) => {
  const settings = getChannelSettings();
  res.json({
    telegramLink: settings.telegram_link,
    twitterLink: settings.twitter_link,
    instagramLink: settings.instagram_link,
  });
});

export default router;
