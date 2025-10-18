export const dynamic = "force-dynamic";
import { NextResponse } from 'next/server';

// Cache control constants
const CACHE_MAX_AGE = 60 * 60; // 1 hour in seconds

// Backend API URL (note: backend runs on port 4000 by default)
const BACKEND_API_URL = process.env.BACKEND_API_URL || 'http://localhost:4000';

/**
 * GET handler for documentation ingestion data.
 * Supports:
 * - /api/documentation?source=motia&page=1&limit=10  -> proxies to /ingest
 * - /api/documentation?id=<ingestId>                -> proxies to /ingest/:id
 */
export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const id = url.searchParams.get('id');
    const source = url.searchParams.get('source') || '';
    const page = url.searchParams.get('page') || '1';
    const limit = url.searchParams.get('limit') || '20';

    let endpoint = '';
    if (id) {
      endpoint = `/ingest/${encodeURIComponent(id)}`;
    } else {
      const qs = new URLSearchParams();
      if (source) qs.set('source', source);
      if (page) qs.set('page', page);
      if (limit) qs.set('limit', limit);
      endpoint = `/ingest${qs.toString() ? `?${qs.toString()}` : ''}`;
    }

    const resp = await fetch(`${BACKEND_API_URL}${endpoint}`, {
      next: { revalidate: CACHE_MAX_AGE },
    });

    if (!resp.ok) {
      const text = await resp.text();
      console.error('Error fetching documentation from backend:', text);
      return NextResponse.json({ error: 'Failed to fetch documentation' }, { status: resp.status });
    }

    const data = await resp.json();

    return NextResponse.json(data, {
      headers: {
        'Cache-Control': `public, s-maxage=${CACHE_MAX_AGE}, stale-while-revalidate`,
      },
    });
  } catch (err) {
    console.error('Error in documentation API:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
