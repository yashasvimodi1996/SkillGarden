import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSessionUserId } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const userId = await getSessionUserId();

    if (!userId) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    const { hobbyIds, levels, goals } = await request.json();

    if (!hobbyIds || !Array.isArray(hobbyIds) || hobbyIds.length === 0) {
      return NextResponse.json(
        { error: 'hobbyIds array is required' },
        { status: 400 }
      );
    }

    // Delete existing user hobbies
    await prisma.userHobby.deleteMany({
      where: { userId },
    });

    // Create new user hobbies
    const userHobbies = await Promise.all(
      hobbyIds.map((hobbyId, index) =>
        prisma.userHobby.create({
          data: {
            userId,
            hobbyId,
            level: (levels && levels[index]) || 'beginner',
            goals: (goals && goals[index]) || null,
          },
        })
      )
    );

    return NextResponse.json(userHobbies, { status: 200 });
  } catch (error) {
    console.error('Onboarding error:', error);
    return NextResponse.json(
      { error: 'Failed to complete onboarding' },
      { status: 500 }
    );
  }
}
