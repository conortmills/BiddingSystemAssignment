import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';
import { BidStatus } from '@prisma/client';


// GET bids for a specific collection
export async function GET(req: NextRequest) {
  const collectionId = Number(req.nextUrl.searchParams.get('collectionId'));
  if (!collectionId) {
    return NextResponse.json({ error: 'Missing collectionId' }, { status: 400 });
  }

  const bids = await prisma.bid.findMany({
    where: { collectionId },
    include: { user: true },
    orderBy: { price: 'desc' },
  });

  return NextResponse.json(bids);
}

export async function POST(req: NextRequest) {
  const { price, userId, collectionId } = await req.json();

  if (!price || !userId || !collectionId) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
  }

  // Prevent duplicate bids per user on the same collection
  const existingBid = await prisma.bid.findFirst({
    where: { userId, collectionId },
  });

  if (existingBid) {
    return NextResponse.json(
      { error: 'You already placed a bid on this collection.' },
      { status: 400 }
    );
  }

  const bid = await prisma.bid.create({
    data: {
      price,
      userId,
      collectionId,
      status: BidStatus.PENDING,
    },
  });

  return NextResponse.json(bid);
}


// update a bid
export async function PUT(req: NextRequest) {
  const { id, price, status } = await req.json();

  if (!id || (!price && !status)) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
  }

  const updated = await prisma.bid.update({
    where: { id },
    data: {
      ...(price !== undefined && { price }),
      ...(status !== undefined && { status }),
    },
  });

  return NextResponse.json(updated);
}

// delete a bid
export async function DELETE(req: NextRequest) {
  const { id } = await req.json();

  if (!id) {
    return NextResponse.json({ error: 'Missing bid id' }, { status: 400 });
  }

  await prisma.bid.delete({ where: { id } });

  return NextResponse.json({ success: true });
}
