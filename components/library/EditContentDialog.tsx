'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import ContentEditor from '@/components/create/ContentEditor';

export default function EditContentDialog({ open, onOpenChange, contentItem, onSave }) {
   if (!contentItem) {
      return null;
   }

   return (
      <Dialog open={open} onOpenChange={onOpenChange}>
         <DialogContent className="   max-w-4xl">
            <DialogHeader>
               <DialogTitle  >Edit Content</DialogTitle>
            </DialogHeader>
            <div className="h-[60vh] overflow-y-auto p-6">
               <ContentEditor
                  content={contentItem.content}
                  platform={{ limit: 1000 }}
                  isEditing={true}
                  onEdit={() => { }}
                  onSave={onSave}
                  onChange={() => { }}
               />
            </div>
         </DialogContent>
      </Dialog>
   );
}
