import { NextResponse } from 'next/server';
import { searchInstitutions } from '@/lib/mastercard';

// GET /api/institutions/search?q=search_term
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');

    if (!query || query.trim().length < 2) {
      return NextResponse.json(
        { error: 'Search query must be at least 2 characters' },
        { status: 400 }
      );
    }

    const institutions = await searchInstitutions(query);

    return NextResponse.json({
      success: true,
      institutions,
      count: institutions.length,
    });
  } catch (error) {
    console.error('Institution search API error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to search institutions',
        message: error.message,
      },
      { status: 500 }
    );
  }
}
