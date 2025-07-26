import { NextResponse } from 'next/server';
import { getOfficesForDate } from '@/lib/offices';

export async function GET(request: Request) {
  try {
    // Get date from query params or use current date
    const url = new URL(request.url);
    const dateParam = url.searchParams.get('date');
    const date = dateParam ? new Date(dateParam) : new Date();

    // Get all offices for the requested date
    const offices = await getOfficesForDate(date);

    // Return the offices in the expected format
    return NextResponse.json({
      success: true,
      offices: offices
    });

  } catch (error) {
    console.error('Error in offices API:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch offices data'
      },
      { status: 500 }
    );
  }
}
