'use client';

import { ChevronDown } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { aiModels } from '@/data/mockData';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

interface AIModelSelectorProps {
   selectedModel: string;
   setSelectedModel: (model: string) => void;
}

export default function AIModelSelector({ selectedModel, setSelectedModel }: AIModelSelectorProps) {
   const selectedModelData = aiModels.find(m => m.id === selectedModel);

   return (
      <Card  >
         <CardContent className="p-2">
            <h3 className=" font-medium mb-2">AI Model</h3>
            <div className="relative">
               <Select value={selectedModel} onValueChange={setSelectedModel}>
                  <SelectTrigger>
                     <SelectValue placeholder="Select model" />
                  </SelectTrigger>
                  <SelectContent>
                     {aiModels.map((model) => (
                        <SelectItem key={model.id} value={model.id}>
                           {model.name}
                        </SelectItem>
                     ))}
                  </SelectContent>
               </Select>
               <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4     pointer-events-none" />
            </div>
            {/* {selectedModelData && (
               <div className="mt-3 text-xs    ">
                  <div className="flex justify-between">
                     <span>{selectedModelData.provider}</span>
                     <span>{selectedModelData.cost}</span>
                  </div>
                  <div className="flex justify-between mt-1">
                     <span>Speed: {selectedModelData.speed}</span>
                     <span>Quality: {selectedModelData.quality}</span>
                  </div>
               </div>
            )} */}
         </CardContent>
      </Card>
   );
}
