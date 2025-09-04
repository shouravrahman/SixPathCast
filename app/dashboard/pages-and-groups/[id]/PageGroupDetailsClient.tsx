'use client';

import { Button } from "@/components/ui/button";
import { AudienceDemographics } from "@/components/pages-and-groups/AudienceDemographics";
import { GrowthInsights } from "@/components/pages-and-groups/GrowthInsights";
import { TopPerformingContent } from "@/components/pages-and-groups/TopPerformingContent";
import { ScheduledContent } from "@/components/pages-and-groups/ScheduledContent";
import { ContentRecommendations } from "@/components/pages-and-groups/ContentRecommendations";
import { Facebook, Linkedin, PenSquare, ArrowLeft } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { PageOrGroup } from "@/data/mockPagesAndGroups";
import Link from 'next/link';

const platformIcons = {
    Facebook: <Facebook className="h-6 w-6 text-blue-600" />,
    LinkedIn: <Linkedin className="h-6 w-6 text-blue-800" />,
};

export function PageGroupDetailsClient({ pageDetails }: { pageDetails: PageOrGroup }) {

  return (
    <div className="p-4 sm:p-6 space-y-4">
      <div className="flex flex-wrap justify-between items-center gap-4">
        <div className="flex items-center gap-3">
            <Avatar className="w-12 h-12 border-2 border-border">
                <AvatarImage src={pageDetails.avatarUrl} />
                <AvatarFallback>{pageDetails.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
                <h1 className="text-2xl font-bold flex items-center gap-2">
                    {platformIcons[pageDetails.platform]}
                    {pageDetails.name}
                </h1>
                <p className="text-muted-foreground">{pageDetails.type} with {pageDetails.followers.toLocaleString()} followers</p>
            </div>
        </div>
        <div className="flex items-center gap-2">
            <Link href="/dashboard/pages-and-groups">
                <Button variant="outline">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back
                </Button>
            </Link>
            <Button>
                <PenSquare className="h-4 w-4 mr-2" />
                Create Post
            </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        
        <div className="lg:col-span-2 space-y-4">
            <GrowthInsights />
            <TopPerformingContent />
        </div>

        <div className="lg:col-span-1 space-y-4">
            <AudienceDemographics />
            <ContentRecommendations />
        </div>

      </div>
      <ScheduledContent />
    </div>
  );
}