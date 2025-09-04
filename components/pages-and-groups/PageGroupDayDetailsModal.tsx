'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";

export function PageGroupDayDetailsModal({ open, onOpenChange, posts, selectedDate }) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Posts for {selectedDate.toLocaleDateString()}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {posts.map(post => (
            <div key={post.id} className="p-3 rounded-lg border">
              <p>{post.content}</p>
              <Badge variant="outline" className="mt-2">{post.platform}</Badge>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}