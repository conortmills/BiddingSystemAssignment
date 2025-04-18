'use client';

import { useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

export function DeleteBidButton({ bidId }: { bidId: number }) {
  const { toast } = useToast();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  // Delete bid and refresh collection data
  const handleDelete = () => {
    startTransition(async () => {
      try {
        const res = await fetch('/api/bids', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: bidId }),
        });

        if (!res.ok) throw new Error('Failed to delete bid');

        toast({ title: '✅ Bid deleted' });
        router.refresh(); // SSR-safe UI update
      } catch (err) {
        toast({ variant: 'destructive', title: '❌ Could not delete bid' });
      }
    });
  };

  return (
    <Button
      variant="destructive"
      size="sm"
      disabled={isPending}
      onClick={handleDelete}
    >
      {isPending ? 'Deleting...' : 'Delete'}
    </Button>
  );
}
