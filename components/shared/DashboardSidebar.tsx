"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
   LayoutDashboard,
   BookCopy,
   PenSquare,
   Settings,
   FileText,
   Copy,
   PenTool,
   Target,
   Library,
   Sparkles,
   BarChart3,
   Brain,
   Users,
   Group,
   User2,
   Image,
} from "lucide-react";
// const navigation = [
// { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
// { name: 'Content Creator', href: '/dashboard/create', icon: PenTool, badge: 'AI' },
// { name: 'My Campaigns', href: '/dashboard/campaigns', icon: Target },
// { name: 'Bulk Generation', href: '/dashboard/bulk-generate', icon: FileText, badge: 'Beta' },
// { name: 'Content Library', href: '/dashboard/library', icon: Library },
// { name: 'Content Studio', href: '/dashboard/content-studio', icon: Sparkles },
// { name: 'Media Library', href: '/dashboard/media', icon: Image },
// { name: 'Analytics', href: '/dashboard/analytics', icon: BarChart3 },
// { name: 'AI Training', href: '/dashboard/ai-training', icon: Brain, badge: 'AI' },
// { name: 'Lead Magnets', href: '/dashboard/lead-magnets', icon: FileText },
// { name: 'Social Accounts', href: '/dashboard/accounts', icon: Users },
// { name: 'Pages & Groups', href: '/dashboard/pages-and-groups', icon: Users },
// { name: 'Settings', href: '/dashboard/settings', icon: Settings },

// ];
const sidebarNavItems = [


   { name: 'Dashboard', href: '/dashboard', icon: <LayoutDashboard className="h-5 w-5" /> },
   { name: 'Content Creator', href: '/dashboard/create', icon: <PenTool className="h-5 w-5" />, badge: 'AI' },
   { name: 'Campaigns', href: '/dashboard/campaigns', icon: <Target className="h-5 w-5" /> },
   { name: 'Bulk Generation', href: '/dashboard/bulk-generate', icon: <FileText className="h-5 w-5" />, badge: 'Beta' },
   // { name: "Copywriter", href: "/dashboard/copywriter", icon: <Copy className="h-5 w-5" /> },
   { name: 'Library', href: '/dashboard/library', icon: <Library className="h-5 w-5" /> },
   { name: 'Studio', href: '/dashboard/content-studio', icon: <Sparkles className="h-5 w-5" /> },
   { name: 'Media', href: '/dashboard/media', icon: <Image className="h-5 w-5" /> },
   { name: 'Analytics', href: '/dashboard/analytics', icon: <BarChart3 className="h-5 w-5" /> },
   { name: 'AI Training', href: '/dashboard/ai-training', icon: <Brain className="h-5 w-5" />, badge: 'AI' },
   { name: 'Lead Magnets', href: '/dashboard/lead-magnets', icon: <FileText className="h-5 w-5" /> },
   { name: 'Social Accounts', href: '/dashboard/accounts', icon: <User2 className="h-5 w-5" /> },
   { name: 'Pages & Groups', href: '/dashboard/pages-and-groups', icon: <Group className="h-5 w-5" /> },
   { name: 'Settings', href: '/dashboard/settings', icon: <Settings className="h-5 w-5" /> },
];

import { SubscriptionStatus } from "./SubscriptionStatus";

export function DashboardSidebar() {
   const pathname = usePathname();

   return (
      <div className="flex flex-col justify-between h-full">
         <nav className="flex flex-col space-y-2">
            {sidebarNavItems.map((item) => (
               <Button
                  key={item.name}
                  asChild
                  variant={pathname === item.href ? "secondary" : "ghost"}
                  className="w-full justify-start"
               >
                  <Link href={item.href}>
                     {item.icon}
                     <span className="ml-2">{item.name}</span>
                  </Link>
               </Button>
            ))}
         </nav>
         <SubscriptionStatus />
      </div>
   );
}
