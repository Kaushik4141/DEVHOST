import { NextResponse } from 'next/server';

// Backend API URL
const BACKEND_API_URL = process.env.BACKEND_API_URL || 'http://localhost:4000';

/**
 * POST handler for running visualized code
 * Sends code to the backend for execution and visualization
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userCode, languageId, problemId } = body;

    // Validate required fields
    if (!userCode || !languageId || !problemId) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Missing required fields: userCode, languageId, or problemId' 
        },
        { status: 400 }
      );
    }

    // Send code to backend for execution and visualization
    const response = await fetch(`${BACKEND_API_URL}/api/run-visualized`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userCode, languageId, problemId }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error running visualized code:', errorText);
      return NextResponse.json(
        { success: false, error: 'Failed to run visualized code' },
        { status: response.status }
      );
    }

    const result = await response.json();
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error in run-visualized API:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}