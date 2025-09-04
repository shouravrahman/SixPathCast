'use client';

import { useState, useCallback } from 'react';
import {
   Clock,
   Send,
   Edit,
   BarChart3
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import CalendarView from '@/components/schedule/CalendarView';
import PostList from '@/components/schedule/PostList';
import useCalendarStore from '@/hooks/useCalendarStore';
import useMockDataStore from '@/hooks/useMockDataStore';

import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

export default function PlannerView() {
   const { posts, setPosts, updatePostScheduleDate } = useCalendarStore();
   const { platforms } = useMockDataStore();
   const [viewMode, setViewMode] = useState('calendar');
   const [filterPlatform, setFilterPlatform] = useState('all');
   const [searchQuery, setSearchQuery] = useState('');
   const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
   const [selectedPost, setSelectedPost] = useState(null);
   const [selectedDate, setSelectedDate] = useState(new Date());

   const getStatusColor = (status: string) => {
      switch (status) {
         case 'scheduled': return '  ';
         case 'published': return 'bg-green-600';
         case 'draft': return 'bg-yellow-600';
         case 'failed': return 'bg-red-600';
         default: return 'bg-slate-600';
      }
   };

   const getPlatformColor = (platform: string) => {
      const platformData = platforms.find(p => p.name.toLowerCase() === platform.toLowerCase());
      return platformData?.color || 'bg-slate-600';
   };

   // const handleSchedule = (post) => {
   //    setSelectedPost(post);
   //    setIsScheduleModalOpen(true);
   // };

   // const handleConfirmSchedule = (post, scheduleDate) => {
   //    if (post && scheduleDate) {
   //       const existingPost = posts.find(p => p.id === post.id);
   //       let newPosts;
   //       if (existingPost) {
   //          newPosts = posts.map(p => (p.id === post.id ? { ...p, status: 'scheduled', scheduleDate: scheduleDate.toISOString() } : p));
   //       } else {
   //          newPosts = [...posts, { ...post, id: Date.now(), status: 'scheduled', scheduleDate: scheduleDate.toISOString() }];
   //       }
   //       setPosts(newPosts);
   //    }
   // };

   const movePost = useCallback((dragIndex: number, hoverIndex: number) => {
      const dragPost = posts[dragIndex];
      const newPosts = [...posts];
      newPosts.splice(dragIndex, 1);
      newPosts.splice(hoverIndex, 0, dragPost);
      setPosts(newPosts);
   }, [posts, setPosts]);


   const filteredPosts = posts.filter(post => {
      const matchesPlatform = filterPlatform === 'all' || post.platform.toLowerCase() === filterPlatform;
      const matchesSearch = post.content.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesPlatform && matchesSearch;
   });

   const scheduledCount = posts.filter(p => p.status === 'scheduled').length;
   const publishedTodayCount = posts.filter(p => p.status === 'published' && p.scheduleDate && new Date(p.scheduleDate).toDateString() === new Date().toDateString()).length;
   const draftsCount = posts.filter(p => p.status === 'draft').length;

   return (
      <DndProvider backend={HTML5Backend}>
         <div className=" px-4 sm:px-6 lg:px-8 py-4 mx-auto">
            <div className="mb-8">
               <div className="flex items-center justify-between">
                  <div>
                     <h1 className="text-3xl font-bold  mb-2">Content Schedule</h1>
                     <p className="dark:   ">
                        Manage and schedule your content across all platforms
                     </p>
                  </div>
                  {/* <Button className="btn-gradient" onClick={() => handleSchedule({ topic: "New Post", content: 'New Post Content', platform: 'twitter', status: 'draft'})}>
                     <Plus className="h-4 w-4 mr-2" />
                     Schedule Post
                  </Button> */}
               </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
               <Card  >
                  <CardContent className="p-6">
                     <div className="flex items-center justify-between">
                        <div>
                           <p className="text-sm font-medium dark:    text-primary">Scheduled</p>
                           <p className="text-2xl font-bold ">{scheduledCount}</p>
                        </div>
                        <Clock className="h-8 w-8 text-blue-400" />
                     </div>
                  </CardContent>
               </Card>

               <Card  >
                  <CardContent className="p-6">
                     <div className="flex items-center justify-between">
                        <div>
                           <p className="text-sm font-medium dark:    text-primary">Published Today</p>
                           <p className="text-2xl font-bold ">{publishedTodayCount}</p>
                        </div>
                        <Send className="h-8 w-8 text-green-400" />
                     </div>
                  </CardContent>
               </Card>

               <Card  >
                  <CardContent className="p-6">
                     <div className="flex items-center justify-between">
                        <div>
                           <p className="text-sm font-medium dark:    text-primary">Drafts</p>
                           <p className="text-2xl font-bold ">{draftsCount}</p>
                        </div>
                        <Edit className="h-8 w-8 text-yellow-400" />
                     </div>
                  </CardContent>
               </Card>

               <Card  >
                  <CardContent className="p-6">
                     <div className="flex items-center justify-between">
                        <div>
                           <p className="text-sm font-medium dark:    text-primary">Avg Engagement</p>
                           <p className="text-2xl font-bold ">7.8%</p>
                        </div>
                        <BarChart3 className="h-8 w-8 text-purple-400" />
                     </div>
                  </CardContent>
               </Card>
            </div>

            <Tabs value={viewMode} onValueChange={setViewMode}>
               <TabsList className="">
                  <TabsTrigger value="calendar"  >Calendar</TabsTrigger>
                  <TabsTrigger value="list"  >List</TabsTrigger>
               </TabsList>
               <TabsContent value="calendar">
                  <CalendarView posts={filteredPosts} getPlatformColor={getPlatformColor} getStatusColor={getStatusColor} selectedDate={selectedDate} setSelectedDate={setSelectedDate} onDropPost={updatePostScheduleDate} />
               </TabsContent>
               <TabsContent value="list">
                  <PostList posts={filteredPosts} getPlatformColor={getPlatformColor} getStatusColor={getStatusColor} movePost={movePost} />
               </TabsContent>
            </Tabs>

         </div>
      </DndProvider>
   );
}
