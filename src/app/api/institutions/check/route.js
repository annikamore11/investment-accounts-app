import { NextResponse } from 'next/server';
import { checkInstitutionSupport } from '@/lib/mastercard';

// GET /api/institutions/check?name=institution_name
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const name = searchParams.get('name');

    if (!name || name.trim().length < 2) {
      return NextResponse.json(
        { error: 'Institution name must be at least 2 characters' },
        { status: 400 }
      );
    }

    const result = await checkInstitutionSupport(name);

    return NextResponse.json({
      success: true,
      ...result,
    });
  } catch (error) {
    console.error('Institution check API error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to check institution',
        message: error.message,
      },
      { status: 500 }
    );
  }
}
