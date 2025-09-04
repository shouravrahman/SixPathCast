'use client';

import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import PlannerView from '@/components/content-studio/PlannerView';
import BrainstormViewV2 from '@/components/content-studio/BrainstormViewV2';
import InspirationView from '@/components/content-studio/InspirationView';
import { PenTool, Lightbulb, Calendar } from 'lucide-react';

const tabConfig = [
   {
      id: 'planner',
      label: 'Planner',
      icon: Calendar,
   },
   {
      id: 'brainstorm',
      label: 'Brainstorm',
      icon: PenTool,
   },
   {
      id: 'inspiration',
      label: 'Inspiration',
      icon: Lightbulb,
   }
];

export default function ContentStudioPage() {
   const [activeTab, setActiveTab] = useState('brainstorm');

   return (
      <div className="min-h-screen   flex flex-col">
         <Tabs value={activeTab} onValueChange={setActiveTab} className="flex flex-col w-full">
            {/* Horizontal Tabs */}
            <div className="w-full   border-b">
               <div className="p-4">
                  <TabsList className="grid w-full grid-cols-3">
                     {tabConfig.map((tab) => {
                        const Icon = tab.icon;
                        return (
                           <TabsTrigger
                              key={tab.id}
                              value={tab.id}
                           >
                              <div className="flex items-center space-x-3">
                                 <Icon className="w-4 h-4" />
                                 <span className="font-medium text-sm">{tab.label}</span>
                              </div>
                           </TabsTrigger>
                        );
                     })}
                  </TabsList>
               </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 overflow-hidden">
               <TabsContent value="planner" className="h-full m-0">
                  <div className="h-full">
                     <PlannerView />
                  </div>
               </TabsContent>
               <TabsContent value="brainstorm" className="h-full m-0">
                  <div className="h-full">
                     <BrainstormViewV2 />
                  </div>
               </TabsContent>
               <TabsContent value="inspiration" className="h-full m-0">
                  <div className="h-full">
                     <InspirationView />
                  </div>
               </TabsContent>
            </div>
         </Tabs>
      </div>
   );
}
