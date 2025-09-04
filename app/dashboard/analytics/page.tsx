'use client';

import { useState } from 'react';
import {
   TrendingUp,
   TrendingDown,
   Users,
   Heart,
   MessageCircle,
   Share,
   Eye,
   BarChart3,
   Calendar,
   Download,
   Filter
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import {
   LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import {
   Select,
   SelectContent,
   SelectItem,
   SelectTrigger,
   SelectValue,
} from "@/components/ui/select"
const analyticsData = {
   overview: {
      totalFollowers: 12847,
      followerGrowth: 8.2,
      totalEngagement: 45632,
      engagementRate: 7.4,
      totalReach: 156789,
      reachGrowth: 12.5,
      totalPosts: 89,
      avgEngagement: 512
   },
   platforms: [
      {
         name: 'Twitter',
         followers: 5420,
         growth: 12.3,
         engagement: 8.9,
         posts: 34,
         topPost: 'AI productivity thread got 2.4K likes',
         color: '  '
      },
      {
         name: 'LinkedIn',
         followers: 3890,
         growth: 15.7,
         engagement: 6.2,
         posts: 18,
         topPost: 'Personal branding article - 890 reactions',
         color: 'bg-blue-700'
      },
      {
         name: 'Instagram',
         followers: 2847,
         growth: 5.4,
         engagement: 9.1,
         posts: 25,
         topPost: 'Behind the scenes reel - 1.2K likes',
         color: 'bg-pink-500'
      },
      {
         name: 'YouTube',
         followers: 690,
         growth: 23.1,
         engagement: 12.4,
         posts: 12,
         topPost: 'AI tools review - 45K views',
         color: 'bg-red-600'
      }
   ],
   topPosts: [
      {
         id: 1,
         platform: 'Twitter',
         content: '🧵 Thread: 10 AI tools that will make you 10x more productive...',
         engagement: 2847,
         likes: 1923,
         comments: 234,
         shares: 690,
         date: '2024-01-15',
         performance: 'excellent'
      },
      {
         id: 2,
         platform: 'LinkedIn',
         content: 'The future of personal branding in the AI era...',
         engagement: 1456,
         likes: 890,
         comments: 123,
         shares: 443,
         date: '2024-01-12',
         performance: 'good'
      },
      {
         id: 3,
         platform: 'Instagram',
         content: 'Behind the scenes of my morning routine 📸',
         engagement: 1234,
         likes: 1100,
         comments: 89,
         shares: 45,
         date: '2024-01-10',
         performance: 'good'
      }
   ],
   insights: [
      {
         type: 'best_time',
         title: 'Optimal Posting Time',
         description: 'Your audience is most active on Tuesday at 2:00 PM',
         impact: 'high',
         action: 'Schedule more content during this time'
      },
      {
         type: 'content_type',
         title: 'Top Performing Content',
         description: 'Educational threads perform 34% better than other content',
         impact: 'high',
         action: 'Create more educational thread content'
      },
      {
         type: 'hashtag',
         title: 'Hashtag Performance',
         description: '#AI and #Productivity hashtags drive 45% more engagement',
         impact: 'medium',
         action: 'Include these hashtags in relevant posts'
      },
      {
         type: 'engagement',
         title: 'Engagement Pattern',
         description: 'Posts with questions get 23% more comments',
         impact: 'medium',
         action: 'Add more interactive elements to posts'
      }
   ],
   // Mock data for charts
   chartData: {
      '7d': [
         { name: 'Day 1', followers: 100, engagement: 50 },
         { name: 'Day 2', followers: 120, engagement: 55 },
         { name: 'Day 3', followers: 150, engagement: 60 },
         { name: 'Day 4', followers: 130, engagement: 58 },
         { name: 'Day 5', followers: 170, engagement: 65 },
         { name: 'Day 6', followers: 190, engagement: 70 },
         { name: 'Day 7', followers: 220, engagement: 75 },
      ],
      '30d': [
         { name: 'Week 1', followers: 500, engagement: 200 },
         { name: 'Week 2', followers: 600, engagement: 220 },
         { name: 'Week 3', followers: 750, engagement: 250 },
         { name: 'Week 4', followers: 900, engagement: 280 },
      ],
      '90d': [
         { name: 'Month 1', followers: 1000, engagement: 400 },
         { name: 'Month 2', followers: 1200, engagement: 450 },
         { name: 'Month 3', followers: 1500, engagement: 500 },
      ],
      '1y': [
         { name: 'Q1', followers: 2000, engagement: 800 },
         { name: 'Q2', followers: 2500, engagement: 900 },
         { name: 'Q3', followers: 3000, engagement: 1000 },
         { name: 'Q4', followers: 3500, engagement: 1200 },
      ],
   },
};

export default function Analytics() {
   const [selectedPeriod, setSelectedPeriod] = useState('30d');
   const [selectedPlatform, setSelectedPlatform] = useState('all');

   const getPerformanceBadge = (performance: string) => {
      switch (performance) {
         case 'excellent':
            return <Badge className="bg-green-600">Excellent</Badge>;
         case 'good':
            return <Badge className="  ">Good</Badge>;
         case 'average':
            return <Badge className="bg-yellow-600">Average</Badge>;
         default:
            return <Badge variant="secondary">Unknown</Badge>;
      }
   };

   const getImpactColor = (impact: string) => {
      switch (impact) {
         case 'high':
            return 'border-l-red-500';
         case 'medium':
            return 'border-l-yellow-500';
         case 'low':
            return 'border-l-green-500';
         default:
            return 'border-l-slate-500';
      }
   };

   const currentChartData = analyticsData.chartData[selectedPeriod];

   return (
      <div className="dashboard-page-container">
         <div className="mb-8">
            <div className="flex items-center justify-between">
               <div>
                  <h1 className="dashboard-header-title">Analytics</h1>
                  <p className="dashboard-header-description">
                     Track your performance and discover insights to grow your personal brand
                  </p>
               </div>
               <div className="flex items-center space-x-3">
                  <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                     <SelectTrigger>
                        <SelectValue placeholder="Select period" />
                     </SelectTrigger>
                     <SelectContent>
                        <SelectItem value="7d">Last 7 days</SelectItem>
                        <SelectItem value="30d">Last 30 days</SelectItem>
                        <SelectItem value="90d">Last 90 days</SelectItem>
                        <SelectItem value="1y">Last year</SelectItem>
                     </SelectContent>
                  </Select>
                  <Select value={selectedPlatform} onValueChange={setSelectedPlatform}>
                     <SelectTrigger>
                        <SelectValue placeholder="Select platform" />
                     </SelectTrigger>
                     <SelectContent>
                        <SelectItem value="all">All Platforms</SelectItem>
                        {analyticsData.platforms.map((p) => (
                           <SelectItem key={p.name} value={p.name.toLowerCase()}>
                              {p.name}
                           </SelectItem>
                        ))}
                     </SelectContent>
                  </Select>
                  <Button variant="outline" >
                     <Download className="h-4 w-4 mr-2" />
                     Export
                  </Button>
               </div>
            </div>
         </div>

         {/* Overview Stats */}
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card  >
               <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                     <div>
                        <p className="text-sm font-medium    ">Total Followers</p>
                        <p className="text-2xl font-bold ">{analyticsData.overview.totalFollowers.toLocaleString()}</p>
                        <div className="flex items-center mt-1">
                           <TrendingUp className="h-4 w-4 text-green-400 mr-1" />
                           <span className="text-sm text-green-400">+{analyticsData.overview.followerGrowth}%</span>
                        </div>
                     </div>
                     <Users className="h-8 w-8 text-purple-400" />
                  </div>
               </CardContent>
            </Card>

            <Card  >
               <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                     <div>
                        <p className="text-sm font-medium    ">Engagement Rate</p>
                        <p className="text-2xl font-bold ">{analyticsData.overview.engagementRate}%</p>
                        <div className="flex items-center mt-1">
                           <TrendingUp className="h-4 w-4 text-green-400 mr-1" />
                           <span className="text-sm text-green-400">+2.1%</span>
                        </div>
                     </div>
                     <Heart className="h-8 w-8 text-red-400" />
                  </div>
               </CardContent>
            </Card>

            <Card  >
               <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                     <div>
                        <p className="text-sm font-medium    ">Total Reach</p>
                        <p className="text-2xl font-bold ">{analyticsData.overview.totalReach.toLocaleString()}</p>
                        <div className="flex items-center mt-1">
                           <TrendingUp className="h-4 w-4 text-green-400 mr-1" />
                           <span className="text-sm text-green-400">+{analyticsData.overview.reachGrowth}%</span>
                        </div>
                     </div>
                     <Eye className="h-8 w-8 text-blue-400" />
                  </div>
               </CardContent>
            </Card>

            <Card  >
               <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                     <div>
                        <p className="text-sm font-medium    ">Avg Engagement</p>
                        <p className="text-2xl font-bold ">{analyticsData.overview.avgEngagement}</p>
                        <div className="flex items-center mt-1">
                           <TrendingUp className="h-4 w-4 text-green-400 mr-1" />
                           <span className="text-sm text-green-400">+15.3%</span>
                        </div>
                     </div>
                     <BarChart3 className="h-8 w-8 text-emerald-400" />
                  </div>
               </CardContent>
            </Card>
         </div>

         {/* Charts Section */}
         <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <Card  >
               <CardHeader>
                  <CardTitle  >Follower Growth</CardTitle>
                  <CardDescription>Your follower count over time</CardDescription>
               </CardHeader>
               <CardContent className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                     <LineChart data={currentChartData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
                        <XAxis dataKey="name" stroke="#94a3b8" />
                        <YAxis stroke="#94a3b8" />
                        <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569' }} itemStyle={{ color: '#e2e8f0' }} />
                        <Legend />
                        <Line type="monotone" dataKey="followers" stroke="#8b5cf6" activeDot={{ r: 8 }} />
                     </LineChart>
                  </ResponsiveContainer>
               </CardContent>
            </Card>

            <Card  >
               <CardHeader>
                  <CardTitle  >Engagement Trend</CardTitle>
                  <CardDescription>Your engagement rate over time</CardDescription>
               </CardHeader>
               <CardContent className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                     <LineChart data={currentChartData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
                        <XAxis dataKey="name" stroke="#94a3b8" />
                        <YAxis stroke="#94a3b8" />
                        <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569' }} itemStyle={{ color: '#e2e8f0' }} />
                        <Legend />
                        <Line type="monotone" dataKey="engagement" stroke="#ef4444" activeDot={{ r: 8 }} />
                     </LineChart>
                  </ResponsiveContainer>
               </CardContent>
            </Card>
         </div>

         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Platform Performance */}
            <div className="lg:col-span-2 space-y-6">
               <Card  >
                  <CardHeader>
                     <CardTitle  >Platform Performance</CardTitle>
                     <CardDescription>Compare your performance across different platforms</CardDescription>
                  </CardHeader>
                  <CardContent>
                     <div className="space-y-4">
                        {analyticsData.platforms.map((platform) => (
                           <div key={platform.name} className="flex items-center justify-between p-4 rounded-lg dark: /30  /30 hover: /50 transition-colors">
                              <div className="flex items-center space-x-4">
                                 <div className={`w-4 h-4 rounded-full ${platform.color}`}></div>
                                 <div>
                                    <h3 className="text-sm font-medium ">{platform.name}</h3>
                                    <p className="text-xs    ">{platform.topPost}</p>
                                 </div>
                              </div>
                              <div className="text-right">
                                 <div className="flex items-center space-x-4 text-sm">
                                    <div>
                                       <span className=" font-medium">{platform.followers.toLocaleString()}</span>
                                       <p className="text-xs    ">followers</p>
                                    </div>
                                    <div>
                                       <span className=" font-medium">{platform.engagement}%</span>
                                       <p className="text-xs    ">engagement</p>
                                    </div>
                                    <div className="flex items-center">
                                       <TrendingUp className="h-4 w-4 text-green-400 mr-1" />
                                       <span className="text-sm text-green-400">+{platform.growth}%</span>
                                    </div>
                                 </div>
                              </div>
                           </div>
                        ))}
                     </div>
                  </CardContent>
               </Card>

               {/* Top Posts */}
               <Card  >
                  <CardHeader>
                     <CardTitle  >Top Performing Posts</CardTitle>
                     <CardDescription>Your best content from the selected period</CardDescription>
                  </CardHeader>
                  <CardContent>
                     <div className="space-y-4">
                        {analyticsData.topPosts.map((post) => (
                           <div key={post.id} className="p-4 rounded-lg dark: /30  /30 hover: /50 transition-colors">
                              <div className="flex items-start justify-between mb-3">
                                 <div className="flex items-center space-x-2">
                                    <span className="text-sm font-medium text-purple-400">{post.platform}</span>
                                    {getPerformanceBadge(post.performance)}
                                 </div>
                                 <span className="text-xs    ">{post.date}</span>
                              </div>
                              <p className="text-sm  mb-3">{post.content}</p>
                              <div className="grid grid-cols-4 gap-4 text-center">
                                 <div>
                                    <div className="flex items-center justify-center mb-1">
                                       <Heart className="h-4 w-4 text-red-400 mr-1" />
                                       <span className="text-sm font-medium ">{post.likes}</span>
                                    </div>
                                    <p className="text-xs    ">Likes</p>
                                 </div>
                                 <div>
                                    <div className="flex items-center justify-center mb-1">
                                       <MessageCircle className="h-4 w-4 text-blue-400 mr-1" />
                                       <span className="text-sm font-medium ">{post.comments}</span>
                                    </div>
                                    <p className="text-xs    ">Comments</p>
                                 </div>
                                 <div>
                                    <div className="flex items-center justify-center mb-1">
                                       <Share className="h-4 w-4 text-green-400 mr-1" />
                                       <span className="text-sm font-medium ">{post.shares}</span>
                                    </div>
                                    <p className="text-xs    ">Shares</p>
                                 </div>
                                 <div>
                                    <div className="flex items-center justify-center mb-1">
                                       <BarChart3 className="h-4 w-4 text-purple-400 mr-1" />
                                       <span className="text-sm font-medium ">{post.engagement}</span>
                                    </div>
                                    <p className="text-xs    ">Total</p>
                                 </div>
                              </div>
                           </div>
                        ))}
                     </div>
                  </CardContent>
               </Card>
            </div>

            {/* AI Insights */}
            <div className="space-y-6">
               <Card  >
                  <CardHeader>
                     <CardTitle  >AI Insights</CardTitle>
                     <CardDescription>Personalized recommendations to improve your performance</CardDescription>
                  </CardHeader>
                  <CardContent>
                     <div className="space-y-4">
                        {analyticsData.insights.map((insight, index) => (
                           <div key={index} className={`p-4 rounded-lg   border-l-4 ${getImpactColor(insight.impact)}`}>
                              <h4 className="font-medium  mb-2">{insight.title}</h4>
                              <p className="text-sm text-muted-foreground mb-3">{insight.description}</p>
                              <div className="flex items-center justify-between">
                                 <Badge variant="outline" className={`text-xs ${insight.impact === 'high' ? 'border-red-500 text-red-400' :
                                    insight.impact === 'medium' ? 'border-yellow-500 text-yellow-400' :
                                       'border-green-500 text-green-400'
                                    }`}>
                                    {insight.impact} impact
                                 </Badge>
                                 <Button size="sm" variant="ghost" className="text-purple-400 hover:text-purple-300">
                                    Apply
                                 </Button>
                              </div>
                              <p className="text-xs     mt-2">{insight.action}</p>
                           </div>
                        ))}
                     </div>
                  </CardContent>
               </Card>

               {/* Growth Trends */}
               <Card  >
                  <CardHeader>
                     <CardTitle  >Growth Trends</CardTitle>
                     <CardDescription>Track your progress over time</CardDescription>
                  </CardHeader>
                  <CardContent>
                     <div className="space-y-4">
                        <div className="flex items-center justify-between p-3 rounded-lg  ">
                           <div>
                              <p className="text-sm font-medium ">Follower Growth</p>
                              <p className="text-xs    ">This month</p>
                           </div>
                           <div className="text-right">
                              <div className="flex items-center">
                                 <TrendingUp className="h-4 w-4 text-green-400 mr-1" />
                                 <span className="text-sm font-medium text-green-400">+12.3%</span>
                              </div>
                           </div>
                        </div>

                        <div className="flex items-center justify-between p-3 rounded-lg  ">
                           <div>
                              <p className="text-sm font-medium ">Engagement Rate</p>
                              <p className="text-xs    ">This month</p>
                           </div>
                           <div className="text-right">
                              <div className="flex items-center">
                                 <TrendingUp className="h-4 w-4 text-green-400 mr-1" />
                                 <span className="text-sm font-medium text-green-400">+8.7%</span>
                              </div>
                           </div>
                        </div>

                        <div className="flex items-center justify-between p-3 rounded-lg  ">
                           <div>
                              <p className="text-sm font-medium ">Content Quality</p>
                              <p className="text-xs    ">AI Score</p>
                           </div>
                           <div className="text-right">
                              <div className="flex items-center">
                                 <TrendingUp className="h-4 w-4 text-green-400 mr-1" />
                                 <span className="text-sm font-medium text-green-400">8.9/10</span>
                              </div>
                           </div>
                        </div>
                     </div>
                  </CardContent>
               </Card>
            </div>
         </div>
      </div>
   );
}
