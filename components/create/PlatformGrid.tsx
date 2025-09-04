'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { platforms } from '@/data/mockData';

interface PlatformGridProps {
   selectedPlatforms: string[];
   setSelectedPlatforms: (platforms: string[]) => void;
   selectedPostTypes: Record<string, string[]>;
   setSelectedPostTypes: (types: Record<string, string[]>) => void;
}

export default function PlatformGrid({
   selectedPlatforms,
   setSelectedPlatforms,
   selectedPostTypes,
   setSelectedPostTypes
}: PlatformGridProps) {
   const [expandedPlatforms, setExpandedPlatforms] = useState<string[]>([]);

   const handlePlatformToggle = (platformId: string) => {
      setSelectedPlatforms(
         selectedPlatforms.includes(platformId)
            ? selectedPlatforms.filter(id => id !== platformId)
            : [...selectedPlatforms, platformId]
      );
   };

   const handlePostTypeToggle = (platformId: string, postType: string) => {
      const currentTypes = selectedPostTypes[platformId] || [];
      setSelectedPostTypes({
         ...selectedPostTypes,
         [platformId]: currentTypes.includes(postType)
            ? currentTypes.filter(type => type !== postType)
            : [...currentTypes, postType]
      });
   };

   const toggleExpanded = (platformId: string) => {
      setExpandedPlatforms(prev =>
         prev.includes(platformId)
            ? prev.filter(id => id !== platformId)
            : [...prev, platformId]
      );
   };

   return (
      <Card  >
         <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
               <h3 className="    font-medium">Platforms</h3>
               <button
                  onClick={() => setExpandedPlatforms(expandedPlatforms.length === 0 ? platforms.map(p => p.id) : [])}
                  className="text-sm text-purple-400 hover:text-purple-300"
               >
                  {expandedPlatforms.length === 0 ? 'Expand all' : 'Collapse all'}
               </button>
            </div>

            <div className="space-y-3">
               {platforms.map((platform) => {
                  const isSelected = selectedPlatforms.includes(platform.id);
                  const isExpanded = expandedPlatforms.includes(platform.id);
                  const selectedTypes = selectedPostTypes[platform.id] || [];

                  return (
                     <div key={platform.id} className="space-y-2">
                        <div
                           className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-all ${isSelected
                              ? 'border-purple-500    '
                              : ' border-border   hover: border-border'
                              }`}
                           onClick={() => handlePlatformToggle(platform.id)}
                        >
                           <div className="flex items-center space-x-3">
                              <div className={`w-8 h-8 rounded-lg flex items-center justify-center     font-bold ${platform.color}`}>
                                 {platform.icon}
                              </div>
                              <div>
                                 <div className="text-sm font-medium    ">{platform.name}</div>
                                 <div className="text-xs    ">{platform.limit} chars max</div>
                              </div>
                           </div>
                           <div className="flex items-center space-x-2">
                              {selectedTypes.length > 0 && (
                                 <Badge variant="secondary" className="text-xs">
                                    {selectedTypes.length} selected
                                 </Badge>
                              )}
                              <button
                                 onClick={(e) => {
                                    e.stopPropagation();
                                    toggleExpanded(platform.id);
                                 }}
                                 className="   "
                              >
                                 {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                              </button>
                           </div>
                        </div>

                        {isSelected && isExpanded && (
                           <div className="ml-4 grid grid-cols-2 gap-2">
                              {platform.postTypes.map((postType) => {
                                 const isTypeSelected = selectedTypes.includes(postType.id);
                                 return (
                                    <button
                                       key={postType.id}
                                       onClick={() => handlePostTypeToggle(platform.id, postType.id)}
                                       className={`p-2 rounded-lg border text-left transition-all ${isTypeSelected
                                          ? 'border-purple-500     text-purple-300'
                                          : ' border-border   text-muted-foreground hover: border-border'
                                          }`}
                                    >
                                       <span className="text-xs font-medium">{postType.name}</span>
                                    </button>
                                 );
                              })}
                           </div>
                        )}
                     </div>
                  );
               })}
            </div>
         </CardContent>
      </Card>
   );
}
