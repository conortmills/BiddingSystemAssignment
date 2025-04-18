import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const { collectionId, bidId } = await req.json();

  if (!collectionId || !bidId) {
    return NextResponse.json({ error: 'collectionId and bidId are required' }, { status: 400 });
  }

  // Accept the selected bid and reject others
  const acceptedBid = await prisma.bid.update({
    where: { id: bidId },
    data: { status: 'ACCEPTED' },
  });

  await prisma.bid.updateMany({
    where: {
      collectionId,
      id: { not: bidId },
    },
    data: { status: 'REJECTED' },
  });

  return NextResponse.json({ acceptedBid });
}