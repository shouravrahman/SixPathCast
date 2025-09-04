'use client';

import { Button } from '@/components/ui/button';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html>
      <body>
        <div className="flex min-h-screen flex-col items-center justify-center text-center">
          <h2 className="text-3xl font-bold">Something went wrong!</h2>
          <p className="mt-4 text-muted-foreground">{error.message}</p>
          <Button onClick={() => reset()} className="mt-6">
            Try again
          </Button>
        </div>
      </body>
    </html>
  );
}
