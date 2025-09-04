'use client';

import { useState, useEffect } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import CalendarView from '@/components/schedule/CalendarView';
import { posts as mockPosts, platforms } from '@/data/mockData'; // Import mockPosts and platforms

export default function ScheduleDialog({ open, onOpenChange, post, onConfirmSchedule }) {
   const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
   const [selectedHour, setSelectedHour] = useState('10');
   const [selectedMinute, setSelectedMinute] = useState('00');

   // Dummy posts and platform data for CalendarView - will be replaced by actual data from parent
   const dummyPosts = mockPosts;
   const getPlatformColor = (platform) => {
      const platformData = platforms.find(p => p.name.toLowerCase() === platform.toLowerCase());
      return platformData?.color || 'bg-slate-600';
   };
   const getStatusColor = (status) => {
      switch (status) {
         case 'scheduled': return '  ';
         case 'published': return 'bg-green-600';
         case 'draft': return 'bg-yellow-600';
         case 'failed': return 'bg-red-600';
         default: return 'bg-slate-600';
      }
   };

   useEffect(() => {
      if (post?.scheduleDate) {
         const date = new Date(post.scheduleDate);
         setSelectedDate(date);
         setSelectedHour(date.getHours().toString().padStart(2, '0'));
         setSelectedMinute(date.getMinutes().toString().padStart(2, '0'));
      } else {
         setSelectedDate(new Date());
         setSelectedHour('10');
         setSelectedMinute('00');
      }
   }, [post]);

   const handleConfirm = () => {
      if (selectedDate && selectedHour && selectedMinute) {
         const newScheduleDate = new Date(selectedDate);
         newScheduleDate.setHours(parseInt(selectedHour), parseInt(selectedMinute));
         onConfirmSchedule(post, newScheduleDate);
         onOpenChange(false);
      }
   };

   const hours = Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, '0'));
   const minutes = Array.from({ length: 60 }, (_, i) => i.toString().padStart(2, '0'));

   return (
      <Dialog open={open} onOpenChange={onOpenChange}>
         <DndProvider backend={HTML5Backend}>
            <DialogContent className="  max-w-3xl">
               <DialogHeader>
                  <DialogTitle  >Schedule Post</DialogTitle>
               </DialogHeader>
               <div className="py-4">
                  {post && (
                     <div className="mb-4 p-4 rounded-lg   w-full">
                        <p className="font-semibold     overflow-hidden text-ellipsis whitespace-nowrap">{post.topic || "New Post"}</p>
                        <p className="text-sm     mt-1 overflow-hidden text-ellipsis ">{post.content}</p>
                     </div>
                  )}
                  <div className="flex flex-col gap-4">
                     <div className="w-full">
                        <CalendarView
                           posts={dummyPosts} // Pass dummy posts for now
                           getPlatformColor={getPlatformColor}
                           getStatusColor={getStatusColor}
                           selectedDate={selectedDate}
                           setSelectedDate={setSelectedDate}
                        />
                     </div>
                     <div className="w-full flex flex-col justify-center space-y-4">
                        <h4 className="font-semibold text-center    ">Select Time</h4>
                        <div className="flex space-x-2">
                           <Select value={selectedHour} onValueChange={setSelectedHour}>
                              <SelectTrigger className="w-[80px]   border-border    ">
                                 <SelectValue placeholder="HH" />
                              </SelectTrigger>
                              <SelectContent className="  border-border    ">
                                 {hours.map(hour => <SelectItem key={hour} value={hour}>{hour}</SelectItem>)}
                              </SelectContent>
                           </Select>
                           <span  >:</span>
                           <Select value={selectedMinute} onValueChange={setSelectedMinute}>
                              <SelectTrigger className="w-[80px]   border-border    ">
                                 <SelectValue placeholder="MM" />
                              </SelectTrigger>
                              <SelectContent className="  border-border    ">
                                 {minutes.map(minute => <SelectItem key={minute} value={minute}>{minute}</SelectItem>)}
                              </SelectContent>
                           </Select>
                        </div>
                     </div>
                  </div>
               </div>
               <div className="flex justify-end space-x-2">
                  <Button variant="ghost" onClick={() => onOpenChange(false)} className="   ">Cancel</Button>
                  <Button onClick={handleConfirm} className="btn-gradient    ">Confirm Schedule</Button>
               </div>
            </DialogContent>
         </DndProvider>
      </Dialog>
   );
}
