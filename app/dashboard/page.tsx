import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import SignInButton from '@/components/SignInButton';
import { AcceptBidButton } from '@/components/AcceptBidButton';
import { DeleteBidButton } from '@/components/DeleteBidButton';
import { DeleteCollectionButton } from '@/components/DeleteCollectionButton';
import { EditCollectionModal } from '@/components/EditCollectionModal';
import { BidModal } from '@/components/BidModal';
import { Bid, User } from '@prisma/client';
import { RejectBidButton } from '@/components/RejectBidButton';
import { CreateCollectionModal } from '@/components/CreateCollectionModal';

type PopulatedBid = Bid & {
  user: User;
};

export default async function DashboardPage() {

  // sever side session check
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    redirect('/');
  }

  // fetch collections and bids
  const collections = await prisma.collection.findMany({
    include: {
      bids: {
        include: { user: true },
        orderBy: { price: 'desc' },
      },
      user: true,
    },
    orderBy: { id: 'asc' },
  });

  // split collections into your and others
  const yourCollections = collections.filter(
    (c) => c.userId === parseInt(session.user.id)
  );
  const otherCollections = collections.filter(
    (c) => c.userId !== parseInt(session.user.id)
  );

  //render the dashboard page
  return (
    <div className="max-w-4xl mx-auto p-6 space-y-10">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Your Dashboard</h1>
        <SignInButton />
      </div>

      {yourCollections.length > 0 && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold">Your Collections</h2>
            <CreateCollectionModal />
          </div>
          {yourCollections.map((collection) => (
            <CollectionCard key={collection.id} collection={collection} session={session} />
          ))}
        </div>
      )}

      {otherCollections.length > 0 && (
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold">Other Collections</h2>
          {otherCollections.map((collection) => (
            <CollectionCard key={collection.id} collection={collection} session={session} />
          ))}
        </div>
      )}
    </div>
  );
}

function CollectionCard({ collection, session }: any) {
  const isOwner = collection.userId === parseInt(session.user.id);

  return (
    <div className="border p-4 rounded-lg shadow-sm bg-card hover:shadow-md transition space-y-4">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-xl font-semibold">{collection.name}</h3>
          <p className="text-sm text-muted-foreground">{collection.description}</p>
          <p className="text-xs mt-1 text-muted-foreground">
            {collection.stocks} in stock • ${collection.price.toFixed(2)}
          </p>
        </div>
        {isOwner ? (
          <div className="flex gap-2">
            <EditCollectionModal collection={collection} />
            <DeleteCollectionButton id={collection.id} />
          </div>
        ) : (
          <BidModal
            collectionId={collection.id}
            userId={parseInt(session.user.id)}
            existingBid={collection.bids.find((b: PopulatedBid) => b.userId === parseInt(session.user.id))}
          />
        )}
      </div>

      <div>
        <h4 className="text-sm font-medium mb-2">Bids</h4>
        <ul className="space-y-1 text-sm">
          {collection.bids.map((bid: PopulatedBid) => {
            const isCurrentUser = bid.userId === parseInt(session.user.id);
            return (
              <li
                key={bid.id}
                className={`flex justify-between items-center rounded p-2 ${
                  isCurrentUser ? 'bg-muted/30' : ''
                }`}
              >
                <span>
                  {bid.user.name} bid ${bid.price.toFixed(2)}
                  <span
                    className={`ml-2 text-xs font-medium px-2 py-0.5 rounded ${
                      bid.status === 'ACCEPTED'
                        ? 'bg-green-100 text-green-700'
                        : bid.status === 'REJECTED'
                        ? 'bg-red-100 text-red-700'
                        : 'bg-yellow-100 text-yellow-700'
                    }`}
                  >
                    {bid.status}
                  </span>
                </span>
                <div className="flex gap-2 items-center">
                  {isOwner && bid.status === 'PENDING' && (
                    <>
                      <AcceptBidButton collectionId={collection.id} bidId={bid.id} />
                      <RejectBidButton bidId={bid.id} />
                    </>
                  )}
                  {!isOwner && isCurrentUser && (
                    <DeleteBidButton bidId={bid.id} />
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
