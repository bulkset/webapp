import initSqlJs, { type Database as SqlJsDatabase } from 'sql.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DB_PATH = path.join(__dirname, '..', 'data', 'posts.db');

// Use globalThis to guarantee a single DB instance even if tsx duplicates modules
const GLOBAL_KEY = '__webapp_sqljs_db__';

function getDbInstance(): SqlJsDatabase {
  return (globalThis as Record<string, unknown>)[GLOBAL_KEY] as SqlJsDatabase;
}

function setDbInstance(instance: SqlJsDatabase) {
  (globalThis as Record<string, unknown>)[GLOBAL_KEY] = instance;
}

export async function initDb() {
  const SQL = await initSqlJs();

  const dir = path.dirname(DB_PATH);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

  let db: SqlJsDatabase;
  if (fs.existsSync(DB_PATH)) {
    const buffer = fs.readFileSync(DB_PATH);
    db = new SQL.Database(buffer);
  } else {
    db = new SQL.Database();
  }

  db.run(`
    CREATE TABLE IF NOT EXISTS posts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      why_title TEXT NOT NULL DEFAULT 'Why Choose Us',
      why_items TEXT NOT NULL DEFAULT '[]',
      image_url TEXT NOT NULL DEFAULT '',
      telegram_link TEXT NOT NULL DEFAULT '',
      whatsapp_link TEXT NOT NULL DEFAULT '',
      instagram_link TEXT NOT NULL DEFAULT '',
      details_text TEXT NOT NULL DEFAULT '',
      like_count INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now'))
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS channel_settings (
      id INTEGER PRIMARY KEY CHECK (id = 1),
      telegram_link TEXT NOT NULL DEFAULT '',
      whatsapp_link TEXT NOT NULL DEFAULT '',
      instagram_link TEXT NOT NULL DEFAULT '',
      updated_at TEXT NOT NULL DEFAULT (datetime('now'))
    )
  `);

  // Insert default row if not exists
  db.run(`INSERT OR IGNORE INTO channel_settings (id) VALUES (1)`);

  setDbInstance(db);
  saveDb();
  return db;
}

export function saveDb() {
  const db = getDbInstance();
  const data = db.export();
  const buffer = Buffer.from(data);
  fs.writeFileSync(DB_PATH, buffer);
}

export function getDb() {
  return getDbInstance();
}


export interface PostRow {
  id: number;
  title: string;
  description: string;
  why_title: string;
  why_items: string;
  image_url: string;
  telegram_link: string;
  whatsapp_link: string;
  instagram_link: string;
  details_text: string;
  like_count: number;
  created_at: string;
  updated_at: string;
}

function rowsToObjects(result: initSqlJs.QueryExecResult[]): PostRow[] {
  if (!result.length) return [];
  const { columns, values } = result[0]!;
  return values.map(row => {
    const obj: Record<string, unknown> = {};
    columns.forEach((col, i) => { obj[col] = row[i]; });
    return obj as unknown as PostRow;
  });
}

export function getAllPosts(): PostRow[] {
  const db = getDbInstance();
  const result = db.exec('SELECT * FROM posts ORDER BY created_at ASC');
  return rowsToObjects(result);
}

export function getPostsPaginated(limit: number, offset: number): { posts: PostRow[]; total: number } {
  const db = getDbInstance();
  const countResult = db.exec('SELECT COUNT(*) as cnt FROM posts');
  const total = countResult.length ? (countResult[0]!.values[0]![0] as number) : 0;
  const result = db.exec(`SELECT * FROM posts ORDER BY created_at ASC LIMIT ${limit} OFFSET ${offset}`);
  return { posts: rowsToObjects(result), total };
}

export function getLastPosts(count: number): { posts: PostRow[]; total: number; startOffset: number } {
  const db = getDbInstance();
  const countResult = db.exec('SELECT COUNT(*) as cnt FROM posts');
  const total = countResult.length ? (countResult[0]!.values[0]![0] as number) : 0;
  const startOffset = Math.max(0, total - count);
  const result = db.exec(`SELECT * FROM posts ORDER BY created_at ASC LIMIT ${count} OFFSET ${startOffset}`);
  return { posts: rowsToObjects(result), total, startOffset };
}

export function getPostById(id: number): PostRow | undefined {
  const db = getDbInstance();
  const stmt = db.prepare('SELECT * FROM posts WHERE id = ?');
  stmt.bind([id]);
  if (!stmt.step()) {
    stmt.free();
    return undefined;
  }
  const obj = stmt.getAsObject() as unknown as PostRow;
  stmt.free();
  return obj;
}

export function createPost(post: {
  description: string;
  imageUrl?: string;
  detailsText?: string;
  telegramLink?: string;
  whatsappLink?: string;
  instagramLink?: string;
}): PostRow | undefined {
  const db = getDbInstance();
  console.log('[createPost] DB instance:', !!db, 'globalThis key exists:', !!(globalThis as Record<string, unknown>)[GLOBAL_KEY]);
  db.run(
    `INSERT INTO posts (title, description, image_url, details_text, telegram_link, whatsapp_link, instagram_link)
    VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [
      '',
      post.description,
      post.imageUrl || '',
      post.detailsText || '',
      post.telegramLink || '',
      post.whatsappLink || '',
      post.instagramLink || '',
    ]
  );
  saveDb();

  const allPosts = getAllPosts();
  console.log('[createPost] After insert, total posts:', allPosts.length, 'DB_PATH:', DB_PATH);
  return allPosts[allPosts.length - 1];
}

export function updatePost(id: number, fields: Partial<{
  description: string;
  imageUrl: string;
  detailsText: string;
  telegramLink: string;
  whatsappLink: string;
  instagramLink: string;
}>): PostRow | undefined {
  const db = getDbInstance();
  const columnMap: Record<string, string> = {
    description: 'description',
    imageUrl: 'image_url',
    detailsText: 'details_text',
    telegramLink: 'telegram_link',
    whatsappLink: 'whatsapp_link',
    instagramLink: 'instagram_link',
  };

  const sets: string[] = [];
  const values: (string | number)[] = [];

  for (const [key, value] of Object.entries(fields)) {
    const col = columnMap[key];
    if (col) {
      sets.push(`${col} = ?`);
      values.push(value as string);
    }
  }

  if (sets.length === 0) return getPostById(id);

  sets.push("updated_at = datetime('now')");
  values.push(id);

  db.run(`UPDATE posts SET ${sets.join(', ')} WHERE id = ?`, values);
  saveDb();
  return getPostById(id);
}

export function deletePost(id: number) {
  const db = getDbInstance();
  db.run('DELETE FROM posts WHERE id = ?', [id]);
  saveDb();
}

export function incrementLike(id: number): PostRow | undefined {
  const db = getDbInstance();
  db.run('UPDATE posts SET like_count = like_count + 1 WHERE id = ?', [id]);
  saveDb();
  return getPostById(id);
}

export function decrementLike(id: number): PostRow | undefined {
  const db = getDbInstance();
  db.run('UPDATE posts SET like_count = CASE WHEN like_count > 0 THEN like_count - 1 ELSE 0 END WHERE id = ?', [id]);
  saveDb();
  return getPostById(id);
}

export interface ChannelSettings {
  telegram_link: string;
  whatsapp_link: string;
  instagram_link: string;
}

export function getChannelSettings(): ChannelSettings {
  const db = getDbInstance();
  const result = db.exec('SELECT telegram_link, whatsapp_link, instagram_link FROM channel_settings WHERE id = 1');
  if (!result.length || !result[0]!.values.length) {
    return { telegram_link: '', whatsapp_link: '', instagram_link: '' };
  }
  const row = result[0]!.values[0]!;
  return {
    telegram_link: row[0] as string,
    whatsapp_link: row[1] as string,
    instagram_link: row[2] as string,
  };
}

export function updateChannelSettings(settings: Partial<ChannelSettings>): ChannelSettings {
  const db = getDbInstance();
  const sets: string[] = [];
  const values: string[] = [];

  if (settings.telegram_link !== undefined) {
    sets.push('telegram_link = ?');
    values.push(settings.telegram_link);
  }
  if (settings.whatsapp_link !== undefined) {
    sets.push('whatsapp_link = ?');
    values.push(settings.whatsapp_link);
  }
  if (settings.instagram_link !== undefined) {
    sets.push('instagram_link = ?');
    values.push(settings.instagram_link);
  }

  if (sets.length === 0) return getChannelSettings();

  sets.push("updated_at = datetime('now')");
  db.run(`UPDATE channel_settings SET ${sets.join(', ')} WHERE id = 1`, values);
  saveDb();
  return getChannelSettings();
}
