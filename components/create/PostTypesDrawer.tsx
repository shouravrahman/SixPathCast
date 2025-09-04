import { CheckCircle2, Circle, Info, X } from "lucide-react";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";

interface PostTypesDrawerProps {
   isOpen: boolean;
   platform: any;
   selectedPostTypes: Record<string, string[]>;
   onPostTypeToggle: (platformId: string, postType: string) => void;
   onClose: () => void;
}
const postTypeDescriptions = {
   post: "Standard text, image, or video posts that appear in feeds",
   thread: "Connected series of posts that tell a longer story",
   poll: "Interactive posts that let your audience vote on questions",
   article: "Long-form professional content with rich formatting",
   carousel: "Multiple images or slides that users can swipe through",
   video: "Video content optimized for the platform's player",
   story: "Temporary content that disappears after 24 hours",
   reel: "Short-form vertical video content",
   short: "Bite-sized vertical videos under 60 seconds",
   live: "Real-time streaming content with audience interaction",
   pin: "Visual bookmarks that users can save to boards",
   "story pin": "Multi-page story format with interactive elements"
};

export const PostTypesDrawer = ({ isOpen, platform, selectedPostTypes, onPostTypeToggle, onClose }: PostTypesDrawerProps) => {
   if (!platform) return null;

   const handlePostTypeClick = (postTypeId: string) => {
      onPostTypeToggle(platform.id, postTypeId);
   };

   return (
      <>
         {/* Backdrop */}
         <div
            className={`fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300 z-40 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
            onClick={onClose}
         />

         {/* Drawer */}
         <div className={`fixed bg-card top-0 right-0 h-full w-[28rem]   border-l   shadow-2xl transform transition-transform duration-300 ease-out z-50 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
            <div className="flex items-center justify-between p-6 border-b  ">
               <div className="flex items-center space-x-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center     ${platform.color}`}>
                     {platform.icon}
                  </div>
                  <div>
                     <h2 className="text-lg font-semibold    ">
                        {platform.name} Content Types
                     </h2>
                     <p className="text-xs    ">Choose what type of content to create</p>
                  </div>
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
               <div className="mb-6 p-4    border    rounded-lg">
                  <div className="flex items-start space-x-3">
                     <Info className="h-5 w-5 text-accent mt-0.5 flex-shrink-0" />
                     <div>
                        <h3 className="text-sm font-medium   mb-1">Content Type Guide</h3>
                        <p className="text-xs ">
                           Each content type has different formatting, audience reach, and engagement patterns.
                           Select multiple types to maximize your content's impact across {platform.name}.
                        </p>
                     </div>
                  </div>
               </div>

               <div className="space-y-3">
                  {platform.postTypes.map((postType: any) => {
                     const isSelected = selectedPostTypes[platform.id]?.includes(postType.id);
                     const description = postTypeDescriptions[postType.id] || "Standard content format for this platform";

                     return (
                        <div
                           key={postType.id}
                           className={`p-4 rounded-lg border cursor-pointer transition-all duration-200  ${isSelected
                              ? '    border-purple-500/50 shadow-lg'
                              : ' border-border shadow-none'
                              }`}
                           onClick={() => handlePostTypeClick(postType.id)}
                        >
                           <div className="flex items-start space-x-3">
                              <div className="mt-1 flex-shrink-0">
                                 {isSelected ? (
                                    <CheckCircle2 className="h-5 w-5 text-purple-400" />
                                 ) : (
                                    <Circle className="h-5 w-5 text-muted-foreground" />
                                 )}
                              </div>
                              <div className="flex-1">
                                 <div className="flex items-center justify-between mb-2">
                                    <h3 className={`font-medium ${isSelected ? 'text-purple-300' : '   '}`}>
                                       {postType.name}
                                    </h3>
                                    <Badge
                                       variant={isSelected ? 'default' : 'outline'}
                                       className={`text-xs ${isSelected ? '       ' : '   '}`}
                                    >
                                       {platform.name}
                                    </Badge>
                                 </div>
                                 <p className={`text-sm ${isSelected ? 'text-purple-200/90' : '   '}`}>
                                    {description}
                                 </p>
                                 {isSelected && (
                                    <div className="mt-2 text-xs text-purple-300/80">
                                       ✓ Selected for posting
                                    </div>
                                 )}
                              </div>
                           </div>
                        </div>
                     );
                  })}
               </div>

               <div className="mt-6 p-4   border  border-border rounded-lg">
                  <h4 className="text-sm font-medium text-muted-foreground mb-2">Character Limit</h4>
                  <p className="text-xs    ">
                     Maximum {platform.limit.toLocaleString()} characters per post on {platform.name}
                  </p>
               </div>
            </div>
         </div>
      </>
   );
};
