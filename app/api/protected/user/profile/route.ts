// Protected User Profile Endpoint
// Example of protected route with auth + response format middleware

import { NextRequest, NextResponse } from 'next/server';
import { protectedRoute } from '@/lib/middleware/protected-route.middleware';
import prisma from '@/lib/prisma-client';

const getProfile = async (request: NextRequest, userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      name: true,
      emailVerified: true,
      emailVerifiedAt: true,
      isActive: true,
      createdAt: true,
      updatedAt: true
    }
  });
  
  if (!user) {
    return NextResponse.json(
      { error: 'User not found', message: 'User not found' },
      { status: 404 }
    );
  }
  
  return NextResponse.json({
    data: user,
    message: 'Profile retrieved successfully'
  });
};

export const GET = protectedRoute(getProfile);


