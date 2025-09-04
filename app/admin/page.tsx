'use client';

import { useState } from 'react';
import {
   Users,
   BarChart3,
   DollarSign,
   Activity,
   TrendingUp,
   TrendingDown,
   AlertTriangle,
   CheckCircle,
   Clock,
   Zap,
   Brain,
   Database,
   Server,
   Shield,
   Settings,
   Eye,
   Edit,
   Trash2,
   Ban,
   UserCheck,
   Download,
   RefreshCw,
   Search,
   Filter,
   MoreHorizontal,
   MessageSquare,
   Flag,
   Globe,
   Cpu,
   HardDrive,
   Wifi,
   Lock,
   Unlock,
   UserX,
   Mail,
   Phone,
   Calendar,
   CreditCard,
   FileText,
   Image,
   Video,
   Link,
   Hash,
   Heart,
   Share,
   MessageCircle,
   Bookmark,
   Play,
   Pause,
   StopCircle,
   AlertOctagon,
   CheckCircle2,
   XCircle,
   Info
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Progress } from '@/components/ui/progress';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

const adminStats = {
   totalUsers: 12847,
   activeUsers: 8934,
   totalRevenue: 284750,
   monthlyGrowth: 23.5,
   aiRequests: 1247893,
   systemHealth: 99.2,
   storageUsed: 2.4, // TB
   bandwidthUsed: 847.2, // GB
   contentGenerated: 45623,
   scheduledPosts: 12456,
   flaggedContent: 23,
   blockedUsers: 12
};

const recentUsers = [
   {
      id: 1,
      name: 'John Doe',
      email: 'john@example.com',
      plan: 'Pro',
      status: 'active',
      joinDate: '2024-01-15',
      lastActive: '2 hours ago',
      aiUsage: 1247,
      revenue: 29,
      contentGenerated: 156,
      flaggedContent: 0,
      location: 'New York, US',
      avatar: 'https://images.pexels.com/photos/1300402/pexels-photo-1300402.jpeg?auto=compress&cs=tinysrgb&w=100'
   },
   {
      id: 2,
      name: 'Sarah Wilson',
      email: 'sarah@company.com',
      plan: 'Enterprise',
      status: 'active',
      joinDate: '2024-01-10',
      lastActive: '5 minutes ago',
      aiUsage: 3421,
      revenue: 99,
      contentGenerated: 423,
      flaggedContent: 1,
      location: 'London, UK',
      avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=100'
   },
   {
      id: 3,
      name: 'Mike Johnson',
      email: 'mike@startup.io',
      plan: 'Free',
      status: 'suspended',
      joinDate: '2024-01-08',
      lastActive: '3 days ago',
      aiUsage: 234,
      revenue: 0,
      contentGenerated: 45,
      flaggedContent: 3,
      location: 'San Francisco, US',
      avatar: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=100'
   },
   {
      id: 4,
      name: 'Emma Davis',
      email: 'emma@agency.com',
      plan: 'Pro',
      status: 'active',
      joinDate: '2024-01-05',
      lastActive: '1 hour ago',
      aiUsage: 2156,
      revenue: 29,
      contentGenerated: 289,
      flaggedContent: 0,
      location: 'Toronto, CA',
      avatar: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=100'
   }
];

const aiModelUsage = [
   { model: 'GPT-4 Turbo', requests: 456789, cost: 4567.89, avgResponseTime: 1.2, successRate: 99.8, errors: 12 },
   { model: 'Claude 3 Opus', requests: 234567, cost: 3521.01, avgResponseTime: 1.8, successRate: 99.5, errors: 8 },
   { model: 'GPT-3.5 Turbo', requests: 345678, cost: 345.68, avgResponseTime: 0.8, successRate: 99.9, errors: 3 },
   { model: 'Claude 3 Sonnet', requests: 123456, cost: 370.37, avgResponseTime: 1.1, successRate: 99.7, errors: 5 }
];

const systemAlerts = [
   { id: 1, type: 'error', message: 'High API usage detected for GPT-4 Turbo', time: '5 minutes ago', severity: 'high' },
   { id: 2, type: 'warning', message: 'User "mike@startup.io" flagged for suspicious activity', time: '15 minutes ago', severity: 'medium' },
   { id: 3, type: 'info', message: 'Scheduled maintenance completed successfully', time: '2 hours ago', severity: 'low' },
   { id: 4, type: 'error', message: 'Failed payment for user ID: 12847', time: '4 hours ago', severity: 'high' },
   { id: 5, type: 'success', message: 'New enterprise customer onboarded', time: '6 hours ago', severity: 'low' }
];

const flaggedContent = [
   {
      id: 1,
      userId: 3,
      userName: 'Mike Johnson',
      content: 'This is some potentially inappropriate content that was flagged by our AI moderation system...',
      platform: 'Twitter',
      flagReason: 'Inappropriate language',
      flaggedAt: '2024-01-15T10:30:00Z',
      status: 'pending',
      severity: 'medium',
      aiConfidence: 85
   },
   {
      id: 2,
      userId: 2,
      userName: 'Sarah Wilson',
      content: 'Content that might violate community guidelines regarding promotional content...',
      platform: 'LinkedIn',
      flagReason: 'Spam/Promotional',
      flaggedAt: '2024-01-15T09:15:00Z',
      status: 'reviewed',
      severity: 'low',
      aiConfidence: 72
   },
   {
      id: 3,
      userId: 3,
      userName: 'Mike Johnson',
      content: 'Another piece of content that was automatically flagged for review...',
      platform: 'Instagram',
      flagReason: 'Misleading information',
      flaggedAt: '2024-01-14T16:45:00Z',
      status: 'pending',
      severity: 'high',
      aiConfidence: 91
   }
];

const systemMetrics = {
   cpu: 45,
   memory: 67,
   disk: 23,
   network: 89,
   activeConnections: 1247,
   queuedJobs: 156,
   errorRate: 0.02,
   uptime: 99.98
};

export default function AdminDashboard() {
   const [selectedTimeframe, setSelectedTimeframe] = useState('7d');
   const [userFilter, setUserFilter] = useState('all');
   const [searchQuery, setSearchQuery] = useState('');
   const [selectedUser, setSelectedUser] = useState(null);
   const [showUserDialog, setShowUserDialog] = useState(false);
   const [contentFilter, setContentFilter] = useState('all');
   const [alertFilter, setAlertFilter] = useState('all');

   const getStatusColor = (status) => {
      switch (status) {
         case 'active': return 'bg-green-600';
         case 'inactive': return 'bg-yellow-600';
         case 'suspended': return 'bg-red-600';
         case 'banned': return 'bg-red-800';
         default: return 'bg-slate-600';
      }
   };

   const getAlertIcon = (type) => {
      switch (type) {
         case 'error': return <AlertTriangle className="h-4 w-4 text-red-400" />;
         case 'warning': return <AlertTriangle className="h-4 w-4 text-yellow-400" />;
         case 'success': return <CheckCircle className="h-4 w-4 text-green-400" />;
         case 'info': return <Info className="h-4 w-4 text-blue-400" />;
         default: return <Activity className="h-4 w-4    " />;
      }
   };

   const getSeverityColor = (severity) => {
      switch (severity) {
         case 'high': return 'text-red-400 bg-red-400/10';
         case 'medium': return 'text-yellow-400 bg-yellow-400/10';
         case 'low': return 'text-green-400 bg-green-400/10';
         default: return '     /10';
      }
   };

   const filteredUsers = recentUsers.filter(user => {
      const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
         user.email.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesFilter = userFilter === 'all' || user.status === userFilter;
      return matchesSearch && matchesFilter;
   });

   const filteredContent = flaggedContent.filter(content => {
      return contentFilter === 'all' || content.status === contentFilter;
   });

   const filteredAlerts = systemAlerts.filter(alert => {
      return alertFilter === 'all' || alert.severity === alertFilter;
   });

   const handleUserAction = (userId, action) => {
      console.log(`Performing ${action} on user ${userId}`);
      // Here you would implement the actual user management actions
   };

   const handleContentAction = (contentId, action) => {
      console.log(`Performing ${action} on content ${contentId}`);
      // Here you would implement the actual content moderation actions
   };

   return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-red-950">
         <div className="p-6 max-w-7xl mx-auto">
            <div className="mb-8">
               <div className="flex items-center justify-between">
                  <div>
                     <h1 className="text-3xl font-bold     mb-2 flex items-center space-x-3">
                        <Shield className="h-8 w-8 text-red-400" />
                        <span>Admin Dashboard</span>
                     </h1>
                     <p className="   ">
                        Monitor and manage your SocialAI platform
                     </p>
                  </div>
                  <div className="flex space-x-3">
                     <Select value={selectedTimeframe} onValueChange={setSelectedTimeframe}>
                        <SelectTrigger className="   border-border     w-32">
                           <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="  border-border">
                           <SelectItem value="24h"  >Last 24h</SelectItem>
                           <SelectItem value="7d"  >Last 7 days</SelectItem>
                           <SelectItem value="30d"  >Last 30 days</SelectItem>
                           <SelectItem value="90d"  >Last 90 days</SelectItem>
                        </SelectContent>
                     </Select>
                     <Button variant="outline" className=" border-border    ">
                        <Download className="h-4 w-4 mr-2" />
                        Export Data
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
                           <p className="text-sm font-medium    ">Total Users</p>
                           <p className="text-2xl font-bold    ">{adminStats.totalUsers.toLocaleString()}</p>
                           <div className="flex items-center mt-1">
                              <TrendingUp className="h-4 w-4 text-green-400 mr-1" />
                              <span className="text-sm text-green-400">+{adminStats.monthlyGrowth}%</span>
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
                           <p className="text-sm font-medium    ">Monthly Revenue</p>
                           <p className="text-2xl font-bold    ">${adminStats.totalRevenue.toLocaleString()}</p>
                           <div className="flex items-center mt-1">
                              <TrendingUp className="h-4 w-4 text-green-400 mr-1" />
                              <span className="text-sm text-green-400">+18.2%</span>
                           </div>
                        </div>
                        <DollarSign className="h-8 w-8 text-green-400" />
                     </div>
                  </CardContent>
               </Card>

               <Card  >
                  <CardContent className="p-6">
                     <div className="flex items-center justify-between">
                        <div>
                           <p className="text-sm font-medium    ">AI Requests</p>
                           <p className="text-2xl font-bold    ">{adminStats.aiRequests.toLocaleString()}</p>
                           <div className="flex items-center mt-1">
                              <TrendingUp className="h-4 w-4 text-blue-400 mr-1" />
                              <span className="text-sm text-blue-400">+34.5%</span>
                           </div>
                        </div>
                        <Brain className="h-8 w-8 text-blue-400" />
                     </div>
                  </CardContent>
               </Card>

               <Card  >
                  <CardContent className="p-6">
                     <div className="flex items-center justify-between">
                        <div>
                           <p className="text-sm font-medium    ">System Health</p>
                           <p className="text-2xl font-bold    ">{adminStats.systemHealth}%</p>
                           <div className="flex items-center mt-1">
                              <CheckCircle className="h-4 w-4 text-green-400 mr-1" />
                              <span className="text-sm text-green-400">Excellent</span>
                           </div>
                        </div>
                        <Activity className="h-8 w-8 text-orange-400" />
                     </div>
                  </CardContent>
               </Card>
            </div>

            <Tabs defaultValue="users" className="space-y-6">
               <TabsList className="  border-border">
                  <TabsTrigger value="users"  >Users</TabsTrigger>
                  <TabsTrigger value="content"  >Content Moderation</TabsTrigger>
                  <TabsTrigger value="ai-models"  >AI Models</TabsTrigger>
                  <TabsTrigger value="system"  >System</TabsTrigger>
                  <TabsTrigger value="analytics"  >Analytics</TabsTrigger>
               </TabsList>

               <TabsContent value="users" className="space-y-6">
                  {/* User Management */}
                  <Card  >
                     <CardHeader>
                        <div className="flex items-center justify-between">
                           <div>
                              <CardTitle  >User Management</CardTitle>
                              <CardDescription>Manage and monitor user accounts</CardDescription>
                           </div>
                           <div className="flex space-x-2">
                              <Input
                                 placeholder="Search users..."
                                 value={searchQuery}
                                 onChange={(e) => setSearchQuery(e.target.value)}
                                 className="   border-border     w-64"
                              />
                              <Select value={userFilter} onValueChange={setUserFilter}>
                                 <SelectTrigger className="   border-border     w-32">
                                    <SelectValue />
                                 </SelectTrigger>
                                 <SelectContent className="  border-border">
                                    <SelectItem value="all"  >All Users</SelectItem>
                                    <SelectItem value="active"  >Active</SelectItem>
                                    <SelectItem value="inactive"  >Inactive</SelectItem>
                                    <SelectItem value="suspended"  >Suspended</SelectItem>
                                    <SelectItem value="banned"  >Banned</SelectItem>
                                 </SelectContent>
                              </Select>
                           </div>
                        </div>
                     </CardHeader>
                     <CardContent>
                        <div className="space-y-4">
                           {filteredUsers.map((user) => (
                              <div key={user.id} className="flex items-center justify-between p-4 rounded-lg   hover: /50 transition-colors">
                                 <div className="flex items-center space-x-4">
                                    <img
                                       src={user.avatar}
                                       alt={user.name}
                                       className="w-12 h-12 rounded-full object-cover"
                                    />
                                    <div>
                                       <h3 className="text-sm font-medium    ">{user.name}</h3>
                                       <p className="text-xs    ">{user.email}</p>
                                       <div className="flex items-center space-x-4 mt-1 text-xs text-muted-foreground">
                                          <span>Joined: {user.joinDate}</span>
                                          <span>Last active: {user.lastActive}</span>
                                          <span>{user.location}</span>
                                       </div>
                                    </div>
                                 </div>

                                 <div className="flex items-center space-x-4">
                                    <div className="text-right">
                                       <Badge className={getStatusColor(user.status)}>
                                          {user.status}
                                       </Badge>
                                       <div className="text-xs     mt-1">
                                          {user.plan} Plan
                                       </div>
                                    </div>

                                    <div className="text-right">
                                       <div className="text-sm font-medium    ">${user.revenue}/mo</div>
                                       <div className="text-xs    ">{user.aiUsage} AI requests</div>
                                       <div className="text-xs    ">{user.contentGenerated} posts</div>
                                    </div>

                                    <div className="text-right">
                                       {user.flaggedContent > 0 && (
                                          <Badge className="bg-red-600 mb-1">
                                             {user.flaggedContent} flagged
                                          </Badge>
                                       )}
                                    </div>

                                    <div className="flex space-x-2">
                                       <Button
                                          size="sm"
                                          variant="ghost"
                                          onClick={() => {
                                             setSelectedUser(user);
                                             setShowUserDialog(true);
                                          }}
                                       >
                                          <Eye className="h-4 w-4" />
                                       </Button>
                                       <DropdownMenu>
                                          <DropdownMenuTrigger asChild>
                                             <Button size="sm" variant="ghost">
                                                <MoreHorizontal className="h-4 w-4" />
                                             </Button>
                                          </DropdownMenuTrigger>
                                          <DropdownMenuContent className="  border-border">
                                             <DropdownMenuItem

                                                onClick={() => handleUserAction(user.id, 'edit')}
                                             >
                                                <Edit className="h-4 w-4 mr-2" />
                                                Edit User
                                             </DropdownMenuItem>
                                             <DropdownMenuItem

                                                onClick={() => handleUserAction(user.id, user.status === 'active' ? 'suspend' : 'activate')}
                                             >
                                                {user.status === 'active' ? (
                                                   <>
                                                      <Ban className="h-4 w-4 mr-2" />
                                                      Suspend User
                                                   </>
                                                ) : (
                                                   <>
                                                      <UserCheck className="h-4 w-4 mr-2" />
                                                      Activate User
                                                   </>
                                                )}
                                             </DropdownMenuItem>
                                             <DropdownMenuItem
                                                className="text-red-400"
                                                onClick={() => handleUserAction(user.id, 'ban')}
                                             >
                                                <UserX className="h-4 w-4 mr-2" />
                                                Ban User
                                             </DropdownMenuItem>
                                          </DropdownMenuContent>
                                       </DropdownMenu>
                                    </div>
                                 </div>
                              </div>
                           ))}
                        </div>
                     </CardContent>
                  </Card>
               </TabsContent>

               <TabsContent value="content" className="space-y-6">
                  {/* Content Moderation */}
                  <Card  >
                     <CardHeader>
                        <div className="flex items-center justify-between">
                           <div>
                              <CardTitle  >Content Moderation</CardTitle>
                              <CardDescription>Review and manage flagged content</CardDescription>
                           </div>
                           <div className="flex space-x-2">
                              <Select value={contentFilter} onValueChange={setContentFilter}>
                                 <SelectTrigger className="   border-border     w-32">
                                    <SelectValue />
                                 </SelectTrigger>
                                 <SelectContent className="  border-border">
                                    <SelectItem value="all"  >All Content</SelectItem>
                                    <SelectItem value="pending"  >Pending</SelectItem>
                                    <SelectItem value="reviewed"  >Reviewed</SelectItem>
                                    <SelectItem value="approved"  >Approved</SelectItem>
                                    <SelectItem value="rejected"  >Rejected</SelectItem>
                                 </SelectContent>
                              </Select>
                           </div>
                        </div>
                     </CardHeader>
                     <CardContent>
                        <div className="space-y-4">
                           {filteredContent.map((content) => (
                              <div key={content.id} className="p-4 rounded-lg   border  border-border">
                                 <div className="flex items-start justify-between mb-3">
                                    <div className="flex items-center space-x-3">
                                       <div className="w-10 h-10   rounded-full flex items-center justify-center">
                                          <span className="    font-medium text-sm">
                                             {content.userName.split(' ').map(n => n[0]).join('')}
                                          </span>
                                       </div>
                                       <div>
                                          <h4 className="text-sm font-medium    ">{content.userName}</h4>
                                          <p className="text-xs    ">User ID: {content.userId}</p>
                                          <div className="flex items-center space-x-2 mt-1">
                                             <Badge variant="outline" className="text-xs">{content.platform}</Badge>
                                             <Badge className={`text-xs ${getSeverityColor(content.severity)}`}>
                                                {content.severity} risk
                                             </Badge>
                                          </div>
                                       </div>
                                    </div>
                                    <div className="text-right">
                                       <Badge className={content.status === 'pending' ? 'bg-yellow-600' : 'bg-green-600'}>
                                          {content.status}
                                       </Badge>
                                       <p className="text-xs     mt-1">
                                          AI Confidence: {content.aiConfidence}%
                                       </p>
                                    </div>
                                 </div>

                                 <div className="mb-3">
                                    <p className="text-sm text-muted-foreground mb-2">{content.content}</p>
                                    <div className="flex items-center space-x-2">
                                       <Flag className="h-4 w-4 text-red-400" />
                                       <span className="text-sm text-red-400">Flagged for: {content.flagReason}</span>
                                    </div>
                                 </div>

                                 <div className="flex items-center justify-between">
                                    <span className="text-xs text-muted-foreground">
                                       Flagged {new Date(content.flaggedAt).toLocaleDateString()}
                                    </span>
                                    <div className="flex space-x-2">
                                       <Button
                                          size="sm"
                                          className="bg-green-600 hover:bg-green-700"
                                          onClick={() => handleContentAction(content.id, 'approve')}
                                       >
                                          <CheckCircle2 className="h-4 w-4 mr-1" />
                                          Approve
                                       </Button>
                                       <Button
                                          size="sm"
                                          variant="outline"
                                          className="border-red-600 text-red-400 hover:bg-red-600 hover:   "
                                          onClick={() => handleContentAction(content.id, 'reject')}
                                       >
                                          <XCircle className="h-4 w-4 mr-1" />
                                          Reject
                                       </Button>
                                       <Button
                                          size="sm"
                                          variant="ghost"
                                          onClick={() => handleContentAction(content.id, 'view')}
                                       >
                                          <Eye className="h-4 w-4" />
                                       </Button>
                                    </div>
                                 </div>
                              </div>
                           ))}
                        </div>
                     </CardContent>
                  </Card>
               </TabsContent>

               <TabsContent value="ai-models" className="space-y-6">
                  {/* AI Model Performance */}
                  <Card  >
                     <CardHeader>
                        <CardTitle  >AI Model Performance</CardTitle>
                        <CardDescription>Monitor AI model usage, costs, and performance metrics</CardDescription>
                     </CardHeader>
                     <CardContent>
                        <div className="space-y-4">
                           {aiModelUsage.map((model, index) => (
                              <div key={index} className="p-4 rounded-lg  ">
                                 <div className="flex items-center justify-between mb-3">
                                    <h3 className="text-lg font-medium    ">{model.model}</h3>
                                    <div className="flex space-x-2">
                                       <Badge className="   ">
                                          {model.successRate}% success rate
                                       </Badge>
                                       {model.errors > 0 && (
                                          <Badge className="bg-red-600">
                                             {model.errors} errors
                                          </Badge>
                                       )}
                                    </div>
                                 </div>

                                 <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                                    <div>
                                       <div className="text-sm    ">Requests</div>
                                       <div className="text-lg font-semibold    ">{model.requests.toLocaleString()}</div>
                                    </div>
                                    <div>
                                       <div className="text-sm    ">Cost</div>
                                       <div className="text-lg font-semibold    ">${model.cost.toLocaleString()}</div>
                                    </div>
                                    <div>
                                       <div className="text-sm    ">Avg Response Time</div>
                                       <div className="text-lg font-semibold    ">{model.avgResponseTime}s</div>
                                    </div>
                                    <div>
                                       <div className="text-sm    ">Success Rate</div>
                                       <div className="text-lg font-semibold text-green-400">{model.successRate}%</div>
                                    </div>
                                    <div>
                                       <div className="text-sm    ">Errors</div>
                                       <div className="text-lg font-semibold text-red-400">{model.errors}</div>
                                    </div>
                                 </div>
                              </div>
                           ))}
                        </div>
                     </CardContent>
                  </Card>
               </TabsContent>

               <TabsContent value="system" className="space-y-6">
                  {/* System Health */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                     <Card  >
                        <CardHeader>
                           <CardTitle  >System Resources</CardTitle>
                           <CardDescription>Monitor system resource usage</CardDescription>
                        </CardHeader>
                        <CardContent>
                           <div className="space-y-4">
                              <div>
                                 <div className="flex justify-between text-sm mb-2">
                                    <span className="    flex items-center">
                                       <Cpu className="h-4 w-4 mr-2" />
                                       CPU Usage
                                    </span>
                                    <span className="   ">{systemMetrics.cpu}%</span>
                                 </div>
                                 <Progress value={systemMetrics.cpu} className="h-2" />
                              </div>

                              <div>
                                 <div className="flex justify-between text-sm mb-2">
                                    <span className="    flex items-center">
                                       <Database className="h-4 w-4 mr-2" />
                                       Memory Usage
                                    </span>
                                    <span className="   ">{systemMetrics.memory}%</span>
                                 </div>
                                 <Progress value={systemMetrics.memory} className="h-2" />
                              </div>

                              <div>
                                 <div className="flex justify-between text-sm mb-2">
                                    <span className="    flex items-center">
                                       <HardDrive className="h-4 w-4 mr-2" />
                                       Disk Usage
                                    </span>
                                    <span className="   ">{systemMetrics.disk}%</span>
                                 </div>
                                 <Progress value={systemMetrics.disk} className="h-2" />
                              </div>

                              <div>
                                 <div className="flex justify-between text-sm mb-2">
                                    <span className="    flex items-center">
                                       <Wifi className="h-4 w-4 mr-2" />
                                       Network Usage
                                    </span>
                                    <span className="   ">{systemMetrics.network}%</span>
                                 </div>
                                 <Progress value={systemMetrics.network} className="h-2" />
                              </div>
                           </div>
                        </CardContent>
                     </Card>

                     <Card  >
                        <CardHeader>
                           <div className="flex items-center justify-between">
                              <div>
                                 <CardTitle  >System Alerts</CardTitle>
                                 <CardDescription>Recent system notifications and alerts</CardDescription>
                              </div>
                              <Select value={alertFilter} onValueChange={setAlertFilter}>
                                 <SelectTrigger className="   border-border     w-24">
                                    <SelectValue />
                                 </SelectTrigger>
                                 <SelectContent className="  border-border">
                                    <SelectItem value="all"  >All</SelectItem>
                                    <SelectItem value="high"  >High</SelectItem>
                                    <SelectItem value="medium"  >Medium</SelectItem>
                                    <SelectItem value="low"  >Low</SelectItem>
                                 </SelectContent>
                              </Select>
                           </div>
                        </CardHeader>
                        <CardContent>
                           <div className="space-y-3 max-h-80 overflow-y-auto">
                              {filteredAlerts.map((alert) => (
                                 <div key={alert.id} className="flex items-start space-x-3 p-3 rounded-lg  ">
                                    {getAlertIcon(alert.type)}
                                    <div className="flex-1">
                                       <p className="text-sm    ">{alert.message}</p>
                                       <div className="flex items-center justify-between mt-1">
                                          <p className="text-xs    ">{alert.time}</p>
                                          <Badge className={`text-xs ${getSeverityColor(alert.severity)}`}>
                                             {alert.severity}
                                          </Badge>
                                       </div>
                                    </div>
                                 </div>
                              ))}
                           </div>
                        </CardContent>
                     </Card>
                  </div>

                  {/* System Metrics */}
                  <Card  >
                     <CardHeader>
                        <CardTitle  >System Metrics</CardTitle>
                        <CardDescription>Real-time system performance indicators</CardDescription>
                     </CardHeader>
                     <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                           <div className="text-center">
                              <div className="text-2xl font-bold     mb-1">{systemMetrics.activeConnections}</div>
                              <div className="text-sm    ">Active Connections</div>
                           </div>
                           <div className="text-center">
                              <div className="text-2xl font-bold     mb-1">{systemMetrics.queuedJobs}</div>
                              <div className="text-sm    ">Queued Jobs</div>
                           </div>
                           <div className="text-center">
                              <div className="text-2xl font-bold     mb-1">{systemMetrics.errorRate}%</div>
                              <div className="text-sm    ">Error Rate</div>
                           </div>
                           <div className="text-center">
                              <div className="text-2xl font-bold     mb-1">{systemMetrics.uptime}%</div>
                              <div className="text-sm    ">Uptime</div>
                           </div>
                        </div>
                     </CardContent>
                  </Card>
               </TabsContent>

               <TabsContent value="analytics" className="space-y-6">
                  {/* Platform Analytics */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                     <Card  >
                        <CardHeader>
                           <CardTitle  >Platform Analytics</CardTitle>
                           <CardDescription>Detailed analytics and insights</CardDescription>
                        </CardHeader>
                        <CardContent>
                           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <div className="text-center">
                                 <div className="text-2xl font-bold     mb-1">89.2%</div>
                                 <div className="text-sm    ">User Retention Rate</div>
                                 <div className="text-xs text-green-400 mt-1">+5.2% from last month</div>
                              </div>
                              <div className="text-center">
                                 <div className="text-2xl font-bold     mb-1">4.7</div>
                                 <div className="text-sm    ">Avg Session Duration (hrs)</div>
                                 <div className="text-xs text-blue-400 mt-1">+12% from last month</div>
                              </div>
                              <div className="text-center">
                                 <div className="text-2xl font-bold     mb-1">92.1%</div>
                                 <div className="text-sm    ">Feature Adoption Rate</div>
                                 <div className="text-xs text-green-400 mt-1">+8.3% from last month</div>
                              </div>
                              <div className="text-center">
                                 <div className="text-2xl font-bold     mb-1">15.4%</div>
                                 <div className="text-sm    ">Conversion Rate</div>
                                 <div className="text-xs text-green-400 mt-1">+2.1% from last month</div>
                              </div>
                           </div>
                        </CardContent>
                     </Card>

                     <Card  >
                        <CardHeader>
                           <CardTitle  >Content Statistics</CardTitle>
                           <CardDescription>Content generation and engagement metrics</CardDescription>
                        </CardHeader>
                        <CardContent>
                           <div className="space-y-4">
                              <div className="flex justify-between items-center">
                                 <span className="   ">Content Generated</span>
                                 <span className="    font-semibold">{adminStats.contentGenerated.toLocaleString()}</span>
                              </div>
                              <div className="flex justify-between items-center">
                                 <span className="   ">Scheduled Posts</span>
                                 <span className="    font-semibold">{adminStats.scheduledPosts.toLocaleString()}</span>
                              </div>
                              <div className="flex justify-between items-center">
                                 <span className="   ">Flagged Content</span>
                                 <span className="text-red-400 font-semibold">{adminStats.flaggedContent}</span>
                              </div>
                              <div className="flex justify-between items-center">
                                 <span className="   ">Blocked Users</span>
                                 <span className="text-red-400 font-semibold">{adminStats.blockedUsers}</span>
                              </div>
                           </div>
                        </CardContent>
                     </Card>
                  </div>
               </TabsContent>
            </Tabs>

            {/* User Detail Dialog */}
            <Dialog open={showUserDialog} onOpenChange={setShowUserDialog}>
               <DialogContent className="  border-border max-w-2xl">
                  <DialogHeader>
                     <DialogTitle  >User Details</DialogTitle>
                     <DialogDescription>
                        Detailed information about {selectedUser?.name}
                     </DialogDescription>
                  </DialogHeader>
                  {selectedUser && (
                     <div className="space-y-6">
                        <div className="flex items-center space-x-4">
                           <img
                              src={selectedUser.avatar}
                              alt={selectedUser.name}
                              className="w-16 h-16 rounded-full object-cover"
                           />
                           <div>
                              <h3 className="text-lg font-medium    ">{selectedUser.name}</h3>
                              <p className="   ">{selectedUser.email}</p>
                              <Badge className={getStatusColor(selectedUser.status)}>
                                 {selectedUser.status}
                              </Badge>
                           </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                           <div>
                              <Label  >Plan</Label>
                              <p className="text-muted-foreground">{selectedUser.plan}</p>
                           </div>
                           <div>
                              <Label  >Revenue</Label>
                              <p className="text-muted-foreground">${selectedUser.revenue}/month</p>
                           </div>
                           <div>
                              <Label  >Join Date</Label>
                              <p className="text-muted-foreground">{selectedUser.joinDate}</p>
                           </div>
                           <div>
                              <Label  >Last Active</Label>
                              <p className="text-muted-foreground">{selectedUser.lastActive}</p>
                           </div>
                           <div>
                              <Label  >AI Usage</Label>
                              <p className="text-muted-foreground">{selectedUser.aiUsage} requests</p>
                           </div>
                           <div>
                              <Label  >Content Generated</Label>
                              <p className="text-muted-foreground">{selectedUser.contentGenerated} posts</p>
                           </div>
                           <div>
                              <Label  >Location</Label>
                              <p className="text-muted-foreground">{selectedUser.location}</p>
                           </div>
                           <div>
                              <Label  >Flagged Content</Label>
                              <p className={selectedUser.flaggedContent > 0 ? "text-red-400" : "text-green-400"}>
                                 {selectedUser.flaggedContent} items
                              </p>
                           </div>
                        </div>

                        <div className="flex space-x-3">
                           <Button
                              className="flex-1"
                              onClick={() => handleUserAction(selectedUser.id, 'edit')}
                           >
                              <Edit className="h-4 w-4 mr-2" />
                              Edit User
                           </Button>
                           <Button
                              variant="outline"
                              className="flex-1"
                              onClick={() => handleUserAction(selectedUser.id, selectedUser.status === 'active' ? 'suspend' : 'activate')}
                           >
                              {selectedUser.status === 'active' ? (
                                 <>
                                    <Ban className="h-4 w-4 mr-2" />
                                    Suspend
                                 </>
                              ) : (
                                 <>
                                    <UserCheck className="h-4 w-4 mr-2" />
                                    Activate
                                 </>
                              )}
                           </Button>
                           <Button
                              variant="outline"
                              className="border-red-600 text-red-400 hover:bg-red-600 hover:   "
                              onClick={() => handleUserAction(selectedUser.id, 'ban')}
                           >
                              <UserX className="h-4 w-4 mr-2" />
                              Ban User
                           </Button>
                        </div>
                     </div>
                  )}
               </DialogContent>
            </Dialog>
         </div>
      </div>
   );
}
