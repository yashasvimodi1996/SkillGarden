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

    const { resourceId, saved, status, feedback } = await request.json();

    if (!resourceId) {
      return NextResponse.json(
        { error: 'resourceId is required' },
        { status: 400 }
      );
    }

    // Upsert user resource
    const userResource = await prisma.userResource.upsert({
      where: {
        userId_resourceId: {
          userId,
          resourceId,
        },
      },
      update: {
        ...(saved !== undefined && { saved }),
        ...(status && { status }),
        ...(feedback !== undefined && { feedback }),
      },
      create: {
        userId,
        resourceId,
        saved: saved || false,
        status: status || 'not-started',
        feedback: feedback || null,
      },
    });

    return NextResponse.json(userResource, { status: 200 });
  } catch (error) {
    console.error('Save resource error:', error);
    return NextResponse.json(
      { error: 'Failed to save resource' },
      { status: 500 }
    );
  }
}
