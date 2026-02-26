import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const hobbies = await prisma.hobby.findMany({
      include: {
        resources: {
          select: {
            id: true,
          },
        },
      },
    });

    return NextResponse.json(hobbies, { status: 200 });
  } catch (error) {
    console.error('Get hobbies error:', error);
    return NextResponse.json(
      { error: 'Failed to get hobbies' },
      { status: 500 }
    );
  }
}
