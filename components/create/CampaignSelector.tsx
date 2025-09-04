'use client';

import { ChevronDown } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { campaigns } from '@/data/mockData';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

interface CampaignSelectorProps {
   selectedCampaign: string;
   setSelectedCampaign: (campaign: string) => void;
}

export default function CampaignSelector({ selectedCampaign, setSelectedCampaign }: CampaignSelectorProps) {
   const selectedCampaignData = campaigns.find(c => c.id === parseInt(selectedCampaign));

   return (
      <Card >
         <CardContent className="p-2">
            <h3 className=" font-medium mb-2">Campaign</h3>
            <div className="relative">
               <Select value={selectedCampaign} onValueChange={setSelectedCampaign}>
                  <SelectTrigger>
                     <SelectValue placeholder="Select campaign" />
                  </SelectTrigger>
                  <SelectContent>
                     {campaigns.map((campaign) => (
                        <SelectItem key={campaign.id} value={campaign.id.toString()}>
                           {campaign.name}
                        </SelectItem>
                     ))}
                  </SelectContent>
               </Select>
               <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4     pointer-events-none" />
            </div>
            {selectedCampaignData && (
               <div className="mt-3 p-3 rounded-lg dark:    border border-border">
                  <p className="text-xs ">{selectedCampaignData.description}</p>
               </div>
            )}
         </CardContent>
      </Card>
   );
}
