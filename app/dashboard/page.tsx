'use client';

import { useState, useEffect } from 'react';
import {
   TrendingUp,
   Users,
   Calendar,
   Zap,
   BarChart3,
   Clock,
   Target,
   Sparkles
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

const stats = [
   { name: 'Total Posts', value: '2,847', change: '+12%', icon: BarChart3 },
   { name: 'Engagement Rate', value: '8.4%', change: '+2.1%', icon: TrendingUp },
   { name: 'Followers Growth', value: '+1,234', change: '+18%', icon: Users },
   { name: 'Scheduled Posts', value: '47', change: '+5', icon: Calendar },
];

const recentPosts = [
   {
      id: 1,
      platform: 'Twitter',
      content: 'Just launched my new AI-powered productivity workflow! 🚀',
      engagement: '234 likes, 45 retweets',
      time: '2 hours ago',
      status: 'published'
   },
   {
      id: 2,
      platform: 'LinkedIn',
      content: 'The future of personal branding lies in authentic AI-assisted content...',
      engagement: '89 likes, 12 comments',
      time: '4 hours ago',
      status: 'published'
   },
   {
      id: 3,
      platform: 'Instagram',
      content: 'Behind the scenes of building my personal brand 📸',
      engagement: '456 likes, 23 comments',
      time: '6 hours ago',
      status: 'scheduled'
   },
];

export default function Dashboard() {
   const [greeting, setGreeting] = useState('');

   useEffect(() => {
      const hour = new Date().getHours();
      if (hour < 12) setGreeting('Good morning');
      else if (hour < 18) setGreeting('Good afternoon');
      else setGreeting('Good evening');
   }, []);

   return (
      <div className="dashboard-page-container">
         <div className="mb-8">
            <h1 className="dashboard-header-title">
               {greeting}, Creator! 👋
            </h1>
            <p className="dashboard-header-description">
               Ready to create amazing content today? Your AI assistant is standing by.
            </p>
         </div>

         {/* Quick Actions */}
         <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <Link href="/dashboard/create">
               <Card className="bg-gradient-to-r from-purple-400 to-blue-400 gradient-card">
                  <CardContent className="p-6">
                     <div className="flex items-center space-x-3">
                        <Sparkles className="h-8 w-8 text-white" />
                        <div>
                           <h3 className="text-lg font-semibold text-white">Create Content</h3>
                           <p className="text-blue-100">AI-powered content generation</p>
                        </div>
                     </div>
                  </CardContent>
               </Card>
            </Link>

            <Link href="/dashboard/brainstorm">
               <Card className="bg-gradient-to-r from-emerald-400 to-teal-400 gradient-card">
                  <CardContent className="p-6">
                     <div className="flex items-center space-x-3">
                        <Zap className="h-8 w-8 text-white" />
                        <div>
                           <h3 className="text-lg font-semibold text-white">AI Brainstorm</h3>
                           <p className="text-teal-100">Generate fresh ideas</p>
                        </div>
                     </div>
                  </CardContent>
               </Card>
            </Link>

            <Link href="/dashboard/analytics">
               <Card className="bg-gradient-to-r from-orange-400 to-red-400 gradient-card">
                  <CardContent className="p-6">
                     <div className="flex items-center space-x-3">
                        <Target className="h-8 w-8 text-white" />
                        <div>
                           <h3 className="text-lg font-semibold text-white">View Analytics</h3>
                           <p className="text-red-100">Track your performance</p>
                        </div>
                     </div>
                  </CardContent>
               </Card>
            </Link>
         </div>
         {/* Stats Grid */}
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat) => (
               <Card key={stat.name}  >
                  <CardContent className="p-6">
                     <div className="flex items-center justify-between">
                        <div>
                           <p className="text-sm font-medium dark:    text-muted-foreground">{stat.name}</p>
                           <p className="text-2xl font-bold ">{stat.value}</p>
                           <p className="text-sm text-purple-700 dark:text-orange-600">{stat.change}</p>
                        </div>
                        <stat.icon className="h-8 w-8 text-purple-400" />
                     </div>
                  </CardContent>
               </Card>
            ))}
         </div>

         {/* Recent Activity */}
         <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card  >
               <CardHeader>
                  <CardTitle className="">Recent Posts</CardTitle>
                  <CardDescription>Your latest content across all platforms</CardDescription>
               </CardHeader>
               <CardContent>
                  <div className="space-y-4">
                     {recentPosts.map((post) => (
                        <div key={post.id} className="flex items-start space-x-3 p-3 rounded-lg dark: /30 ">
                           <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-1">
                                 <span className="text-sm font-medium dark:text-purple-400">{post.platform}</span>
                                 <span className={`px-2 py-1 text-xs rounded-full ${post.status === 'published'
                                    ? 'bg-green-600 text-green-100'
                                    : 'bg-yellow-600 text-yellow-100'
                                    }`}>
                                    {post.status}
                                 </span>
                              </div>
                              <p className="text-sm  mb-2">{post.content}</p>
                              <div className="flex items-center justify-between text-xs font-semibold ">
                                 <span>{post.engagement}</span>
                                 <span>{post.time}</span>
                              </div>
                           </div>
                        </div>
                     ))}
                  </div>
               </CardContent>
            </Card>

            <Card  >
               <CardHeader>
                  <CardTitle  >AI Insights</CardTitle>
                  <CardDescription>Personalized recommendations for your brand</CardDescription>
               </CardHeader>
               <CardContent>
                  <div className="space-y-4">
                     <div className="p-4 rounded-lg     border border-purple-500/30">
                        <h4 className="font-medium dark:text-purple-300 mb-2">Content Strategy Tip</h4>
                        <p className="text-sm ">
                           Your engagement is 23% higher on posts with questions. Try adding more interactive elements to your content.
                        </p>
                     </div>
                     <div className="p-4 rounded-lg    border   ">
                        <h4 className="font-medium dark:  mb-2">Optimal Posting Time</h4>
                        <p className="text-sm ">
                           Your audience is most active on Tuesday at 2 PM. Schedule your next important post then.
                        </p>
                     </div>
                     <div className="p-4 rounded-lg bg-emerald-600/20 border border-emerald-500/30">
                        <h4 className="font-medium dark:text-emerald-300 mb-2">Trending Topic</h4>
                        <p className="text-sm ">
                           "AI productivity tools" is trending in your niche. Consider creating content around this topic.
                        </p>
                     </div>
                  </div>
               </CardContent>
            </Card>
         </div>
      </div>
   );
}
