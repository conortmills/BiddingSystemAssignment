'use client';

import { useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Check } from 'lucide-react';

export function AcceptBidButton({
  collectionId,
  bidId,
}: {
  collectionId: number;
  bidId: number;
}) {
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();
  const router = useRouter();

  // Accept selected bid and refresh UI
  const handleAccept = () => {
    startTransition(async () => {
      try {
        const res = await fetch('/api/accept-bid', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ collectionId, bidId }),
        });

        if (!res.ok) throw new Error('Failed to accept bid');
        toast({ title: '✅ Bid accepted' });
        router.refresh(); // Trigger server re-fetch
      } catch (err) {
        toast({ variant: 'destructive', title: 'Error accepting bid' });
      }
    });
  };

  return (
    <Button
      variant="outline"
      size="sm"
      className="text-green-600 border-green-600 hover:bg-green-50"
      onClick={handleAccept}
      disabled={isPending}
    >
      <Check className="w-4 h-4 mr-1" />
      {isPending ? 'Accepting...' : 'Accept'}
    </Button>
  );
}
