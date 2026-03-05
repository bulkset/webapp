import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import postsRouter from './routes/posts.js';
import channelRouter from './routes/channel.js';
import { initDb, getDb, getAllPosts } from './db.js';
import { startBot } from './bot/index.js';
import { initLikeBoost } from './likeBoost.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function main() {
  // Initialize database
  await initDb();

  const app = express();
  const PORT = process.env.PORT || 3001;

  // Middleware
  app.use(cors());
  app.use(express.json());

  // Serve uploaded images
  app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

  // API routes
  app.use('/api/posts', postsRouter);
  app.use('/api/channel', channelRouter);

  // Health check
  app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok' });
  });

  // Debug endpoint — check DB instance identity
  app.get('/api/debug/db', (_req, res) => {
    const db = getDb();
    const globalDb = (globalThis as Record<string, unknown>)['__webapp_sqljs_db__'];
    const posts = getAllPosts();
    res.json({
      hasDb: !!db,
      hasGlobalDb: !!globalDb,
      sameInstance: db === globalDb,
      postCount: posts.length,
      posts: posts.map((p: { id: number; description: string }) => ({ id: p.id, desc: p.description?.substring(0, 50) })),
    });
  });

  // Start like boost system
  initLikeBoost();

  // Start Telegram bot (webhook mode — needs app for route)
  if (process.env.TELEGRAM_BOT_TOKEN && process.env.TELEGRAM_BOT_TOKEN !== 'your_bot_token_here') {
    startBot(app);
  } else {
    console.warn('TELEGRAM_BOT_TOKEN not set, bot will not start');
  }

  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

main().catch(console.error);
