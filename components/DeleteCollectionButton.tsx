'use client';

import { useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

export function DeleteCollectionButton({ id }: { id: number }) {
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();
  const router = useRouter();

  // Delete collection after confirmation
  const handleDelete = () => {
    const confirm = window.confirm('Are you sure you want to delete this collection?');
    if (!confirm) return;

    startTransition(async () => {
      try {
        const res = await fetch('/api/collections', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id }),
        });

        if (!res.ok) throw new Error('Failed to delete');

        toast({ title: '✅ Collection deleted' });
        router.refresh(); // Refresh UI without reload
      } catch (err) {
        toast({ variant: 'destructive', title: '❌ Failed to delete collection' });
      }
    });
  };

  return (
    <Button
      variant="destructive"
      size="sm"
      onClick={handleDelete}
      disabled={isPending}
    >
      {isPending ? 'Deleting...' : 'Delete'}
    </Button>
  );
}
