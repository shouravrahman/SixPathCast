import { X } from "lucide-react";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Checkbox } from "../ui/checkbox";
import { PlatformWithPagesAndGroups, SelectableItem } from "@/data/mockPlatformData";


interface SlideDrawerProps {
   isOpen: boolean;
   platform: PlatformWithPagesAndGroups;
   selectedTargets: SelectableItem[];
   onTargetToggle: (target: SelectableItem) => void;
   onClose: () => void;
}

export const SlideDrawer = ({ isOpen, platform, selectedTargets, onTargetToggle, onClose }: SlideDrawerProps) => {
   if (!platform) return null;

   const renderSubItem = (item: SelectableItem) => {
      const isSelected = selectedTargets.some(t => t.id === item.id);
      return (
         <div key={item.id} className="flex items-center space-x-3 py-3 px-4 rounded-lg hover: /30 transition-colors duration-200">
            <Checkbox
               id={`drawer-${item.id}`}
               checked={isSelected}
               onCheckedChange={() => onTargetToggle(item)}
               className=" border-border     data-[state=checked]:border-purple-500"
            />
            <Avatar className="w-8 h-8 border-2  border-border">
               {item.avatarUrl && <AvatarImage src={item.avatarUrl} />}
               <AvatarFallback className="text-sm   text-muted-foreground">{item.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
               <label htmlFor={`drawer-${item.id}`} className="text-sm font-medium cursor-pointer block">
                  {item.name}
               </label>
               <Badge variant={item.type === 'Profile' ? 'outline' : 'secondary'} className="text-xs mt-1">
                  {item.type}
               </Badge>
            </div>
         </div>
      );
   };

   return (
      <>
         {/* Backdrop */}
         <div
            className={`fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300 z-40 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
            onClick={onClose}
         />

         {/* Drawer */}
         <div className={`fixed bg-card top-0 right-0 h-full w-96   border-l   shadow-2xl transform transition-transform duration-300 ease-out z-50 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
            <div className="flex items-center justify-between p-6 border-b  ">
               <div className="flex items-center space-x-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center     ${platform.color}`}>
                     {platform.icon}
                  </div>
                  <h2 className="text-lg font-semibold    ">
                     {platform.name} Pages & Groups
                  </h2>
               </div>
               <Button
                  variant="ghost"
                  size="sm"
                  onClick={onClose}
                  className="w-8 h-8 p-0 hover: "
               >
                  <X className="h-4 w-4" />
               </Button>
            </div>

            <div className="p-6 overflow-y-auto h-full pb-20">
               <p className="text-sm  mb-4">
                  Select the pages and groups you want to post to:
               </p>
               <div className="space-y-2">
                  {platform.pagesAndGroups?.filter(p => p.type !== 'Profile').map(renderSubItem)}
               </div>
            </div>
         </div>
      </>
   );
};
