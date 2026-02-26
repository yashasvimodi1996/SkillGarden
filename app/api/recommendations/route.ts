import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSessionUserId } from '@/lib/auth';
import { calculateResourceScore, rankResources } from '@/lib/scoring';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const hobbySlug = searchParams.get('hobby');
    const type = searchParams.get('type'); // video, article, community
    const level = searchParams.get('level'); // beginner, intermediate, advanced
    const timeMin = searchParams.get('timeMin');
    const timeMax = searchParams.get('timeMax');

    if (!hobbySlug) {
      return NextResponse.json(
        { error: 'hobby parameter is required' },
        { status: 400 }
      );
    }

    const userId = await getSessionUserId();

    // Get hobby
    const hobby = await prisma.hobby.findUnique({
      where: { slug: hobbySlug },
    });

    if (!hobby) {
      return NextResponse.json(
        { error: 'Hobby not found' },
        { status: 404 }
      );
    }

    // Get user's skill level for this hobby
    let userLevel = 'beginner';
    if (userId) {
      const userHobby = await prisma.userHobby.findUnique({
        where: {
          userId_hobbyId: {
            userId,
            hobbyId: hobby.id,
          },
        },
      });
      if (userHobby) {
        userLevel = userHobby.level;
      }
    }

    // Build query filters
    const where: any = { hobbyId: hobby.id };
    if (type) where.type = type;
    if (level) where.level = level;
    if (timeMin || timeMax) {
      where.timeMinutes = {};
      if (timeMin) where.timeMinutes.gte = parseInt(timeMin);
      if (timeMax) where.timeMinutes.lte = parseInt(timeMax);
    }

    // Get resources
    const resources = await prisma.resource.findMany({
      where,
      include: {
        tags: { include: { tag: true } },
        users: userId ? { where: { userId } } : false,
      },
    });

    // Score and rank resources
    const scoredResources = resources.map((resource) => {
      const userResource = userId
        ? resource.users?.[0]
        : null;

      const score = calculateResourceScore({
        skillLevel: userLevel as any,
        resourceLevel: resource.level as any,
        userFeedback: userResource?.feedback as any,
        popularityScore: resource.popularityScore,
        tagMatch: resource.tags?.length || 0,
      });

      return {
        ...resource,
        score,
        isSaved: userResource?.saved || false,
        status: userResource?.status || 'not-started',
      };
    });

    const ranked = rankResources(scoredResources);

    return NextResponse.json(ranked, { status: 200 });
  } catch (error) {
    console.error('Recommendations error:', error);
    return NextResponse.json(
      { error: 'Failed to get recommendations' },
      { status: 500 }
    );
  }
}
