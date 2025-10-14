import { NextResponse } from 'next/server';

// Cache control constants
const CACHE_MAX_AGE = 60 * 60; // 1 hour in seconds

// Backend API URL
const BACKEND_API_URL = process.env.BACKEND_API_URL || 'http://localhost:4000';

/**
 * GET handler for DSA content
 * Fetches DSA content from the Backend API
 */
export async function GET() {
  try {
    // Fetch DSA content from Backend API
    const response = await fetch(
      `${BACKEND_API_URL}/api/dsa-content`,
      { next: { revalidate: CACHE_MAX_AGE } } // SWR caching strategy
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error fetching DSA content:', errorText);
      return NextResponse.json(
        { error: 'Failed to fetch DSA content' },
        { status: response.status }
      );
    }

    const dsaContent = await response.json();

    // Set cache control headers
    return NextResponse.json({ dsaContent }, {
      headers: {
        'Cache-Control': `public, s-maxage=${CACHE_MAX_AGE}, stale-while-revalidate`,
      },
    });
  } catch (error) {
    console.error('Error in DSA content API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}