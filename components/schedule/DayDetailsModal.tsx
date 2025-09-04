'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Edit, Trash2, Pause, Play } from 'lucide-react';
import { useDrag } from 'react-dnd';

const ItemTypes = {
   POST: 'post',
};

function DraggablePostInModal({ post, getPlatformColor, getStatusColor }) {
   const [{ isDragging }, drag] = useDrag(() => ({
      type: ItemTypes.POST,
      item: { id: post.id, originalDate: post.scheduleDate },
      collect: (monitor) => ({
         isDragging: monitor.isDragging(),
      }),
   }));

   const opacity = isDragging ? 0.4 : 1;

   return (
      <div ref={drag} style={{ opacity }} className="flex items-start space-x-4 p-4 rounded-lg dark: /50 border border-border">
         <div className={`w-10 h-10 rounded-lg ${getPlatformColor(post.platform)} flex items-center justify-center font-bold text-xl`}>
            {post.platform.substring(0, 1).toUpperCase()}
         </div>
         <div className="flex-1">
            <div className="flex items-center justify-between mb-2">
               <div className="flex items-center space-x-2">
                  <span className="font-semibold">{post.topic || 'Post'}</span>
                  <Badge variant={post.status === 'published' ? 'success' : (post.status === 'scheduled' ? 'default' : 'secondary')}>
                     {post.status}
                  </Badge>
               </div>
               <span className="text-sm    ">
                  {new Date(post.scheduleDate).toLocaleTimeString('en-US', {
                     hour: '2-digit',
                     minute: '2-digit'
                  })}
               </span>
            </div>
            <p className="text-sm     mb-3">{post.content}</p>
            <div className="flex items-center justify-end">
               <div className="flex space-x-1">
                  <Button size="sm" variant="ghost">
                     <Edit className="h-4 w-4 mr-1" /> Edit
                  </Button>
                  {post.status === 'scheduled' && (
                     <Button size="sm" variant="ghost">
                        <Pause className="h-4 w-4 mr-1" /> Pause
                     </Button>
                  )}
                  {post.status === 'draft' && (
                     <Button size="sm" variant="ghost">
                        <Play className="h-4 w-4 mr-1" /> Schedule
                     </Button>
                  )}
                  <Button size="sm" variant="ghost" className="text-red-500 hover:text-red-400">
                     <Trash2 className="h-4 w-4 mr-1" /> Delete
                  </Button>
               </div>
            </div>
         </div>
      </div>
   );
}

export default function DayDetailsModal({ open, onOpenChange, posts, selectedDate, getPlatformColor, getStatusColor }) {
   if (!open) {
      return null;
   }

   return (
      <Dialog open={open} onOpenChange={onOpenChange}>
         <DialogContent className="  border-border max-w-4xl ">
            <DialogHeader>
               <DialogTitle>
                  Posts for {selectedDate.toLocaleDateString('en-US', {
                     weekday: 'long',
                     year: 'numeric',
                     month: 'long',
                     day: 'numeric'
                  })}
               </DialogTitle>
            </DialogHeader>
            <div className="h-[60vh] overflow-y-auto p-1">
               <div className="space-y-4">
                  {posts.map((post) => (
                     <DraggablePostInModal
                        key={post.id}
                        post={post}
                        getPlatformColor={getPlatformColor}
                        getStatusColor={getStatusColor}
                     />
                  ))}
               </div>
            </div>
         </DialogContent>
      </Dialog>
   );
}
