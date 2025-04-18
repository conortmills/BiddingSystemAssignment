import './globals.css';
import { ReactNode } from 'react';
import ClientProviders from '@/components/ClientProviders';
import { Toaster } from '@/components/ui/toaster';

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ClientProviders>
          {children}
          <Toaster />
        </ClientProviders>
      </body>
    </html>
  );
}
