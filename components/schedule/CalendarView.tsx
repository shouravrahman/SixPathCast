'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import DayDetailsModal from './DayDetailsModal';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useDrop } from 'react-dnd';

const ItemTypes = {
   POST: 'post',
};

export default function CalendarView({ posts, getPlatformColor, getStatusColor, selectedDate, setSelectedDate, onDropPost }) {
   const [currentDate, setCurrentDate] = useState(new Date());
   const [isModalOpen, setIsModalOpen] = useState(false);

   const handleDayClick = (day) => {
      setSelectedDate(day);
      const postsForDay = posts.filter(post => post.scheduleDate && new Date(post.scheduleDate).toDateString() === day.toDateString());
      if (postsForDay.length > 0) {
         setIsModalOpen(true);
      }
   };

   const changeMonth = (offset) => {
      setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() + offset, 1));
   }

   const renderCalendar = () => {
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth();
      const firstDayOfMonth = new Date(year, month, 1);
      const lastDayOfMonth = new Date(year, month + 1, 0);
      const daysInMonth = lastDayOfMonth.getDate();
      const startDayOfWeek = firstDayOfMonth.getDay();
      const lastDayOfPrevMonth = new Date(year, month, 0).getDate();

      const calendarDays = [];

      // Add days from previous month
      for (let i = startDayOfWeek - 1; i >= 0; i--) {
         calendarDays.push(
            <div key={`prev-${i}`} className="border border-border p-2 dark:text-muted-foreground   ">
               {lastDayOfPrevMonth - i}
            </div>
         );
      }

      // Add cells for each day of the month
      for (let day = 1; day <= daysInMonth; day++) {
         const date = new Date(year, month, day);
         const postsForDay = posts.filter(post => post.scheduleDate && new Date(post.scheduleDate).toDateString() === date.toDateString());

         const [{ isOver }, drop] = useDrop({
            accept: ItemTypes.POST,
            drop: (item, monitor) => {
               onDropPost(item.id, date);
            },
            collect: (monitor) => ({
               isOver: monitor.isOver(),
            }),
         });

         calendarDays.push(
            <div
               key={day}
               ref={drop}
               className={`border border-border p-2 cursor-pointer hover: /50 flex flex-col ${isOver ? ' ' : ''}`}
               onClick={() => handleDayClick(date)}
            >
               <div className=" font-bold">{day}</div>
               <div className="flex-grow overflow-y-auto mt-1 space-y-1">
                  {postsForDay.map(post => (
                     <Badge key={post.id} className={`${getPlatformColor(post.platform)}  text-xs truncate`}>
                        {post.topic || post.content.substring(0, 20)}
                     </Badge>
                  ))}
               </div>
            </div>
         );
      }

      // Add days from next month
      const totalCells = startDayOfWeek + daysInMonth;
      const remainingCells = (totalCells % 7 === 0) ? 0 : 7 - (totalCells % 7);
      for (let i = 1; i <= remainingCells; i++) {
         calendarDays.push(
            <div key={`next-${i}`} className="border border-border p-2 dark:text-muted-foreground   ">
               {i}
            </div>
         );
      }

      return calendarDays;
   };

   return (
      <>
         <Card  >
            <CardHeader className="flex flex-row items-center justify-between">
               <CardTitle  >
                  {currentDate.toLocaleString('default', { month: 'long' })} {currentDate.getFullYear()}
               </CardTitle>
               <div className="flex space-x-2">
                  <Button variant="outline" size="sm" onClick={() => changeMonth(-1)} ><ChevronLeft className="h-4 w-4" /></Button>
                  <Button variant="outline" size="sm" onClick={() => changeMonth(1)} ><ChevronRight className="h-4 w-4" /></Button>
               </div>
            </CardHeader>
            <CardContent className="p-2">
               <div className="grid grid-cols-7 text-center     mb-2 font-semibold text-sm">
                  <div className="py-2">Sun</div>
                  <div className="py-2">Mon</div>
                  <div className="py-2">Tue</div>
                  <div className="py-2">Wed</div>
                  <div className="py-2">Thu</div>
                  <div className="py-2">Fri</div>
                  <div className="py-2">Sat</div>
               </div>
               <div className="grid grid-cols-7 gap-1">
                  {renderCalendar()}
               </div>
            </CardContent>
         </Card>
         <DayDetailsModal
            open={isModalOpen}
            onOpenChange={setIsModalOpen}
            posts={posts.filter(post => post.scheduleDate && new Date(post.scheduleDate).toDateString() === selectedDate.toDateString())}
            selectedDate={selectedDate}
            getPlatformColor={getPlatformColor}
            getStatusColor={getStatusColor}
         />
      </>
   );
}
