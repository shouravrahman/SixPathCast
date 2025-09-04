'use client';

import { Button } from "@/components/ui/button";
import { useUser } from "@/hooks/useUserStore";
import { createClient } from "@/utils/supabase/client";
import { Sparkles } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export function LandingHeader() {
   const { user, isLoading } = useUser();
   const router = useRouter();

   const handleLogout = async () => {
      const supabase = createClient();
      await supabase.auth.signOut();
      router.refresh();
   };

   return (
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
         <div className="container mx-auto flex h-14 items-center">
            <div className="mr-4 flex items-center">
               <Sparkles className="h-6 w-6 mr-2 text-primary" />
               <span className="font-bold">SixPathCast</span>
            </div>
            <nav className="hidden items-center space-x-6 text-sm font-medium md:flex">
               <Link href="#features" className="transition-colors hover:text-foreground/80 text-foreground/60">
                  Features
               </Link>
               <Link href="#how-it-works" className="transition-colors hover:text-foreground/80 text-foreground/60">
                  How It Works
               </Link>
               <Link href="#faq" className="transition-colors hover:text-foreground/80 text-foreground/60">
                  FAQ
               </Link>
            </nav>
            <div className="flex flex-1 items-center justify-end space-x-4">
               {isLoading ? (
                  <div className="h-8 w-32 animate-pulse rounded-md bg-muted" />
               ) : user ? (
                  <>
                     <Link href="/dashboard">
                        <Button variant="ghost">Dashboard</Button>
                     </Link>
                     <Button onClick={handleLogout}>Log Out</Button>
                  </>
               ) : (
                  <>
                     <Link href="/login">
                        <Button variant="ghost">Sign In</Button>
                     </Link>
                     <Link href="/login">
                        <Button>Get Started</Button>
                     </Link>
                  </>
               )}
            </div>
         </div>
      </header>
   );
}
