'use client';

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Bell, Moon, Sparkles, Sun, User as UserIcon, LogOut, CreditCard, Users } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";
import Link from "next/link";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { useUser } from "@/hooks/useUserStore";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";

const getInitials = (name: string) => {
  const names = name.split(' ');
  if (names.length > 1) {
    return names[0][0] + names[names.length - 1][0];
  }
  return name.substring(0, 2).toUpperCase();
};

export function UserNav() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const { user, isLoading } = useUser();
  const router = useRouter();

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/login');
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center space-x-4">
        <div className="h-9 w-9 rounded-full bg-muted animate-pulse" />
      </div>
    );
  }

  if (!user) {
    return (
      <Link href="/login">
        <Button>Sign In</Button>
      </Link>
    )
  }

  const userEmail = user.email || 'user@example.com';
  const userName = user.profile?.full_name || user.email?.split('@')[0] || 'User';
  const userAvatar = user.profile?.avatar_url || '';
  const userInitials = getInitials(userName);

  return (
    <div className="flex items-center space-x-4">
       <Button variant="ghost" size="sm" className="relative">
          <Bell className="w-5 h-5" />
          <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
       </Button>
       <TooltipProvider>
          <Tooltip>
             <TooltipTrigger asChild>
                <Link href="/dashboard/create">
                   <Button size="sm" >
                      <Sparkles className="w-4 h-4 mr-2" />
                      Create Content
                   </Button>
                </Link>
             </TooltipTrigger>
             <TooltipContent className="border-border">
                <p>Start creating new content with AI assistance!</p>
             </TooltipContent>
          </Tooltip>
       </TooltipProvider>
       <Button
          variant="ghost"
          size="sm"
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
       >
          {mounted && (theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />)}
       </Button>

      <DropdownMenu>
        <DropdownMenuTrigger>
          <Avatar className="w-9 h-9 cursor-pointer">
            <AvatarImage src={userAvatar} alt={userName} />
            <AvatarFallback>{userInitials}</AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">{userName}</p>
              <p className="text-xs leading-none text-muted-foreground">
                {userEmail}
              </p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem>
              <UserIcon className="mr-2 h-4 w-4" />
              <span>Profile</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <CreditCard className="mr-2 h-4 w-4" />
              <span>Billing</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Users className="mr-2 h-4 w-4" />
              <span>Team</span>
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            <span>Log out</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}