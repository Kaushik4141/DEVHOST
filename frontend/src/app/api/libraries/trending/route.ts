import { NextResponse } from 'next/server';
import { Library } from '@/types/Library';

// Cache control constants
const CACHE_MAX_AGE = 60 * 60; // 1 hour in seconds

// Backend API URL
const BACKEND_API_URL = process.env.BACKEND_API_URL || 'http://localhost:4000';

/**
 * GET handler for trending libraries
 * Fetches trending libraries from the Backend API
 */
export async function GET() {
  try {
    // Fetch trending libraries from Backend API
    const response = await fetch(
      `${BACKEND_API_URL}/library/trending`,
      { next: { revalidate: CACHE_MAX_AGE } } // SWR caching strategy
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error fetching trending libraries:', errorText);
      return NextResponse.json(
        { error: 'Failed to fetch trending libraries' },
        { status: response.status }
      );
    }

    const responseData = await response.json();
    const data = responseData.data; // Extract data from ApiResponse

    // Set cache control headers
    return NextResponse.json({ libraries: data }, {
      headers: {
        'Cache-Control': `public, s-maxage=${CACHE_MAX_AGE}, stale-while-revalidate`,
      },
    });
  } catch (error) {
    console.error('Error in trending libraries API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}