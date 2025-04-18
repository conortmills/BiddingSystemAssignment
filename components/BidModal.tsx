'use client';

import { useState, useTransition } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';

type BidModalProps = {
  collectionId: number;
  userId: number;
  existingBid?: { id: number; price: number };
};

export function BidModal({ collectionId, userId, existingBid }: BidModalProps) {
  const [open, setOpen] = useState(false);
  const [price, setPrice] = useState(existingBid?.price ?? 0);
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();
  const router = useRouter();

  const onClose = () => {
    setOpen(false);
    setPrice(existingBid?.price ?? 0); // reset form on close
  };

  // Submit new or updated bid
  const handleSubmit = () => {
    startTransition(async () => {
      try {
        const method = existingBid ? 'PUT' : 'POST';
        const res = await fetch('/api/bids', {
          method,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: existingBid?.id,
            price,
            collectionId,
            userId,
          }),
        });

        if (!res.ok) throw new Error('Failed to submit bid');

        toast({ title: '✅ Bid submitted successfully!' });
        onClose();
        router.refresh(); // update bid list
      } catch (err) {
        toast({ variant: 'destructive', title: '❌ Something went wrong' });
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          {existingBid ? 'Edit Bid' : 'Place Bid'}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>{existingBid ? 'Edit Your Bid' : 'Place a Bid'}</DialogTitle>
        </DialogHeader>
        <div className="mt-4 space-y-4">
          <Input
            type="number"
            value={price}
            min={0}
            step={0.01}
            onChange={(e) => setPrice(parseFloat(e.target.value))}
            placeholder="Enter bid price"
          />
          <Button onClick={handleSubmit} className="w-full" disabled={isPending}>
            {isPending ? 'Submitting...' : 'Submit'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
