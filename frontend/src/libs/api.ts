export const API_BASE = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:4000";

async function apiFetch<T = any>(path: string, init: RequestInit = {}): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(init.headers || {}),
    },
    credentials: 'include',
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `Request failed: ${res.status}`);
  }
  return res.json();
}

export async function getAuthMe(token: string) {
  return apiFetch('/auth/me', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export async function getUserProfile(token: string) {
  return apiFetch('/user/profile', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export async function updateUserProfile(token: string, body: { username?: string; domain?: string }) {
  return apiFetch('/user/profile', {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  });
}

// Ingests (public)
export type IngestDoc = {
  _id: string;
  source?: string;
  payload: any;
  createdAt?: string;
  updatedAt?: string;
};

export async function listIngests(params?: { page?: number; limit?: number; source?: string }) {
  const search = new URLSearchParams();
  if (params?.page) search.set('page', String(params.page));
  if (params?.limit) search.set('limit', String(params.limit));
  if (params?.source) search.set('source', params.source);
  const qs = search.toString();
  return apiFetch<{ items: IngestDoc[]; page: number; limit: number; total: number }>(`/ingest${qs ? `?${qs}` : ''}`);
}

export async function getIngestById(id: string) {
  return apiFetch<IngestDoc>(`/ingest/${id}`);
}

// Frontend internal API route for documentation (proxies to backend /ingest)
export async function fetchDocumentation(params?: { page?: number; limit?: number; source?: string }) {
  const search = new URLSearchParams();
  if (params?.page) search.set('page', String(params.page));
  if (params?.limit) search.set('limit', String(params.limit));
  if (params?.source) search.set('source', params.source || '');
  const qs = search.toString();
  const path = `/api/documentation${qs ? `?${qs}` : ''}`;

  const res = await fetch(path, {
    credentials: 'include',
  });
  if (!res.ok) {
    const txt = await res.text();
    throw new Error(txt || `Request failed: ${res.status}`);
  }
  return res.json() as Promise<{ items: IngestDoc[]; page: number; limit: number; total: number }>;
}

export async function fetchDocumentationById(id: string) {
  const path = `/api/documentation?id=${encodeURIComponent(id)}`;
  const res = await fetch(path, { credentials: 'include' });
  if (!res.ok) {
    const txt = await res.text();
    throw new Error(txt || `Request failed: ${res.status}`);
  }
  return res.json() as Promise<IngestDoc>;
}

// Community API functions
import type { 
  CreatePostRequest, 
  CreatePostResponse, 
  GetPostsResponse, 
  ToggleLikeResponse, 
  GetTrendingResponse 
} from '@/types/Community';

export async function createPost(token: string, data: CreatePostRequest): Promise<CreatePostResponse> {
  return apiFetch('/api/posts', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
}

export async function getPosts(page: number = 1, limit: number = 10): Promise<GetPostsResponse> {
  const searchParams = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
  });
  return apiFetch(`/api/posts?${searchParams.toString()}`);
}

export async function toggleLike(token: string, postId: string): Promise<ToggleLikeResponse> {
  return apiFetch(`/api/posts/${postId}/like`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export async function getTrendingHashtags(): Promise<GetTrendingResponse> {
  return apiFetch('/api/trending');
}
