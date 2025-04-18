'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useSession } from 'next-auth/react';

export function CreateCollectionModal() {
  const { data: session } = useSession();
  const router = useRouter();
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();

  const [form, setForm] = useState({
    name: '',
    description: '',
    price: '',
    stocks: '',
  });

  // Handle form submission
  const handleSubmit = () => {
    startTransition(async () => {
      try {
        const res = await fetch('/api/collections', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...form,
            price: parseFloat(form.price),
            stocks: parseInt(form.stocks),
            userId: session?.user?.id,
          }),
        });

        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.error || 'Failed to create collection');
        }

        toast({ title: '✅ Collection created' });
        router.refresh(); // refresh page state without full reload
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Something went wrong';
        toast({ variant: 'destructive', title: message });
      }
    });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="sm" className="ml-auto">Add Collection</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Collection</DialogTitle>
        </DialogHeader>

        <div className="space-y-2">
          <Input
            placeholder="Name"
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
          />
          <Input
            placeholder="Description"
            value={form.description}
            onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
          />
          <Input
            type="number"
            placeholder="Price"
            value={form.price}
            onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
          />
          <Input
            type="number"
            placeholder="Stocks"
            value={form.stocks}
            onChange={(e) => setForm((f) => ({ ...f, stocks: e.target.value }))}
          />
          <Button
            onClick={handleSubmit}
            disabled={isPending}
            className="w-full"
          >
            {isPending ? 'Creating...' : 'Create Collection'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
