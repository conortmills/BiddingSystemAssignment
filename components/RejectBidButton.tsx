'use client';

import { useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { X } from 'lucide-react';

export function RejectBidButton({ bidId }: { bidId: number }) {
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();
  const router = useRouter();

  // Reject a bid and refresh the UI
  const handleReject = () => {
    startTransition(async () => {
      try {
        const res = await fetch('/api/bids', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: bidId, status: 'REJECTED' }),
        });

        if (!res.ok) throw new Error('Failed to reject bid');

        toast({ title: '❌ Bid rejected' });
        router.refresh(); // SSR-safe refresh
      } catch (err) {
        toast({ variant: 'destructive', title: 'Error rejecting bid' });
      }
    });
  };

  return (
    <Button
      variant="outline"
      size="sm"
      className="text-red-600 border-red-600 hover:bg-red-50"
      onClick={handleReject}
      disabled={isPending}
    >
      <X className="w-4 h-4 mr-1" />
      {isPending ? 'Rejecting...' : 'Reject'}
    </Button>
  );
}
