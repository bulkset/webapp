import type { Post, ApiResponse } from '../types/post';

const API_BASE = import.meta.env.VITE_API_URL || 'https://api.mirsinisme.com';

const CACHE_KEY = 'posts_cache';
const CACHE_TTL = 60_000; // 1 minute

interface CachedPosts {
  posts: Post[];
  total: number;
  startOffset: number;
  ts: number;
}

export function getCachedPosts(): CachedPosts | null {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const cached: CachedPosts = JSON.parse(raw);
    if (Date.now() - cached.ts > CACHE_TTL) return null;
    return cached;
  } catch { return null; }
}

function setCachedPosts(posts: Post[], total: number, startOffset: number) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify({ posts, total, startOffset, ts: Date.now() }));
  } catch { /* quota exceeded — ignore */ }
}

export async function fetchPosts(): Promise<Post[]> {
  const res = await fetch(`${API_BASE}/api/posts`);
  if (!res.ok) throw new Error(`Failed to fetch posts: ${res.status}`);
  const json: ApiResponse<Post[]> = await res.json();
  if (!json.success) throw new Error(json.error || 'Unknown error');
  return json.data!;
}

export async function fetchPostsPaginated(limit: number, offset: number): Promise<{ posts: Post[]; total: number }> {
  const res = await fetch(`${API_BASE}/api/posts?limit=${limit}&offset=${offset}`);
  if (!res.ok) throw new Error(`Failed to fetch posts: ${res.status}`);
  const json: ApiResponse<Post[]> = await res.json();
  if (!json.success) throw new Error(json.error || 'Unknown error');
  return { posts: json.data!, total: json.total ?? 0 };
}

// Single request to get last N posts (avoids double round-trip on initial load)
export async function fetchLastPosts(pageSize: number): Promise<{ posts: Post[]; total: number; startOffset: number }> {
  const res = await fetch(`${API_BASE}/api/posts/last?count=${pageSize}`);
  if (!res.ok) throw new Error(`Failed to fetch posts: ${res.status}`);
  const json = await res.json() as ApiResponse<Post[]> & { startOffset?: number };
  if (!json.success) throw new Error(json.error || 'Unknown error');
  const posts = json.data!;
  const total = json.total ?? 0;
  const startOffset = json.startOffset ?? 0;
  setCachedPosts(posts, total, startOffset);
  return { posts, total, startOffset };
}

export async function likePost(id: number): Promise<Post> {
  const res = await fetch(`${API_BASE}/api/posts/${id}/like`, { method: 'POST' });
  if (!res.ok) throw new Error(`Failed to like post: ${res.status}`);
  const json: ApiResponse<Post> = await res.json();
  return json.data!;
}

export async function unlikePost(id: number): Promise<Post> {
  const res = await fetch(`${API_BASE}/api/posts/${id}/unlike`, { method: 'POST' });
  if (!res.ok) throw new Error(`Failed to unlike post: ${res.status}`);
  const json: ApiResponse<Post> = await res.json();
  return json.data!;
}

export function getImageUrl(imageUrl: string): string {
  if (!imageUrl) return '';
  if (imageUrl.startsWith('http')) return imageUrl;
  return `${API_BASE}${imageUrl}`;
}

export interface ChannelSettings {
  facebookLink: string;
  twitterLink: string;
  instagramLink: string;
}

export async function getChannelSettings(): Promise<ChannelSettings> {
  const res = await fetch(`${API_BASE}/api/channel/settings`);
  if (!res.ok) throw new Error('Failed to fetch channel settings');
  return res.json();
}

export async function updateFacebookLink(facebookLink: string, password: string): Promise<ChannelSettings> {
  const res = await fetch(`${API_BASE}/api/channel/settings`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ facebookLink, password }),
  });
  if (!res.ok) throw new Error('Failed to update facebook link');
  return res.json();
}
