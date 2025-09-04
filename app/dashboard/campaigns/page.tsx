'use client';

import { useState, useEffect } from 'react';
import {
   Plus,
   Search,
   Filter, Play,
   Pause,
   BarChart3,
   Target,
   Calendar, TrendingUp, Settings,
   Eye, FileText, Sparkles, Trash2, Edit
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import {
   Select,
   SelectContent,
   SelectItem,
   SelectTrigger,
   SelectValue,
} from "@/components/ui/select"
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';

interface Campaign {
   id: string;
   user_id: string;
   created_at: string;
   updated_at: string;
   name: string;
   description: string;
   category: string;
   status: 'active' | 'paused' | 'completed' | 'draft';
   target_audience: string;
   content_pillars: string[];
   platforms: string[];
   posts_generated: number;
   scheduled_posts: number;
   engagement_rate: number;
}

const contentPillarsOptions = [
   { name: 'Educational', description: 'Tutorials, how-tos, and learning content' },
   { name: 'Behind the Scenes', description: 'Process, journey, and personal insights' },
   { name: 'Case Studies', description: 'Client work, project breakdowns, results' },
   { name: 'Industry News', description: 'Trends, updates, and commentary' },
   { name: 'Personal Story', description: 'Journey, challenges, and experiences' },
   { name: 'Product Updates', description: 'Features, releases, and announcements' },
   { name: 'Client Testimonials', description: 'Reviews, feedback, and success stories' },
   { name: 'Technical Insights', description: 'Deep dives, architecture, and code' }
];

const categoryOptions = [
   "Service Marketing", "Product Marketing", "Building in Public", "Thought Leadership"
];

const platformOptions = [
   "LinkedIn", "Twitter", "YouTube", "Instagram", "Medium", "Facebook", "TikTok"
];

export default function ContentCampaigns() {
   const queryClient = useQueryClient();
   const { toast } = useToast();

   const [searchQuery, setSearchQuery] = useState('');
   const [selectedCategory, setSelectedCategory] = useState('all');
   const [showCreateDialog, setShowCreateDialog] = useState(false);
   const [showEditDialog, setShowEditDialog] = useState(false);
   const [showDeleteDialog, setShowDeleteDialog] = useState(false);
   const [currentCampaign, setCurrentCampaign] = useState<Campaign | null>(null);

   const [newCampaignData, setNewCampaignData] = useState({
      name: '',
      description: '',
      category: '',
      target_audience: '',
      content_pillars: [],
      platforms: []
   });

   const { data: campaigns, isLoading, isError } = useQuery<Campaign[]>({
      queryKey: ['campaigns'],
      queryFn: async () => {
         const response = await fetch('/api/campaigns');
         if (!response.ok) {
            throw new Error('Failed to fetch campaigns');
         }
         return response.json();
      },
   });

   const createCampaignMutation = useMutation({
      mutationFn: async (campaign: Omit<Campaign, 'id' | 'user_id' | 'created_at' | 'updated_at' | 'status' | 'posts_generated' | 'scheduled_posts' | 'engagement_rate'>) => {
         const response = await fetch('/api/campaigns', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(campaign),
         });
         if (!response.ok) {
            throw new Error('Failed to create campaign');
         }
         return response.json();
      },
      onSuccess: () => {
         queryClient.invalidateQueries({ queryKey: ['campaigns'] });
         toast({ title: 'Campaign created!', description: 'Your new content campaign has been added.' });
         setShowCreateDialog(false);
         setNewCampaignData({
            name: '',
            description: '',
            category: '',
            target_audience: '',
            content_pillars: [],
            platforms: []
         });
      },
      onError: (error) => {
         toast({ title: 'Error', description: `Failed to create campaign: ${error.message}`, variant: 'destructive' });
      },
   });

   const updateCampaignMutation = useMutation({
      mutationFn: async (campaign: Partial<Campaign>) => {
         const response = await fetch(`/api/campaigns/${campaign.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(campaign),
         });
         if (!response.ok) {
            throw new Error('Failed to update campaign');
         }
         return response.json();
      },
      onSuccess: () => {
         queryClient.invalidateQueries({ queryKey: ['campaigns'] });
         toast({ title: 'Campaign updated!', description: 'Campaign details have been saved.' });
         setShowEditDialog(false);
         setCurrentCampaign(null);
      },
      onError: (error) => {
         toast({ title: 'Error', description: `Failed to update campaign: ${error.message}`, variant: 'destructive' });
      },
   });

   const deleteCampaignMutation = useMutation({
      mutationFn: async (id: string) => {
         const response = await fetch(`/api/campaigns/${id}`, {
            method: 'DELETE',
         });
         if (!response.ok) {
            throw new Error('Failed to delete campaign');
         }
      },
      onSuccess: () => {
         queryClient.invalidateQueries({ queryKey: ['campaigns'] });
         toast({ title: 'Campaign deleted!', description: 'The campaign has been removed.' });
         setShowDeleteDialog(false);
         setCurrentCampaign(null);
      },
      onError: (error) => {
         toast({ title: 'Error', description: `Failed to delete campaign: ${error.message}`, variant: 'destructive' });
      },
   });

   const getStatusColor = (status: string) => {
      switch (status) {
         case 'active': return 'bg-green-600';
         case 'paused': return 'bg-yellow-600';
         case 'completed': return 'bg-gray-600';
         case 'draft': return 'bg-blue-600';
         default: return 'bg-gray-600';
      }
   };

   const filteredCampaigns = campaigns?.filter(campaign => {
      const matchesSearch = campaign.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
         campaign.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || campaign.category === selectedCategory;
      return matchesSearch && matchesCategory;
   }) || [];

   const handlePillarToggle = (pillar: string) => {
      setNewCampaignData(prev => ({
         ...prev,
         content_pillars: prev.content_pillars.includes(pillar)
            ? prev.content_pillars.filter(p => p !== pillar)
            : [...prev.content_pillars, pillar]
      }));
   };

   const handlePlatformToggle = (platform: string) => {
      setNewCampaignData(prev => ({
         ...prev,
         platforms: prev.platforms.includes(platform)
            ? prev.platforms.filter(p => p !== platform)
            : [...prev.platforms, platform]
      }));
   };

   const handleEditPillarToggle = (pillar: string) => {
      if (!currentCampaign) return;
      setCurrentCampaign(prev => {
         if (!prev) return null;
         const updatedPillars = prev.content_pillars.includes(pillar)
            ? prev.content_pillars.filter(p => p !== pillar)
            : [...prev.content_pillars, pillar];
         return { ...prev, content_pillars: updatedPillars };
      });
   };

   const handleEditPlatformToggle = (platform: string) => {
      if (!currentCampaign) return;
      setCurrentCampaign(prev => {
         if (!prev) return null;
         const updatedPlatforms = prev.platforms.includes(platform)
            ? prev.platforms.filter(p => p !== platform)
            : [...prev.platforms, platform];
         return { ...prev, platforms: updatedPlatforms };
      });
   };

   if (isLoading) {
      return (
         <div className="dashboard-page-container flex justify-center items-center min-h-[calc(100vh-100px)]">
            <Loader className="h-12 w-12 animate-spin text-primary" />
         </div>
      );
   }

   if (isError) {
      return (
         <div className="dashboard-page-container text-center text-red-500">
            <h2 className="text-2xl font-bold">Error loading campaigns</h2>
            <p>Please try again later.</p>
         </div>
      );
   }

   return (
      <div className="dashboard-page-container">
         <div className="mb-8">
            <div className="flex items-center justify-between">
               <div>
                  <h1 className="dashboard-header-title">Content Campaigns</h1>
                  <p className="dashboard-header-description">
                     Create targeted content campaigns for different business goals and audiences
                  </p>
               </div>
               <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
                  <DialogTrigger asChild>
                     <Button className="btn-gradient gradient-card">
                        <Plus className="h-4 w-4 mr-2" />
                        Create Campaign
                     </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-3xl">
                     <DialogHeader>
                        <DialogTitle>Create New Content Campaign</DialogTitle>
                        <DialogDescription>
                           Set up a targeted campaign for specific business goals and audiences
                        </DialogDescription>
                     </DialogHeader>
                     <div className="space-y-6 max-h-[70vh] overflow-y-auto p-2">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                           <div>
                              <Label htmlFor="name">Campaign Name</Label>
                              <Input
                                 id="name"
                                 value={newCampaignData.name}
                                 onChange={(e) => setNewCampaignData({ ...newCampaignData, name: e.target.value })}
                                 placeholder="e.g., SaaS Development Services"
                              />
                           </div>
                           <div>
                              <Label htmlFor="category">Category</Label>
                              <Select
                                 value={newCampaignData.category}
                                 onValueChange={(value) => setNewCampaignData({ ...newCampaignData, category: value })}
                              >
                                 <SelectTrigger>
                                    <SelectValue placeholder="Select Category" />
                                 </SelectTrigger>
                                 <SelectContent>
                                    {categoryOptions.map((category) => (
                                       <SelectItem key={category} value={category}>
                                          {category}
                                       </SelectItem>
                                    ))}
                                 </SelectContent>
                              </Select>
                           </div>
                        </div>

                        <div>
                           <Label htmlFor="description">Campaign Description & Goals</Label>
                           <Textarea
                              id="description"
                              value={newCampaignData.description}
                              onChange={(e) => setNewCampaignData({ ...newCampaignData, description: e.target.value })}
                              placeholder="Describe the campaign goals, target outcomes, and key messaging..."
                              rows={3}
                           />
                        </div>

                        <div>
                           <Label htmlFor="audience">Target Audience</Label>
                           <Input
                              id="audience"
                              value={newCampaignData.target_audience}
                              onChange={(e) => setNewCampaignData({ ...newCampaignData, target_audience: e.target.value })}
                              placeholder="e.g., CTOs, Tech Leaders, Startup Founders"
                           />
                        </div>

                        <div>
                           <Label>Content Pillars</Label>
                           <div className="grid grid-cols-2 gap-2 mt-2">
                              {contentPillarsOptions.map((pillar) => (
                                 <button
                                    key={pillar.name}
                                    onClick={() => handlePillarToggle(pillar.name)}
                                    className={`p-3 rounded-lg border text-left transition-all ${newCampaignData.content_pillars.includes(pillar.name)
                                       ? 'border-purple-500 bg-purple-500/20 text-purple-300'
                                       : 'border-border bg-muted/30 text-muted-foreground hover:border-primary'
                                       }`}
                                 >
                                    <div className="font-medium text-sm">{pillar.name}</div>
                                    <div className="text-xs opacity-75">{pillar.description}</div>
                                 </button>
                              ))}
                           </div>
                        </div>

                        <div>
                           <Label>Platforms</Label>
                           <div className="flex flex-wrap gap-2 mt-2">
                              {platformOptions.map((platform) => (
                                 <Badge
                                    key={platform}
                                    variant={newCampaignData.platforms.includes(platform) ? "default" : "outline"}
                                    onClick={() => handlePlatformToggle(platform)}
                                    className="cursor-pointer hover:opacity-80"
                                 >
                                    {platform}
                                 </Badge>
                              ))}
                           </div>
                        </div>
                     </div>
                     <DialogFooter className="mt-6">
                        <Button
                           variant="outline"
                           onClick={() => setShowCreateDialog(false)}
                           disabled={createCampaignMutation.isLoading}
                        >
                           Cancel
                        </Button>
                        <Button
                           onClick={() => createCampaignMutation.mutate(newCampaignData)}
                           disabled={createCampaignMutation.isLoading}
                        >
                           {createCampaignMutation.isLoading ? 'Creating...' : 'Create Campaign'}
                        </Button>
                     </DialogFooter>
                  </DialogContent>
               </Dialog>

               {/* Edit Campaign Dialog */}
               <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
                  <DialogContent className="max-w-3xl">
                     <DialogHeader>
                        <DialogTitle>Edit Content Campaign</DialogTitle>
                        <DialogDescription>
                           Modify the details of your campaign
                        </DialogDescription>
                     </DialogHeader>
                     {currentCampaign && (
                        <div className="space-y-6 max-h-[70vh] overflow-y-auto p-2">
                           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                 <Label htmlFor="edit-name">Campaign Name</Label>
                                 <Input
                                    id="edit-name"
                                    value={currentCampaign.name}
                                    onChange={(e) => setCurrentCampaign({ ...currentCampaign, name: e.target.value })}
                                 />
                              </div>
                              <div>
                                 <Label htmlFor="edit-category">Category</Label>
                                 <Select
                                    value={currentCampaign.category}
                                    onValueChange={(value) => setCurrentCampaign({ ...currentCampaign, category: value })}
                                 >
                                    <SelectTrigger>
                                       <SelectValue placeholder="Select Category" />
                                    </SelectTrigger>
                                    <SelectContent>
                                       {categoryOptions.map((category) => (
                                          <SelectItem key={category} value={category}>
                                             {category}
                                          </SelectItem>
                                       ))}
                                    </SelectContent>
                                 </Select>
                              </div>
                           </div>

                           <div>
                              <Label htmlFor="edit-description">Campaign Description & Goals</Label>
                              <Textarea
                                 id="edit-description"
                                 value={currentCampaign.description}
                                 onChange={(e) => setCurrentCampaign({ ...currentCampaign, description: e.target.value })}
                                 rows={3}
                              />
                           </div>

                           <div>
                              <Label htmlFor="edit-audience">Target Audience</Label>
                              <Input
                                 id="edit-audience"
                                 value={currentCampaign.target_audience}
                                 onChange={(e) => setCurrentCampaign({ ...currentCampaign, target_audience: e.target.value })}
                              />
                           </div>

                           <div>
                              <Label>Content Pillars</Label>
                              <div className="grid grid-cols-2 gap-2 mt-2">
                                 {contentPillarsOptions.map((pillar) => (
                                    <button
                                       key={pillar.name}
                                       onClick={() => handleEditPillarToggle(pillar.name)}
                                       className={`p-3 rounded-lg border text-left transition-all ${currentCampaign.content_pillars.includes(pillar.name)
                                          ? 'border-purple-500 bg-purple-500/20 text-purple-300'
                                          : 'border-border bg-muted/30 text-muted-foreground hover:border-primary'
                                          }`}
                                    >
                                       <div className="font-medium text-sm">{pillar.name}</div>
                                       <div className="text-xs opacity-75">{pillar.description}</div>
                                    </button>
                                 ))}
                              </div>
                           </div>

                           <div>
                              <Label>Platforms</Label>
                              <div className="flex flex-wrap gap-2 mt-2">
                                 {platformOptions.map((platform) => (
                                    <Badge
                                       key={platform}
                                       variant={currentCampaign.platforms.includes(platform) ? "default" : "outline"}
                                       onClick={() => handleEditPlatformToggle(platform)}
                                       className="cursor-pointer hover:opacity-80"
                                    >
                                       {platform}
                                    </Badge>
                                 ))}
                              </div>
                           </div>

                           <div>
                              <Label htmlFor="edit-status">Status</Label>
                              <Select
                                 value={currentCampaign.status}
                                 onValueChange={(value) => setCurrentCampaign({ ...currentCampaign, status: value as Campaign['status'] })}
                              >
                                 <SelectTrigger>
                                    <SelectValue placeholder="Select Status" />
                                 </SelectTrigger>
                                 <SelectContent>
                                    <SelectItem value="active">Active</SelectItem>
                                    <SelectItem value="paused">Paused</SelectItem>
                                    <SelectItem value="completed">Completed</SelectItem>
                                    <SelectItem value="draft">Draft</SelectItem>
                                 </SelectContent>
                              </Select>
                           </div>
                        </div>
                     )}
                     <DialogFooter className="mt-6">
                        <Button
                           variant="outline"
                           onClick={() => setShowEditDialog(false)}
                           disabled={updateCampaignMutation.isLoading}
                        >
                           Cancel
                        </Button>
                        <Button
                           onClick={() => currentCampaign && updateCampaignMutation.mutate(currentCampaign)}
                           disabled={updateCampaignMutation.isLoading}
                        >
                           {updateCampaignMutation.isLoading ? 'Saving...' : 'Save Changes'}
                        </Button>
                     </DialogFooter>
                  </DialogContent>
               </Dialog>

               {/* Delete Campaign Dialog */}
               <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                  <DialogContent>
                     <DialogHeader>
                        <DialogTitle>Are you absolutely sure?</DialogTitle>
                        <DialogDescription>
                           This action cannot be undone. This will permanently delete your campaign.
                        </DialogDescription>
                     </DialogHeader>
                     <DialogFooter>
                        <Button
                           variant="outline"
                           onClick={() => setShowDeleteDialog(false)}
                           disabled={deleteCampaignMutation.isLoading}
                        >
                           Cancel
                        </Button>
                        <Button
                           variant="destructive"
                           onClick={() => currentCampaign && deleteCampaignMutation.mutate(currentCampaign.id)}
                           disabled={deleteCampaignMutation.isLoading}
                        >
                           {deleteCampaignMutation.isLoading ? 'Deleting...' : 'Delete'}
                        </Button>
                     </DialogFooter>
                  </DialogContent>
               </Dialog>
            </div>
         </div>

         {/* Stats Cards */}
         <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
               <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                     <div>
                        <p className="text-sm font-medium">Active Campaigns</p>
                        <p className="text-2xl font-bold">{campaigns?.filter(c => c.status === 'active').length || 0}</p>
                     </div>
                     <Target className="h-8 w-8 text-green-400" />
                  </div>
               </CardContent>
            </Card>

            <Card>
               <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                     <div>
                        <p className="text-sm font-medium">Total Posts Generated</p>
                        <p className="text-2xl font-bold">{campaigns?.reduce((sum, c) => sum + c.posts_generated, 0) || 0}</p>
                     </div>
                     <FileText className="h-8 w-8 text-blue-400" />
                  </div>
               </CardContent>
            </Card>

            <Card>
               <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                     <div>
                        <p className="text-sm font-medium">Scheduled Posts</p>
                        <p className="text-2xl font-bold">{campaigns?.reduce((sum, c) => sum + c.scheduled_posts, 0) || 0}</p>
                     </div>
                     <Calendar className="h-8 w-8 text-purple-400" />
                  </div>
               </CardContent>
            </Card>

            <Card>
               <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                     <div>
                        <p className="text-sm font-medium">Avg Engagement</p>
                        <p className="text-2xl font-bold">
                           {((campaigns?.reduce((sum, c) => sum + c.engagement_rate, 0) || 0) / (campaigns?.length || 1)).toFixed(1)}%
                        </p>
                     </div>
                     <TrendingUp className="h-8 w-8 text-orange-400" />
                  </div>
               </CardContent>
            </Card>
         </div>

         {/* Search and Filters */}
         <Card className="mb-8">
            <CardContent className="p-4">
               <div className="flex items-center justify-between space-x-4">
                  <div className="flex-1 relative">
                     <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4" />
                     <Input
                        placeholder="Search campaigns..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10"
                     />
                  </div>
                  <div className="flex items-center space-x-2">
                     <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                        <SelectTrigger>
                           <SelectValue placeholder="Select Category" />
                        </SelectTrigger>
                        <SelectContent>
                           <SelectItem value="all">All Categories</SelectItem>
                           {categoryOptions.map((category) => (
                              <SelectItem key={category} value={category}>
                                 {category}
                              </SelectItem>
                           ))}
                        </SelectContent>
                     </Select>
                     <Button variant="outline" size="sm">
                        <Filter className="h-4 w-4 mr-2" />
                        More Filters
                     </Button>
                  </div>
               </div>
            </CardContent>
         </Card>

         {/* Campaigns Grid */}
         <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredCampaigns.length > 0 ? (
               filteredCampaigns.map((campaign) => (
                  <Card key={campaign.id} className="hover:border-primary transition-colors">
                     <CardContent className="p-6">
                        {/* Header */}
                        <div className="flex items-start justify-between mb-4">
                           <div className="flex items-center space-x-3">
                              <div className={`w-3 h-3 rounded-full ${getStatusColor(campaign.status)}`}></div>
                              <div>
                                 <h3 className="text-lg font-medium">{campaign.name}</h3>
                                 <div className="flex items-center space-x-2 mt-1">
                                    <Badge variant="outline" className="text-xs">
                                       {campaign.category}
                                    </Badge>
                                    <Badge className={getStatusColor(campaign.status)}>
                                       {campaign.status}
                                    </Badge>
                                 </div>
                              </div>
                           </div>
                           <div className="flex items-center space-x-1">
                              <Button size="sm" variant="ghost" onClick={() => {
                                 setCurrentCampaign(campaign);
                                 setShowEditDialog(true);
                              }}>
                                 <Edit className="h-4 w-4" />
                              </Button>
                              <Button size="sm" variant="ghost" onClick={() => {
                                 setCurrentCampaign(campaign);
                                 setShowDeleteDialog(true);
                              }}>
                                 <Trash2 className="h-4 w-4 text-red-500" />
                              </Button>
                           </div>
                        </div>

                        {/* Description */}
                        <p className="text-sm mb-4">{campaign.description}</p>

                        {/* Stats */}
                        <div className="grid grid-cols-3 gap-4 mb-4">
                           <div className="text-center">
                              <div className="text-lg font-semibold">{campaign.posts_generated}</div>
                              <div className="text-xs text-muted-foreground">Posts Generated</div>
                           </div>
                           <div className="text-center">
                              <div className="text-lg font-semibold text-blue-400">{campaign.scheduled_posts}</div>
                              <div className="text-xs text-muted-foreground">Scheduled</div>
                           </div>
                           <div className="text-center">
                              <div className="text-lg font-semibold text-green-400">{campaign.engagement_rate}%</div>
                              <div className="text-xs text-muted-foreground">Engagement</div>
                           </div>
                        </div>

                        {/* Content Pillars */}
                        <div className="mb-4">
                           <div className="text-xs text-muted-foreground mb-2">Content Pillars:</div>
                           <div className="flex flex-wrap gap-1">
                              {campaign.content_pillars.slice(0, 3).map((pillar) => (
                                 <Badge key={pillar} variant="secondary" className="text-xs">
                                    {pillar}
                                 </Badge>
                              ))}
                              {campaign.content_pillars.length > 3 && (
                                 <Badge variant="secondary" className="text-xs">
                                    +{campaign.content_pillars.length - 3}
                                 </Badge>
                              )}
                           </div>
                        </div>

                        {/* Platforms */}
                        <div className="mb-4">
                           <div className="text-xs text-muted-foreground mb-2">Platforms:</div>
                           <div className="flex flex-wrap gap-1">
                              {campaign.platforms.map((platform) => (
                                 <Badge key={platform} variant="outline" className="text-xs">
                                    {platform}
                                 </Badge>
                              ))}
                           </div>
                        </div>

                        {/* Actions */}
                        <div className="flex space-x-2">
                           <Button
                              size="sm"
                              className="flex-1"
                              onClick={() => {
                                 window.location.href = `/dashboard/create?campaign=${campaign.id}`;
                              }}
                           >
                              <Sparkles className="h-4 w-4 mr-1" />
                              Generate Content
                           </Button>
                           <Button size="sm" variant="outline" className="flex-1">
                              <BarChart3 className="h-4 w-4 mr-1" />
                              Analytics
                           </Button>
                           <Button size="sm" variant="outline">
                              {campaign.status === 'active' ? (
                                 <Pause className="h-4 w-4" />
                              ) : (
                                 <Play className="h-4 w-4" />
                              )}
                           </Button>
                        </div>

                        {/* Footer */}
                        <div className="flex items-center justify-between text-xs text-muted-foreground mt-4 pt-4 border-t border-border">
                           <span>Created {new Date(campaign.created_at).toLocaleDateString()}</span>
                           <span>Target: {campaign.target_audience.split(',')[0]}...</span>
                        </div>
                     </CardContent>
                  </Card>
               ))
            ) : (
               <Card className="lg:col-span-2">
                  <CardContent className="p-12 text-center">
                     <Target className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                     <h3 className="text-xl font-medium mb-2">No campaigns found</h3>
                     <p className="mb-6">
                        {searchQuery ? 'Try adjusting your search criteria' : 'Create your first content campaign to get started'}
                     </p>
                     <Button onClick={() => setShowCreateDialog(true)}>
                        <Plus className="h-4 w-4 mr-2" />
                        Create Campaign
                     </Button>
                  </CardContent>
               </Card>
            )}
         </div>
      </div>
   );
}