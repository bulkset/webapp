import { Router } from 'express';
import { getChannelSettings, updateChannelSettings } from '../db.js';

const router = Router();

router.get('/settings', (req, res) => {
  const settings = getChannelSettings();
  res.json({
    facebookLink: settings.facebook_link,
    twitterLink: settings.twitter_link,
    instagramLink: settings.instagram_link,
  });
});

router.post('/settings', (req, res) => {
  const { facebookLink, password } = req.body;
  const adminPassword = process.env.ADMIN_PASSWORD;
  
  // Проверка пароля
  if (!password || password !== adminPassword) {
    res.status(401).json({ error: 'Unauthorized: invalid password' });
    return;
  }
  
  // Обновляем только facebookLink
  const settings = updateChannelSettings({ facebook_link: facebookLink || '' });
  res.json({
    facebookLink: settings.facebook_link,
    twitterLink: settings.twitter_link,
    instagramLink: settings.instagram_link,
  });
});

export default router;
