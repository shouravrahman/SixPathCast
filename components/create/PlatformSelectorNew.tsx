
'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import useMockDataStore from '@/hooks/useMockDataStore';
import PlatformItem from './PlatformItem';

interface PlatformSelectorProps {
   selectedPlatforms: string[];
   setSelectedPlatforms: (platforms: string[]) => void;
   selectedTargets: any[];
   setSelectedTargets: (targets: any[]) => void;
   selectedPostTypes: Record<string, string[]>;
   setSelectedPostTypes: (types: Record<string, string[]>) => void;
}

const PlatformSelectorNew = React.memo(
   ({ selectedPlatforms, setSelectedPlatforms, selectedTargets, setSelectedTargets, selectedPostTypes, setSelectedPostTypes }: PlatformSelectorProps) => {
      const { platformsWithPagesAndGroups } = useMockDataStore();

      const handlePlatformToggle = (platformId: string) => {
         const newSelectedPlatforms = selectedPlatforms.includes(platformId)
            ? selectedPlatforms.filter(p => p !== platformId)
            : [...selectedPlatforms, platformId];
         setSelectedPlatforms(newSelectedPlatforms);
      };

      const handleTargetToggle = (target: any) => {
         const isCurrentlySelected = selectedTargets.some(t => t.id === target.id);
         const newSelectedTargets = isCurrentlySelected
            ? selectedTargets.filter(t => t.id !== target.id)
            : [...selectedTargets, target];

         setSelectedTargets(newSelectedTargets);

         const platformId = target.platform.toLowerCase();
         const wasLastTargetForPlatform = isCurrentlySelected && !newSelectedTargets.some(t => t.platform.toLowerCase() === platformId);

         if (wasLastTargetForPlatform) {
            const newPostTypes = { ...selectedPostTypes };
            delete newPostTypes[platformId];
            setSelectedPostTypes(newPostTypes);
         }
      };

      const handlePostTypeToggle = (platformId: string, postType: string) => {
         const currentTypes = selectedPostTypes[platformId] || [];
         const newTypes = currentTypes.includes(postType)
            ? currentTypes.filter(type => type !== postType)
            : [...currentTypes, postType];

         setSelectedPostTypes({
            ...selectedPostTypes,
            [platformId]: newTypes,
         });
      };

      return (
         <Card className="  border-border">
            <CardHeader>
               <CardTitle>Select Platforms & Content Types</CardTitle>
            </CardHeader>
            <CardContent>
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {platformsWithPagesAndGroups.map(platform => (
                     <PlatformItem
                        key={platform.id}
                        platform={platform}
                        selectedPlatforms={selectedPlatforms}
                        onPlatformToggle={handlePlatformToggle}
                        selectedTargets={selectedTargets}
                        onTargetToggle={handleTargetToggle}
                        selectedPostTypes={selectedPostTypes}
                        onPostTypeToggle={handlePostTypeToggle}
                     />
                  ))}
               </div>
            </CardContent>
         </Card>
      );
   }
);

PlatformSelectorNew.displayName = 'PlatformSelectorNew';
export default PlatformSelectorNew;
