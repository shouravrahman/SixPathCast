
'use client';

import React, { useState } from 'react';
import {
   Collapsible,
   CollapsibleContent,
   CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { ChevronDown } from 'lucide-react';

interface CollapsibleSectionProps {
   title: string;
   children: React.ReactNode;
   defaultOpen?: boolean;
}

export default function CollapsibleSection({
   title,
   children,
   defaultOpen = false,
}: CollapsibleSectionProps) {
   const [isOpen, setIsOpen] = useState(defaultOpen);

   return (
      <Collapsible open={isOpen} onOpenChange={setIsOpen} className="rounded-lg border    ">
         <CollapsibleTrigger className="flex w-full items-center justify-between p-4 text-lg font-medium     transition-colors hover: /70 data-[state=open]: /70 rounded-t-lg">
            {title}
            <ChevronDown
               className={`h-5 w-5     transition-transform duration-200 ${isOpen ? 'rotate-180' : 'rotate-0'}`}
            />
         </CollapsibleTrigger>
         <CollapsibleContent className="overflow-hidden transition-all duration-300 data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down">
            <div className="p-4 pt-0">
               {children}
            </div>
         </CollapsibleContent>
      </Collapsible>
   );
}
