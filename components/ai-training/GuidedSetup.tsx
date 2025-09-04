'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, FileText, Link as LinkIcon, Users, Settings } from 'lucide-react';
import Link from 'next/link';

export default function GuidedSetup() {
   return (
      <Card className="mb-8 border-border">
         <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Welcome! Let's get you set up.</CardTitle>
         </CardHeader>
         <CardContent>
            <p className="mb-4">To unlock the full power of AI content generation, please complete your brand profile:</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
               <div className="flex-1 p-4 rounded-lg border border-dashed border-border">
                  <div className="flex items-center mb-2">
                     <Settings className="h-5 w-5 mr-2 text-purple-400" />
                     <h4 className="font-semibold">Define Your Brand</h4>
                  </div>
                  <p className="text-sm text-muted-foreground">Tell the AI about your business, audience, and goals.</p>
               </div>
               <div className="flex-1 p-4 rounded-lg border border-dashed border-border">
                  <div className="flex items-center mb-2">
                     <FileText className="h-5 w-5 mr-2 text-blue-400" />
                     <h4 className="font-semibold">Set Voice & Tone</h4>
                  </div>
                  <p className="text-sm text-muted-foreground">Guide the AI on how your content should sound.</p>
               </div>
               <div className="flex-1 p-4 rounded-lg border border-dashed border-border">
                  <div className="flex items-center mb-2">
                     <LinkIcon className="h-5 w-5 mr-2 text-green-400" />
                     <h4 className="font-semibold">Upload Assets</h4>
                  </div>
                  <p className="text-sm text-muted-foreground">Provide logos, images, and other brand visuals.</p>
               </div>
            </div>
            <div className="mt-6 text-center">
               <Link href="/dashboard/settings">
                  <Button size="lg">
                     <CheckCircle className="h-5 w-5 mr-2" />
                     Complete Your Brand Profile
                  </Button>
               </Link>
            </div>
         </CardContent>
      </Card>
   );
}