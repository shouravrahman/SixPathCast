'use client';

import React, { useState } from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { ChevronDown, FileText } from 'lucide-react';
import { Badge } from '../ui/badge';
import { SlideDrawer } from './SlideDrawer';
import { PostTypesDrawer } from './PostTypesDrawer';

interface PlatformItemProps {
   platform: any;
   selectedPlatforms: string[];
   onPlatformToggle: (platformId: string) => void;
   selectedTargets: any[];
   onTargetToggle: (target: any) => void;
   selectedPostTypes: Record<string, string[]>;
   onPostTypeToggle: (platformId: string, postType: string) => void;
}

// ... (rest of the file is the same until PlatformItem component)

const PlatformItem = React.memo(
   ({ platform, selectedPlatforms, onPlatformToggle, selectedTargets, onTargetToggle, selectedPostTypes, onPostTypeToggle }: PlatformItemProps) => {
      const [isPagesDrawerOpen, setIsPagesDrawerOpen] = useState(false);
      const [isPostTypesDrawerOpen, setIsPostTypesDrawerOpen] = useState(false);
      const isPlatformSelected = selectedPlatforms.includes(platform.id);
      const hasSubItems = platform.pagesAndGroups && platform.pagesAndGroups.length > 1;
      const selectedPostTypesCount = selectedPostTypes[platform.id]?.length || 0;

      const handleOpenPagesDrawer = () => {
         setIsPagesDrawerOpen(true);
      };

      const handleClosePagesDrawer = () => {
         setIsPagesDrawerOpen(false);
      };

      const handleOpenPostTypesDrawer = () => {
         setIsPostTypesDrawerOpen(true);
      };

      const handleClosePostTypesDrawer = () => {
         setIsPostTypesDrawerOpen(false);
      };

      return (
         <>
            <div
               className={`relative p-4 rounded-lg dark: /50   border transition-all duration-300 hover:shadow-md cursor-pointer ${isPlatformSelected ? 'border-purple-500 shadow-lg' : 'border-border'}`}
               onClick={() => onPlatformToggle(platform.id)}
            >
               <div className="flex items-center justify-between">
                  <div
                     className="flex items-center flex-1"
                  >
                     <Checkbox
                        id={`platform-${platform.id}`}
                        checked={isPlatformSelected}
                        className="mr-3  border-border data-[state=checked]:    data-[state=checked]:border-purple-500"
                     />
                     <div className={`w-10 h-10 rounded-lg flex items-center justify-center     text-lg transition-all duration-300 ${isPlatformSelected ? platform.color : ' '}`}>
                        {platform.icon}
                     </div>
                     <div className="ml-3 flex-1">
                        <label htmlFor={`platform-${platform.id}`} className="font-medium cursor-pointer block">
                           {platform.name}
                        </label>
                        <p className="text-xs text-muted-foreground dark:   ">{platform.limit} chars max</p>
                     </div>
                  </div>

                  {hasSubItems && (
                     <Button
                        variant="ghost"
                        size="sm"
                        className="w-8 h-8 p-0  mr-2"
                        onClick={(e) => { e.stopPropagation(); handleOpenPagesDrawer(); }}
                     >
                        <ChevronDown className="h-4 w-4" />
                     </Button>
                  )}
               </div>

               {isPlatformSelected && (
                  <div className="mt-4 pt-3 border-t border-border">
                     <Button
                        variant="outline"
                        size="sm"
                        onClick={(e) => { e.stopPropagation(); handleOpenPostTypesDrawer(); }}
                        className="w-full justify-between     "
                     >
                        <div className="flex items-center">
                           <FileText className="h-4 w-4 mr-2" />
                           <span>Configure</span>
                        </div>
                        <div className="flex items-center space-x-2">
                           {selectedPostTypesCount > 0 && (
                              <Badge variant="secondary" className="        text-xs">
                                 {selectedPostTypesCount}
                              </Badge>
                           )}
                           <span className="text-xs">→</span>
                        </div>
                     </Button>
                  </div>
               )}
            </div>

            <SlideDrawer
               isOpen={isPagesDrawerOpen}
               platform={platform}
               selectedTargets={selectedTargets}
               onTargetToggle={onTargetToggle}
               onClose={handleClosePagesDrawer}
            />

            <PostTypesDrawer
               isOpen={isPostTypesDrawerOpen}
               platform={platform}
               selectedPostTypes={selectedPostTypes}
               onPostTypeToggle={onPostTypeToggle}
               onClose={handleClosePostTypesDrawer}
            />
         </>
      );
   }
);

PlatformItem.displayName = 'PlatformItem';
export default PlatformItem;
