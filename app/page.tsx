import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { redirect } from 'next/navigation';
import SignInButton from '@/components/SignInButton';

export default async function HomePage() {
  const session = await getServerSession(authOptions);

  if (session?.user) {
    redirect('/dashboard');
  }

  return (
    <main className="flex flex-col items-center justify-center h-screen text-center px-4">
      <h1 className="text-3xl font-bold mb-4">Welcome to the Luxor Bidding System</h1>
      <p className="text-muted-foreground mb-6">
        Sign in to view and manage collections, place bids, and more.
      </p>
      <SignInButton />
    </main>
  );
}
