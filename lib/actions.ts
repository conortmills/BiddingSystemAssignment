'use client';

export async function acceptBid(collectionId: number, bidId: number) {
  const res = await fetch('/api/accept-bid', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ collectionId, bidId }),
  });

  if (!res.ok) {
    throw new Error('Failed to accept bid');
  }

  return res.json();
}
