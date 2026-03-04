import { Router, type Request, type Response } from 'express';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import {
  getAllPosts, getPostsPaginated, getLastPosts, getPostById, createPost, updatePost, deletePost,
  incrementLike, decrementLike, type PostRow,
} from '../db.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const router = Router();

// Multer for image uploads
const storage = multer.diskStorage({
  destination: path.join(__dirname, '..', '..', 'uploads'),
  filename: (_req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, `post-${uniqueSuffix}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const allowed = /jpeg|jpg|png|gif|webp/;
    const extOk = allowed.test(path.extname(file.originalname).toLowerCase());
    const mimeOk = allowed.test(file.mimetype);
    cb(null, extOk && mimeOk);
  },
});

// Transform DB row (snake_case) → API response (camelCase)
function transformPost(row: PostRow) {
  return {
    id: row.id,
    description: row.description,
    detailsText: row.details_text,
    imageUrl: row.image_url,
    telegramLink: normalizeLink(row.telegram_link),
    whatsappLink: normalizeLink(row.whatsapp_link),
    instagramLink: normalizeLink(row.instagram_link),
    likeCount: row.like_count,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

// Normalize link to ensure it has proper protocol
function normalizeLink(link: string): string {
  if (!link) return '';
  // If link already has protocol, return as is
  if (link.startsWith('http://') || link.startsWith('https://') || link.startsWith('mailto:') || link.startsWith('tel:')) {
    return link;
  }
  // If link starts with // (protocol-relative), add https
  if (link.startsWith('//')) {
    return 'https:' + link;
  }
  // If link is just a domain without protocol, add https://
  return 'https://' + link;
}

// GET /api/posts/last?count=10  — single request to get last N posts + total
router.get('/last', (req: Request, res: Response) => {
  const count = Math.min(Math.max(parseInt(req.query.count as string) || 10, 1), 50);
  const { posts, total, startOffset } = getLastPosts(count);
  res.json({ success: true, data: posts.map(transformPost), total, startOffset });
});

// GET /api/posts?limit=10&offset=0
router.get('/', (req: Request, res: Response) => {
  const limit = Math.min(Math.max(parseInt(req.query.limit as string) || 0, 0), 50);
  const offset = Math.max(parseInt(req.query.offset as string) || 0, 0);

  // If no pagination params, return all (backwards compatible)
  if (!req.query.limit) {
    const posts = getAllPosts();
    res.json({ success: true, data: posts.map(transformPost) });
    return;
  }

  const { posts, total } = getPostsPaginated(limit, offset);
  res.json({ success: true, data: posts.map(transformPost), total, limit, offset });
});

// GET /api/posts/:id
router.get('/:id', (req: Request, res: Response) => {
  const post = getPostById(Number(req.params.id));
  if (!post) {
    res.status(404).json({ success: false, error: 'Post not found' });
    return;
  }
  res.json({ success: true, data: transformPost(post) });
});

// Validate and normalize social media links
function normalizeSocialLink(link: string, type: 'telegram' | 'whatsapp' | 'instagram'): string {
  if (!link) return '';
  
  // Remove leading/trailing whitespace
  let normalized = link.trim();
  
  // Already has proper protocol
  if (normalized.startsWith('http://') || normalized.startsWith('https://')) {
    return normalized;
  }
  
  // Protocol-relative URL
  if (normalized.startsWith('//')) {
    return 'https:' + normalized;
  }
  
  // Add https:// for bare domains
  if (!normalized.startsWith('http://') && !normalized.startsWith('https://') && !normalized.startsWith('://')) {
    return 'https://' + normalized;
  }
  
  return normalized;
}

// POST /api/posts
router.post('/', (req: Request, res: Response) => {
  const { description, imageUrl, telegramLink, whatsappLink, instagramLink } = req.body;

  if (!description) {
    res.status(400).json({ success: false, error: 'description is required' });
    return;
  }

  const post = createPost({
    description,
    imageUrl: imageUrl || '',
    telegramLink: normalizeSocialLink(telegramLink || '', 'telegram'),
    whatsappLink: normalizeSocialLink(whatsappLink || '', 'whatsapp'),
    instagramLink: normalizeSocialLink(instagramLink || '', 'instagram'),
  });

  if (!post) {
    res.status(500).json({ success: false, error: 'Failed to create post' });
    return;
  }

  res.status(201).json({ success: true, data: transformPost(post) });
});

// PUT /api/posts/:id
router.put('/:id', (req: Request, res: Response) => {
  const existing = getPostById(Number(req.params.id));
  if (!existing) {
    res.status(404).json({ success: false, error: 'Post not found' });
    return;
  }
  
  // Normalize links before updating
  const fields = req.body;
  if (fields.telegramLink !== undefined) {
    fields.telegramLink = normalizeSocialLink(fields.telegramLink, 'telegram');
  }
  if (fields.whatsappLink !== undefined) {
    fields.whatsappLink = normalizeSocialLink(fields.whatsappLink, 'whatsapp');
  }
  if (fields.instagramLink !== undefined) {
    fields.instagramLink = normalizeSocialLink(fields.instagramLink, 'instagram');
  }
  
  const post = updatePost(Number(req.params.id), fields);
  if (!post) {
    res.status(500).json({ success: false, error: 'Failed to update post' });
    return;
  }
  res.json({ success: true, data: transformPost(post) });
});

// DELETE /api/posts/:id
router.delete('/:id', (req: Request, res: Response) => {
  const existing = getPostById(Number(req.params.id));
  if (!existing) {
    res.status(404).json({ success: false, error: 'Post not found' });
    return;
  }
  deletePost(Number(req.params.id));
  res.json({ success: true });
});

// POST /api/posts/:id/like
router.post('/:id/like', (req: Request, res: Response) => {
  const post = incrementLike(Number(req.params.id));
  if (!post) {
    res.status(404).json({ success: false, error: 'Post not found' });
    return;
  }
  res.json({ success: true, data: transformPost(post) });
});

// POST /api/posts/:id/unlike
router.post('/:id/unlike', (req: Request, res: Response) => {
  const post = decrementLike(Number(req.params.id));
  if (!post) {
    res.status(404).json({ success: false, error: 'Post not found' });
    return;
  }
  res.json({ success: true, data: transformPost(post) });
});

// POST /api/upload
router.post('/upload', upload.single('image'), (req: Request, res: Response) => {
  if (!req.file) {
    res.status(400).json({ success: false, error: 'No image uploaded' });
    return;
  }
  const imageUrl = `/uploads/${req.file.filename}`;
  res.json({ success: true, data: { imageUrl } });
});

export default router;
