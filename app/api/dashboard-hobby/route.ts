import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSessionUserId } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const userId = await getSessionUserId();
    if (!userId) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const { hobbyId, level } = await request.json() as { hobbyId: string; level: string };

    if (!hobbyId) {
      return NextResponse.json({ error: 'hobbyId is required' }, { status: 400 });
    }

    // Safe upsert — does NOT wipe existing hobbies
    const userHobby = await prisma.userHobby.upsert({
      where: { userId_hobbyId: { userId, hobbyId } },
      update: { level: level ?? 'beginner' },
      create: { userId, hobbyId, level: level ?? 'beginner' },
    });

    return NextResponse.json(userHobby);
  } catch (error) {
    console.error('Dashboard hobby error:', error);
    return NextResponse.json({ error: 'Failed to add hobby' }, { status: 500 });
  }
}
