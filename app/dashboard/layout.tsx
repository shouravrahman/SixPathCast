'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu, Search, Loader } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { UserNav } from '@/components/shared/UserNav';
import { DashboardSidebar } from '@/components/shared/DashboardSidebar';
import { useRouter, usePathname } from 'next/navigation';
import { useUser } from '@/hooks/useUserStore';
import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import GuidedSetup from '@/components/ai-training/GuidedSetup';

interface BrandSettings {
   id?: string;
   has_completed_onboarding?: boolean;
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
   const router = useRouter();
   const pathname = usePathname();
   const { user, isLoading: isUserLoading } = useUser();

   const { data: brandSettings, isLoading: isSettingsLoading, isError: isSettingsError } = useQuery<BrandSettings>({
      queryKey: ['brandSettings'],
      queryFn: async () => {
         const response = await fetch('/api/settings');
         if (!response.ok) {
            if (response.status === 404) return { has_completed_onboarding: false };
            throw new Error('Failed to fetch brand settings');
         }
         return response.json();
      },
      enabled: !!user, // Only run this query if user is logged in
      staleTime: 0, // Always refetch to get latest onboarding status
      refetchOnWindowFocus: false,
   });

   useEffect(() => {
      if (!isUserLoading && user && !isSettingsLoading && brandSettings && !brandSettings.has_completed_onboarding) {
         // No explicit redirect here, GuidedSetup will be rendered instead of children
      }
   }, [user, isUserLoading, brandSettings, isSettingsLoading, router]);

   if (isUserLoading || isSettingsLoading) {
      return (
         <div className="flex min-h-screen items-center justify-center">
            <Loader className="h-12 w-12 animate-spin text-primary" />
         </div>
      );
   }

   if (!user) {
      router.push('/login');
      return null;
   }

   if (isSettingsError) {
      // If there's an error fetching settings, we can still show the GuidedSetup
      // or a more specific error message.
      // For now, let's assume GuidedSetup can handle it or user needs to go to settings.
      return (
         <div className="flex min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
            <div className="hidden border-r bg-muted/40 md:block">
               <div className="flex h-full max-h-screen flex-col gap-2">
                  <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
                     <Link href="/" className="flex items-center gap-2 font-semibold">
                        <img src="/logo-rasengan.svg" alt="SixPathCast" className="h-6 w-6" />
                        <span className="">SixPathCast</span>
                     </Link>
                  </div>
                  <div className="flex-1 overflow-auto py-2">
                     <DashboardSidebar />
                  </div>
               </div>
            </div>
            <div className="flex flex-col">
               <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
                  <Sheet>
                     <SheetTrigger asChild>
                        <Button
                           variant="outline"
                           size="icon"
                           className="shrink-0 md:hidden"
                        >
                           <Menu className="h-5 w-5" />
                           <span className="sr-only">Toggle navigation menu</span>
                        </Button>
                     </SheetTrigger>
                     <SheetContent side="left" className="flex flex-col">
                        <DashboardSidebar />
                     </SheetContent>
                  </Sheet>
                  <div className="w-full flex-1">
                     <form>
                        <div className="relative">
                           <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                           <Input
                              type="search"
                              placeholder="Search..."
                              className="w-full appearance-none bg-background pl-8 shadow-none md:w-2/3 lg:w-1/3"
                           />
                        </div>
                     </form>
                  </div>
                  <UserNav />
               </header>
               <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
                  <div className="flex flex-1 items-center justify-center text-red-500">
                     Error loading settings. Please try refreshing the page.
                  </div>
               </main>
            </div>
         </div>
      );
   }

   const isOnSettingsPage = pathname === '/dashboard/settings';

   return (
      <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
         <div className="hidden border-r bg-muted/40 md:block">
            <div className="flex h-full max-h-screen flex-col gap-2">
               <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
                  <Link href="/" className="flex items-center gap-2 font-semibold">
                     <img src="/logo-rasengan.svg" alt="SixPathCast" className="h-6 w-6" />
                     <span className="">SixPathCast</span>
                  </Link>
               </div>
               <div className="flex-1 overflow-auto py-2">
                  <DashboardSidebar />
               </div>
            </div>
         </div>
         <div className="flex flex-col">
            <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
               <Sheet>
                  <SheetTrigger asChild>
                     <Button
                        variant="outline"
                        size="icon"
                        className="shrink-0 md:hidden"
                     >
                        <Menu className="h-5 w-5" />
                        <span className="sr-only">Toggle navigation menu</span>
                     </Button>
                  </SheetTrigger>
                  <SheetContent side="left" className="flex flex-col">
                     <DashboardSidebar />
                  </SheetContent>
               </Sheet>
               <div className="w-full flex-1">
                  <form>
                     <div className="relative">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                           type="search"
                           placeholder="Search..."
                           className="w-full appearance-none bg-background pl-8 shadow-none md:w-2/d lg:w-1/3"
                        />
                     </div>
                  </form>
               </div>
               <UserNav />
            </header>
            <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
               {(brandSettings && !brandSettings.has_completed_onboarding && !isOnSettingsPage) ? (
                  <GuidedSetup />
               ) : (
                  children
               )}
            </main>
         </div>
      </div>
   );
}
