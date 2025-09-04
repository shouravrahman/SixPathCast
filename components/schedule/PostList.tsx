'use client';

import { useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Edit, Trash2, Pause } from 'lucide-react';
import { useDrag, useDrop } from 'react-dnd';

const ItemTypes = {
   POST: 'post',
};

function DraggablePost({ post, index, movePost, getPlatformColor, getStatusColor }) {
   const ref = useRef(null);
   const [{ handlerId }, drop] = useDrop({
      accept: ItemTypes.POST,
      collect(monitor) {
         return {
            handlerId: monitor.getHandlerId(),
         };
      },
      hover(item, monitor) {
         if (!ref.current) {
            return;
         }
         const dragIndex = item.index;
         const hoverIndex = index;

         // Don't replace items with themselves
         if (dragIndex === hoverIndex) {
            return;
         }

         // Determine rectangle on screen
         const hoverBoundingRect = ref.current?.getBoundingClientRect();

         // Get vertical middle
         const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;

         // Determine mouse position
         const clientOffset = monitor.getClientOffset();

         // Get pixels to the top
         const hoverClientY = clientOffset.y - hoverBoundingRect.top;

         // Only perform the move when the mouse has crossed half of the items height
         // When dragging downwards, only move when the cursor is below 50%
         // When dragging upwards, only move when the cursor is above 50%

         // Dragging downwards
         if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
            return;
         }

         // Dragging upwards
         if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
            return;
         }

         // Time to actually perform the action
         movePost(dragIndex, hoverIndex);

         // Note: we're mutating the monitor item here!
         // Generally it's better to avoid mutations in render functions,
         // but it's good here for the sake of performance to avoid re-renders
         // when the item is just hovering over an already sorted item
         item.index = hoverIndex;
      },
   });

   const [{ isDragging }, drag] = useDrag({
      type: ItemTypes.POST,
      item: () => ({ id: post.id, index }),
      collect: (monitor) => ({
         isDragging: monitor.isDragging(),
      }),
   });

   drag(drop(ref));

   const opacity = isDragging ? 0 : 1;

   return (
      <div ref={ref} style={{ opacity }} className="flex items-start space-x-4 p-4 rounded-lg  " data-handler-id={handlerId}>
         <div className={`w-3 h-3 rounded-full ${getPlatformColor(post.platform)} mt-2`}></div>
         <div className="flex-1">
            <div className="flex items-center justify-between mb-2">
               <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium    ">{post.platform}</span>
                  <Badge className={getStatusColor(post.status)}>
                     {post.status}
                  </Badge>
               </div>
               <span className="text-sm    ">
                  {post.scheduleDate ? (
                     <>
                        {new Date(post.scheduleDate).toLocaleDateString()} at{' '}
                        {new Date(post.scheduleDate).toLocaleTimeString('en-US', {
                           hour: '2-digit',
                           minute: '2-digit'
                        })}
                     </>
                  ) : (
                     'Not Scheduled'
                  )}
               </span>
            </div>
            <p className="text-sm text-muted-foreground mb-2">{post.content}</p>
            <div className="flex items-center justify-end">
               <div className="flex space-x-1">
                  <Button size="sm" variant="ghost">
                     <Edit className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="ghost">
                     <Pause className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="ghost" className="text-red-400">
                     <Trash2 className="h-4 w-4" />
                  </Button>
               </div>
            </div>
         </div>
      </div>
   );
}

export default function PostList({ posts, getPlatformColor, getStatusColor, movePost }) {
   return (
      <Card  >
         <CardHeader>
            <CardTitle  >All Scheduled Posts</CardTitle>
            <CardDescription>Complete list of your scheduled content</CardDescription>
         </CardHeader>
         <CardContent>
            <div className="space-y-4">
               {posts
                  .map((post, i) => (
                     <DraggablePost
                        key={post.id}
                        index={i}
                        post={post}
                        movePost={movePost}
                        getPlatformColor={getPlatformColor}
                        getStatusColor={getStatusColor}
                     />
                  ))}
            </div>
         </CardContent>
      </Card>
   );
}
