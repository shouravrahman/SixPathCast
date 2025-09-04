'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
   Shield,
   LayoutDashboard,
   Users,
   BarChart3,
   Settings,
   Database,
   Activity,
   DollarSign,
   Brain,
   Server,
   Menu,
   X,
   Bell,
   LogOut
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function AdminLayout({
   children,
}: {
   children: React.ReactNode;
}) {
   const [sidebarOpen, setSidebarOpen] = useState(false);
   const pathname = usePathname();

   return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-purple-950">
         {/* Mobile sidebar overlay */}
         {sidebarOpen && (
            <div
               className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
               onClick={() => setSidebarOpen(false)}
            />
         )}

         {/* Sidebar */}
         <div className={`fixed inset-y-0 left-0 z-50 w-64   backdrop-blur-xl border-r border-border transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
            <div className="flex items-center justify-between h-16 px-4 border-b border-border">
               <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-gradient-to-r from-red-500 to-orange-500 rounded-lg flex items-center justify-center">
                     <Shield className="w-5 h-5    " />
                  </div>
                  <span className="text-xl font-bold bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent">Admin</span>
               </div>
               <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSidebarOpen(false)}
                  className="lg:hidden    "
               >
                  <X className="w-5 h-5" />
               </Button>
            </div>

            <nav className="p-4 space-y-2 flex-1 overflow-y-auto">
               {adminNavigation.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                     <Link
                        key={item.name}
                        href={item.href}
                        className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-all duration-200 ${isActive
                           ? 'bg-gradient-to-r from-red-500/20 to-orange-500/20     border border-red-500/20'
                           : '    hover: /50'
                           }`}
                        onClick={() => setSidebarOpen(false)}
                     >
                        <item.icon className="w-5 h-5" />
                        <span>{item.name}</span>
                     </Link>
                  );
               })}
            </nav>

            {/* Admin Profile */}
            <div className="p-4 border-t border-border">
               <div className="flex items-center space-x-3 mb-3">
                  <div className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center">
                     <span className="    font-medium">A</span>
                  </div>
                  <div>
                     <p className="text-sm font-medium    ">Admin User</p>
                     <p className="text-xs    ">Super Admin</p>
                  </div>
               </div>
               <Button variant="outline" size="sm" className="w-full text-muted-foreground  border-border">
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
               </Button>
            </div>
         </div>

         {/* Main content */}
         <div className="lg:pl-64">
            {/* Top bar */}
            <div className="sticky top-0 z-30 flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8   backdrop-blur-xl border-b border-border">
               <div className="flex items-center space-x-4">
                  <Button
                     variant="ghost"
                     size="sm"
                     onClick={() => setSidebarOpen(true)}
                     className="lg:hidden    "
                  >
                     <Menu className="w-5 h-5" />
                  </Button>

                  <div className="text-sm    ">
                     Admin Panel - SocialAI Management
                  </div>
               </div>

               <div className="flex items-center space-x-4">
                  <Button variant="ghost" size="sm" className="relative    ">
                     <Bell className="w-5 h-5" />
                     <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                  </Button>
                  <Link href="/dashboard">
                     <Button size="sm" variant="outline" className=" border-border    ">
                        Back to App
                     </Button>
                  </Link>
               </div>
            </div>

            {/* Page content */}
            <main>
               {children}
            </main>
         </div>
      </div>
   );
}

const adminNavigation = [
   { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
   { name: 'User Management', href: '/admin/users', icon: Users },
   { name: 'Analytics', href: '/admin/analytics', icon: BarChart3 },
   { name: 'AI Models', href: '/admin/ai-models', icon: Brain },
   { name: 'Revenue', href: '/admin/revenue', icon: DollarSign },
   { name: 'System Health', href: '/admin/system', icon: Activity },
   { name: 'Database', href: '/admin/database', icon: Database },
   { name: 'Server Logs', href: '/admin/logs', icon: Server },
   { name: 'Settings', href: '/admin/settings', icon: Settings },
];
