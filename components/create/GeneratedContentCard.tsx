
"use client";

import {
   Copy,
   Edit,
   MoreVertical,
   RefreshCw,
   Save,
   Send,
   ThumbsDown,
   ThumbsUp,
   Trash2,
   Calendar,
   ImageIcon
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
   Card,
   CardContent,
   CardFooter,
   CardHeader,
} from "@/components/ui/card";
import {
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuItem,
   DropdownMenuSeparator,
   DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import ContentEditor from "./ContentEditor";

interface GeneratedContentCardProps {
   content: any;
   platform: any;
   isEditing: boolean;
   onEdit: () => void;
   onSave: () => void;
   onChange: (newText: string) => void;
   onFeedback: (feedback: 'good' | 'bad') => void;
   onRegenerate: () => void;
   onAction: (action: string) => void;
}

export default function GeneratedContentCard({
   content,
   platform,
   isEditing,
   onEdit,
   onSave,
   onChange,
   onFeedback,
   onRegenerate,
   onAction
}: GeneratedContentCardProps) {
   return (
      <Card className="  border-border   hover: border-border transition-colors duration-200 flex flex-col">
         <CardHeader className="p-4 flex-row items-start justify-between">
            <div className="flex items-center gap-3">
               <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center     text-lg font-bold ${platform?.color}`}>
                  {platform?.icon}
               </div>
               <div>
                  <p className="text-sm font-medium    ">{platform?.name}</p>
                  <p className="text-xs    ">{content.postType}</p>
               </div>
            </div>
            <Badge
               variant="default"
               className="bg-green-500/10 text-green-400 border-green-500/20"
            >
               {content.engagement_prediction}%
            </Badge>
         </CardHeader>
         <CardContent className="p-4 pt-0 flex-grow">
            <ContentEditor
               content={content.text}
               platform={platform}
               isEditing={isEditing}
               onEdit={onEdit}
               onSave={onSave}
               onChange={onChange}
            />
         </CardContent>
         <Separator className="border-border" />
         <CardFooter className="p-3 flex items-center justify-between   rounded-b-xl">
            <div className="flex items-center gap-1">
               <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => onFeedback('good')}>
                  <ThumbsUp className="h-4 w-4" />
               </Button>
               <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => onFeedback('bad')}>
                  <ThumbsDown className="h-4 w-4" />
               </Button>
            </div>
            <div className="flex items-center gap-2">
               <Button variant="outline" size="sm" className="text-xs" onClick={onRegenerate}>
                  <RefreshCw className="h-3 w-3 mr-1.5" />
                  Regenerate
               </Button>
               <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                     <Button size="icon" variant="ghost" className="h-8 w-8">
                        <MoreVertical className="h-4 w-4" />
                     </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="slate-dropdown">
                     <DropdownMenuItem onClick={onEdit}>
                        <Edit className="mr-2 h-4 w-4" />
                        <span>Edit</span>
                     </DropdownMenuItem>
                     <DropdownMenuItem onClick={() => onAction('duplicate')}>
                        <Copy className="mr-2 h-4 w-4" />
                        <span>Duplicate</span>
                     </DropdownMenuItem>
                     <DropdownMenuItem onClick={() => onAction('generate-image')}>
                        <ImageIcon className="mr-2 h-4 w-4" />
                        <span>Generate Image</span>
                     </DropdownMenuItem>
                     <DropdownMenuSeparator />
                     <DropdownMenuItem onClick={() => onAction('schedule')}>
                        <Calendar className="mr-2 h-4 w-4" />
                        <span>Schedule</span>
                     </DropdownMenuItem>
                     <DropdownMenuItem onClick={() => onAction('post-now')}>
                        <Send className="mr-2 h-4 w-4" />
                        <span>Post Now</span>
                     </DropdownMenuItem>
                     <DropdownMenuSeparator />
                     <DropdownMenuItem className="text-red-500" onClick={() => onAction('delete')}>
                        <Trash2 className="mr-2 h-4 w-4" />
                        <span>Delete</span>
                     </DropdownMenuItem>
                  </DropdownMenuContent>
               </DropdownMenu>
            </div>
         </CardFooter>
      </Card>
   );
}
