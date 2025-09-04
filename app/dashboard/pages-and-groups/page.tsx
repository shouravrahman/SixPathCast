'use client';

import { useState } from 'react';
import { mockPagesAndGroups, PageOrGroup } from '@/data/mockPagesAndGroups';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Facebook, Linkedin, PlusCircle } from 'lucide-react';
import Link from 'next/link';

const platformIcons = {
   Facebook: <Facebook className="h-5 w-5" />,
   LinkedIn: <Linkedin className="h-5 w-5" />,
};

export default function PagesAndGroupsPage() {
   const [pages, setPages] = useState<PageOrGroup[]>(mockPagesAndGroups);

   const handleToggle = (id: string) => {
      setPages(pages.map(p => p.id === id ? { ...p, isEnabled: !p.isEnabled } : p));
   };

   return (
      <div className="dashboard-page-container">
         <div className="mb-8">
            <div className="flex items-center justify-between">
               <div>
                  <h1 className="dashboard-header-title">Pages & Groups</h1>
                  <p className="dashboard-header-description">
                     Manage where your content gets published across platforms.
                  </p>
               </div>
               <div className="flex items-center space-x-2">
                  <Button asChild className="btn-gradient">
                     <Link href="/dashboard/accounts">
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Connect Account
                     </Link>
                  </Button>
               </div>
            </div>
         </div>

         <Card  >
            <CardHeader>
               <CardTitle>Your Connected Entities</CardTitle>
               <CardDescription>
                  Enable or disable pages and groups for them to appear in the content creation flow.
               </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
               <Table>
                  <TableHeader>
                     <TableRow>
                        <TableHead className="pl-6">Name</TableHead>
                        <TableHead>Platform</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead className="text-right">Followers / Members</TableHead>
                        <TableHead className="text-center w-[180px] pr-6">Enabled</TableHead>
                     </TableRow>
                  </TableHeader>
                  <TableBody>
                     {pages.map((page) => (
                        <TableRow key={page.id}>
                           <TableCell className="font-medium pl-6">
                              <Link href={`/dashboard/pages-and-groups/${page.id}`} className="flex items-center gap-3 hover:underline">
                                 <Avatar className="w-8 h-8 border">
                                    <AvatarImage src={page.avatarUrl} />
                                    <AvatarFallback>{page.name.charAt(0)}</AvatarFallback>
                                 </Avatar>
                                 {page.name}
                              </Link>
                           </TableCell>
                           <TableCell>
                              <div className="flex items-center gap-2">
                                 {platformIcons[page.platform]}
                                 {page.platform}
                              </div>
                           </TableCell>
                           <TableCell>
                              <Badge variant={page.type === 'Page' ? 'default' : 'secondary'}>{page.type}</Badge>
                           </TableCell>
                           <TableCell className="text-right">{page.followers.toLocaleString()}</TableCell>
                           <TableCell className="text-center pr-6">
                              <Switch
                                 checked={page.isEnabled}
                                 onCheckedChange={() => handleToggle(page.id)}
                                 aria-label={`Enable ${page.name}`}
                                 id={`enable-${page.id}`}
                              />
                           </TableCell>
                        </TableRow>
                     ))}
                  </TableBody>
               </Table>
            </CardContent>
         </Card>
      </div>
   );
}
