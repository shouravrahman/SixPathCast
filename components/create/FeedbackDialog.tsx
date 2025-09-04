'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useState } from 'react';

export default function FeedbackDialog({ open, onOpenChange, onSubmit }) {
   const [reason, setReason] = useState('');
   const [details, setDetails] = useState('');

   const handleSubmit = () => {
      onSubmit({ reason, details });
      setReason('');
      setDetails('');
   };

   return (
      <Dialog open={open} onOpenChange={onOpenChange}>
         <DialogContent className="  border-border">
            <DialogHeader>
               <DialogTitle  >Provide Feedback</DialogTitle>
               <DialogDescription>
                  Your feedback helps us improve the AI.
               </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
               <div>
                  <label className="text-sm     mb-2 block">What was the issue?</label>
                  <div className="grid grid-cols-2 gap-2">
                     <Button variant={reason === 'inaccurate' ? 'secondary' : 'outline'} onClick={() => setReason('inaccurate')}>Inaccurate</Button>
                     <Button variant={reason === 'off-tone' ? 'secondary' : 'outline'} onClick={() => setReason('off-tone')}>Off-tone</Button>
                     <Button variant={reason === 'irrelevant' ? 'secondary' : 'outline'} onClick={() => setReason('irrelevant')}>Irrelevant</Button>
                     <Button variant={reason === 'other' ? 'secondary' : 'outline'} onClick={() => setReason('other')}>Other</Button>
                  </div>
               </div>
               <div>
                  <label className="text-sm     mb-2 block">Details (optional)</label>
                  <Textarea
                     value={details}
                     onChange={(e) => setDetails(e.target.value)}
                     placeholder="Tell us more..."
                     className="   border-border    "
                  />
               </div>
               <div className="flex justify-end space-x-2">
                  <Button variant="ghost" onClick={() => onOpenChange(false)}>Cancel</Button>
                  <Button onClick={handleSubmit}>Submit Feedback</Button>
               </div>
            </div>
         </DialogContent>
      </Dialog>
   );
}
