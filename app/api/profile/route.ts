import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSessionUserId } from '@/lib/auth';
import type { UserProfileData } from '@/lib/types';

export async function GET() {
  try {
    const userId = await getSessionUserId();
    if (!userId) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const profile = await prisma.userProfile.findUnique({ where: { userId } });
    if (!profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    }

    return NextResponse.json(profile);
  } catch (error) {
    console.error('Get profile error:', error);
    return NextResponse.json({ error: 'Failed to get profile' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const userId = await getSessionUserId();
    if (!userId) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const body: UserProfileData = await request.json();

    const profile = await prisma.userProfile.upsert({
      where: { userId },
      update: {
        motivations: body.motivations,
        timeAvailabilityMinutes: body.timeAvailabilityMinutes,
        schedulePreference: body.schedulePreference,
        skillLevel: body.skillLevel,
        learningStyle: body.learningStyle,
        budget: body.budget,
        environment: body.environment,
        location: body.location ?? null,
        socialPreference: body.socialPreference,
        intensity: body.intensity,
        commitmentHorizon: body.commitmentHorizon,
      },
      create: {
        userId,
        motivations: body.motivations,
        timeAvailabilityMinutes: body.timeAvailabilityMinutes,
        schedulePreference: body.schedulePreference,
        skillLevel: body.skillLevel,
        learningStyle: body.learningStyle,
        budget: body.budget,
        environment: body.environment,
        location: body.location ?? null,
        socialPreference: body.socialPreference,
        intensity: body.intensity,
        commitmentHorizon: body.commitmentHorizon,
      },
    });

    return NextResponse.json(profile);
  } catch (error) {
    console.error('Save profile error:', error);
    return NextResponse.json({ error: 'Failed to save profile' }, { status: 500 });
  }
}
