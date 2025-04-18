'use client';

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
import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';

type EditCollectionModalProps = {
  collection: {
    id: number;
    name: string;
    description: string;
    stocks: number;
    price: number;
  };
};

export function EditCollectionModal({ collection }: EditCollectionModalProps) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    name: collection.name,
    description: collection.description,
    stocks: collection.stocks,
    price: collection.price,
  });

  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  // Update local form state on input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === 'stocks' || name === 'price' ? Number(value) : value,
    }));
  };

  // Submit updated collection to API
  const handleSubmit = () => {
    startTransition(async () => {
      try {
        const res = await fetch('/api/collections', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: collection.id, ...form }),
        });

        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.error || 'Failed to update');
        }

        toast({ title: '✅ Collection updated' });
        setOpen(false);
        router.refresh(); // Refresh data without full reload
      } catch (err) {
        toast({
          variant: 'destructive',
          title: err instanceof Error ? err.message : 'Update failed',
        });
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">Edit</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Collection</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 mt-4">
          <Input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Collection Name"
          />
          <Input
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Description"
          />
          <Input
            name="stocks"
            type="number"
            value={form.stocks}
            onChange={handleChange}
            placeholder="Stocks"
          />
          <Input
            name="price"
            type="number"
            value={form.price}
            onChange={handleChange}
            placeholder="Price"
          />
          <Button
            onClick={handleSubmit}
            className="w-full"
            disabled={isPending}
          >
            {isPending ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
