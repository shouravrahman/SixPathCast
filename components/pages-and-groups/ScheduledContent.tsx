'use client';

import { useState } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import CalendarView from '@/components/schedule/CalendarView';
import useCalendarStore from '@/hooks/useCalendarStore';
import useMockDataStore from '@/hooks/useMockDataStore';

export function ScheduledContent() {
   const { posts, updatePostScheduleDate } = useCalendarStore();
   const { platforms } = useMockDataStore();
   const [selectedDate, setSelectedDate] = useState(new Date());

   const getPlatformColor = (platform: string) => {
      const platformData = platforms.find(p => p.name.toLowerCase() === platform.toLowerCase());
      return platformData?.color || 'bg-slate-600';
   };

   const getStatusColor = (status: string) => {
      switch (status) {
         case 'scheduled': return '  ';
         case 'published': return 'bg-green-600';
         case 'draft': return 'bg-yellow-600';
         case 'failed': return 'bg-red-600';
         default: return 'bg-slate-600';
      }
   };

   return (
      <DndProvider backend={HTML5Backend}>
         <CalendarView
            posts={posts}
            getPlatformColor={getPlatformColor}
            getStatusColor={getStatusColor}
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
            onDropPost={updatePostScheduleDate}
         />
      </DndProvider>
   );
}
