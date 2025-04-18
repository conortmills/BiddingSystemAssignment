import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';


// GEt all collections with bids and owners
export async function GET() {
  const collections = await prisma.collection.findMany({
    include: {
      bids: { include: { user: true } },
      user: true,
    },
    orderBy: { id: 'asc' },
  });

  return NextResponse.json(collections);
}

// Update existing collection
export async function PUT(req: NextRequest) {
  const { id, name, description, price, stocks } = await req.json();

  if (!id || !name || !description || !price || !stocks) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
  }



  try {
    const updated = await prisma.collection.update({
      where: { id },
      data: { name, description, price, stocks },
    });

    return NextResponse.json(updated);
  } catch (error: any) {
    if (error.code === 'P2002') {
      // prisma unique constraint violation error handling
      return NextResponse.json(
        { error: 'A collection with that name already exists.' },
        { status: 409 }
      );
    }

    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
}

// Create a collection
export async function POST(req: NextRequest) {
  const { name, description, price, stocks, userId } = await req.json();

  //validate input
  if (!name || !description || !price || !stocks || !userId) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
  }

  //ensure userId is a number
  if (isNaN(Number(userId))) {
    return NextResponse.json({ error: 'Invalid userId' }, { status: 400 });
  }
  

  const created = await prisma.collection.create({
    data: {
      name,
      description,
      price,
      stocks,
      userId: Number(userId),
    },
  });
  
  return NextResponse.json(created);
}

//delete a collection
export async function DELETE(req: NextRequest) {
  const { id } = await req.json();

  if (!id) {
    return NextResponse.json({ error: 'Missing collection id' }, { status: 400 });
  }

  // First delete related bids 
  await prisma.bid.deleteMany({ where: { collectionId: id } });

  // Then delete the collection
  await prisma.collection.delete({ where: { id } });

  return NextResponse.json({ success: true });
}
