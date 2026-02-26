import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSessionUserId } from '@/lib/auth';
import { rankHobbies } from '@/lib/recommendation/score';
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

    const profileData: UserProfileData = {
      motivations: profile.motivations,
      timeAvailabilityMinutes: profile.timeAvailabilityMinutes,
      schedulePreference: profile.schedulePreference as UserProfileData['schedulePreference'],
      skillLevel: profile.skillLevel as UserProfileData['skillLevel'],
      learningStyle: profile.learningStyle as UserProfileData['learningStyle'],
      budget: profile.budget as UserProfileData['budget'],
      environment: profile.environment as UserProfileData['environment'],
      location: profile.location ?? undefined,
      socialPreference: profile.socialPreference as UserProfileData['socialPreference'],
      intensity: profile.intensity as UserProfileData['intensity'],
      commitmentHorizon: profile.commitmentHorizon as UserProfileData['commitmentHorizon'],
    };

    const ranked = rankHobbies(profileData).slice(0, 3);
    return NextResponse.json(ranked);
  } catch (error) {
    console.error('Hobby recommendations error:', error);
    return NextResponse.json({ error: 'Failed to get recommendations' }, { status: 500 });
  }
}
