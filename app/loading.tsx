import { Loader } from 'lucide-react';

export default function Loading() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <Loader className="h-16 w-16 animate-spin" />
    </div>
  );
}
