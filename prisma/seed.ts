import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import { PrismaClient, BidStatus } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create users
  const users = await Promise.all(
    Array.from({ length: 10 }).map((_, i) =>
      prisma.user.upsert({
        where: { email: `user${i + 1}@example.com` },
        update: {},
        create: {
          name: `User ${i + 1}`,
          email: `user${i + 1}@example.com`,
        },
      })
    )
  );

  //create collections, each with 10 random bids
  for (let i = 0; i < 100; i++) {
    const owner = users[Math.floor(Math.random() * users.length)];

    const collection = await prisma.collection.create({
      data: {
        name: `Collection ${i + 1}`,
        description: `Description for collection ${i + 1}`,
        stocks: Math.floor(Math.random() * 100) + 1,
        price: parseFloat((Math.random() * 100).toFixed(2)),
        userId: owner.id,
      },
    });

    // Create 10 bids for the collection
    await Promise.all(
      Array.from({ length: 10 }).map(() => {
        const bidder = users[Math.floor(Math.random() * users.length)];
        return prisma.bid.create({
          data: {
            price: parseFloat((Math.random() * 100).toFixed(2)),
            status: BidStatus.PENDING,
            userId: bidder.id,
            collectionId: collection.id,
          },
        });
      })
    );
  }

  console.log('✅ Seeding complete');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
