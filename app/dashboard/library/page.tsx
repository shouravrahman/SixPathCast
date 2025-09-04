'use client';
import {
   Select,
   SelectContent,
   SelectItem,
   SelectTrigger,
   SelectValue,
} from "@/components/ui/select"

import { useState } from 'react';
import {
   Search,
   Grid3X3,
   List, Edit,
   Trash2, Calendar,
   Eye, MoreHorizontal,
   Plus,
   Archive,
   Clock,
   TrendingUp,
   FileDown
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Checkbox } from '@/components/ui/checkbox';
import EditContentDialog from '@/components/library/EditContentDialog';
import ScheduleDialog from '@/components/schedule/ScheduleDialog';
import { posts } from '@/data/mockData';
import { platforms } from '@/data/mockData';
import { FaFacebook, FaInstagram, FaLinkedinIn, FaPinterest, FaTiktok, FaTwitter, FaYoutube } from 'react-icons/fa';
const PlatformIcons = {
   twitter: FaTwitter,
   linkedin: FaLinkedinIn,
   instagram: FaInstagram,
   youtube: FaYoutube,
   facebook: FaFacebook,
   tiktok: FaTiktok,
   pinterest: FaPinterest,
};

export default function ContentLibrary() {
   const [savedContent, setSavedContent] = useState(posts);
   const [viewMode, setViewMode] = useState('grid');
   const [searchQuery, setSearchQuery] = useState('');
   const [filterStatus, setFilterStatus] = useState('all');
   const [filterPlatform, setFilterPlatform] = useState('all');
   const [selectedItems, setSelectedItems] = useState<number[]>([]);
   const [editingContent, setEditingContent] = useState(null);
   const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
   const [selectedPostForSchedule, setSelectedPostForSchedule] = useState(null);

   const getStatusColor = (status: string) => {
      switch (status) {
         case 'published': return 'bg-green-600';
         case 'scheduled': return '  ';
         case 'draft': return 'bg-yellow-600';
         case 'archived': return 'bg-slate-600';
         default: return 'bg-slate-600';
      }
   };

   const getPlatformColor = (platform: string) => {
      const platformData = platforms.find(p => p.name.toLowerCase() === platform.toLowerCase());
      return platformData?.color || 'bg-slate-600';
   };

   const filteredContent = savedContent.filter(item => {
      const matchesSearch = item.topic.toLowerCase().includes(searchQuery.toLowerCase()) ||
         item.content.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = filterStatus === 'all' || item.status === filterStatus;
      const matchesPlatform = filterPlatform === 'all' || item.platform.toLowerCase() === filterPlatform.toLowerCase();
      return matchesSearch && matchesStatus && matchesPlatform;
   });

   const stats = {
      total: savedContent.length,
      published: savedContent.filter(item => item.status === 'published').length,
      scheduled: savedContent.filter(item => item.status === 'scheduled').length,
      drafts: savedContent.filter(item => item.status === 'draft').length
   };

   const handleSelect = (id: number) => {
      setSelectedItems(prev =>
         prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
      );
   };

   const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.checked) {
         setSelectedItems(filteredContent.map(item => item.id));
      } else {
         setSelectedItems([]);
      }
   };

   const exportSelected = () => {
      console.log('Exporting selected items:', selectedItems);
   };

   const handleSave = (updatedContent: string) => {
      setSavedContent(prev => prev.map(item => item.id === editingContent?.id ? { ...item, content: updatedContent } : item));
      setEditingContent(null);
   };

   const handleSchedule = (post) => {
      setSelectedPostForSchedule(post);
      setIsScheduleModalOpen(true);
   };

   const handleConfirmSchedule = (post, scheduleDate) => {
      if (post && scheduleDate) {
         setSavedContent(prev => prev.map(p => p.id === post.id ? { ...p, status: 'scheduled', scheduleDate: scheduleDate.toISOString() } : p));
      }
   };

   const renderActions = (item: any) => {
      switch (item.status) {
         case 'draft':
            return (
               <>
                  <DropdownMenuItem onClick={() => setEditingContent(item)}>
                     <Edit className="h-4 w-4 mr-2" />
                     Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleSchedule(item)}>
                     <Calendar className="h-4 w-4 mr-2" />
                     Schedule
                  </DropdownMenuItem>
               </>
            );
         case 'scheduled':
            return (
               <DropdownMenuItem onClick={() => handleSchedule(item)}>
                  <Calendar className="h-4 w-4 mr-2" />
                  Reschedule
               </DropdownMenuItem>
            );
         case 'published':
            return null; // No actions for published posts
         default:
            return (
               <DropdownMenuItem onClick={() => { }} className="text-red-400">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
               </DropdownMenuItem>
            );
      }
   };

   return (
      <>
         <div className="dashboard-page-container">
            <div className="mb-8">
               <div className="flex items-center justify-between">
                  <div>
                     <h1 className="dashboard-header-title">Content Library</h1>
                     <p className="dashboard-header-description">
                        Manage all your created and saved content in one place
                     </p>
                  </div>
                  <div className="flex items-center space-x-2">
                     {selectedItems.length > 0 && (
                        <Button variant="outline" onClick={exportSelected}>
                           <FileDown className="h-4 w-4 mr-2" />
                           Export ({selectedItems.length})
                        </Button>
                     )}
                     <Button className="btn-gradient">
                        <Plus className="h-4 w-4 mr-2" />
                        Create New
                     </Button>
                  </div>
               </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
               <Card  >
                  <CardContent className="p-6">
                     <div className="flex items-center justify-between">
                        <div>
                           <p className="text-sm font-medium dark:    text-primary">Total Content</p>
                           <p className="text-2xl font-bold ">{stats.total}</p>
                        </div>
                        <Archive className="h-8 w-8 text-purple-400" />
                     </div>
                  </CardContent>
               </Card>

               <Card  >
                  <CardContent className="p-6">
                     <div className="flex items-center justify-between">
                        <div>
                           <p className="text-sm font-medium dark:    text-primary">Published</p>
                           <p className="text-2xl font-bold ">{stats.published}</p>
                        </div>
                        <TrendingUp className="h-8 w-8 text-green-400" />
                     </div>
                  </CardContent>
               </Card>

               <Card  >
                  <CardContent className="p-6">
                     <div className="flex items-center justify-between">
                        <div>
                           <p className="text-sm font-medium dark:    text-primary">Scheduled</p>
                           <p className="text-2xl font-bold ">{stats.scheduled}</p>
                        </div>
                        <Clock className="h-8 w-8 text-blue-400" />
                     </div>
                  </CardContent>
               </Card>

               <Card  >
                  <CardContent className="p-6">
                     <div className="flex items-center justify-between">
                        <div>
                           <p className="text-sm font-medium dark:    text-primary">Drafts</p>
                           <p className="text-2xl font-bold ">{stats.drafts}</p>
                        </div>
                        <Edit className="h-8 w-8 text-yellow-400" />
                     </div>
                  </CardContent>
               </Card>
            </div>

            {/* Search and Filters */}
            <Card className="  mb-8">
               <CardContent className="p-4">
                  <div className="flex items-center justify-between space-x-4">
                     <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4    " />
                        <Input
                           placeholder="Search content..."
                           value={searchQuery}
                           onChange={(e) => setSearchQuery(e.target.value)}
                           className="pl-10 "
                        />
                     </div>
                     <div className="flex items-center space-x-2">
                        <Select value={filterStatus} onValueChange={setFilterStatus}>
                           <SelectTrigger>
                              <SelectValue placeholder="Select Status" />
                           </SelectTrigger>
                           <SelectContent>
                              <SelectItem value="all">All Status</SelectItem>
                              <SelectItem value="published">Published</SelectItem>
                              <SelectItem value="scheduled">Scheduled</SelectItem>
                              <SelectItem value="draft">Draft</SelectItem>
                           </SelectContent>
                        </Select>


                        <Select value={filterPlatform} onValueChange={setFilterPlatform}>
                           <SelectTrigger>
                              <SelectValue placeholder="Select Platform" />
                           </SelectTrigger>
                           <SelectContent>
                              <SelectItem value="all">All Platforms</SelectItem>
                              {platforms.map((p) => (
                                 <SelectItem key={p.id} value={p.name}>
                                    {p.name}
                                 </SelectItem>
                              ))}
                           </SelectContent>
                        </Select>
                        <Button
                           variant="outline"
                           size="sm"
                           onClick={() => setViewMode('grid')}
                           className={viewMode === 'grid' ? '   ' : ''}
                        >
                           <Grid3X3 className="h-4 w-4" />
                        </Button>
                        <Button
                           variant="outline"
                           size="sm"
                           onClick={() => setViewMode('list')}
                           className={viewMode === 'list' ? '   ' : ''}
                        >
                           <List className="h-4 w-4" />
                        </Button>
                     </div>
                  </div>
               </CardContent>
            </Card>

            {/* Content Grid/List */}
            <Card  >
               <CardContent className="p-6">
                  {viewMode === 'grid' ? (
                     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredContent.map((item) => {
                           const PlatformIcon = PlatformIcons[item.platform.toLowerCase()];
                           return (
                              <div
                                 key={item.id}
                                 className=" rounded-lg p-4 hover:bg-accent/70 cursor-pointer border border-border"
                              >
                                 <div className="flex items-center mb-4">
                                    <Checkbox id={`select-${item.id}`} onCheckedChange={() => handleSelect(item.id)} checked={selectedItems.includes(item.id)} />
                                    <label htmlFor={`select-${item.id}`} className="ml-3"></label>
                                    {/* Header */}
                                    <div className="flex items-start justify-between mb-3">
                                       <div className="flex items-center space-x-2">
                                          <div className={`w-6 h-6 rounded flex items-center justify-center  ${getPlatformColor(item.platform)}`}>
                                             {PlatformIcon && <PlatformIcon />}
                                          </div>
                                          <div>
                                             <h3 className="text-sm font-medium  truncate">{item.topic}</h3>
                                             <div className="flex items-center space-x-2 mt-1">
                                                <Badge variant="outline" className="text-xs">
                                                   {item.creationType}
                                                </Badge>
                                                <Badge className={`text-xs ${getStatusColor(item.status)}`}>
                                                   {item.status}
                                                </Badge>
                                             </div>
                                          </div>
                                       </div>
                                       <div className="flex items-center space-x-1">
                                          <DropdownMenu>
                                             <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="sm">
                                                   <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                             </DropdownMenuTrigger>
                                             <DropdownMenuContent className="dark:  border-border">
                                                {renderActions(item)}
                                             </DropdownMenuContent>
                                          </DropdownMenu>
                                       </div>
                                    </div>
                                 </div>

                                 {/* Content Preview */}
                                 <div className="dark:   rounded-lg p-3 mb-3">
                                    <p className="text-sm dark:text-muted-foreground line-clamp-3">
                                       {item.content}
                                    </p>
                                 </div>

                                 {/* Performance/Prediction */}
                                 <div className="flex items-center justify-between mb-3">
                                    <div className="flex items-center space-x-4 text-xs dark:   ">
                                       <span className="flex items-center">
                                          <Eye className="h-3 w-3 mr-1" />
                                          {item.likes}
                                       </span>
                                       <span className="flex items-center">
                                          <Eye className="h-3 w-3 mr-1" />
                                          {item.comments}
                                       </span>
                                       <span className="flex items-center">
                                          <Eye className="h-3 w-3 mr-1" />
                                          {item.shares}
                                       </span>
                                    </div>
                                 </div>

                                 {/* Footer */}
                                 <div className="flex items-center justify-between text-xs dark:text-muted-foreground">
                                    <span>
                                       {item.status === 'published' ? 'Published' : item.status === 'scheduled' ? 'Scheduled' : 'Created'}{' '}
                                       {item.scheduleDate ? new Date(item.scheduleDate).toLocaleDateString() : 'N/A'}
                                    </span>
                                 </div>
                              </div>
                           );
                        })}
                     </div>
                  ) : (
                     <div className="space-y-3">
                        <div className="flex items-center p-4 border-b border-border">
                           <Checkbox id="select-all" onCheckedChange={handleSelectAll} />
                           <label htmlFor="select-all" className="ml-3 flex-1 text-sm font-medium ">Select All</label>
                        </div>
                        {filteredContent.map((item) => {
                           const PlatformIcon = PlatformIcons[item.platform.toLowerCase()];
                           return (
                              <div
                                 key={item.id}
                                 className="flex items-center space-x-4 p-4 rounded-lg    transition-colors border  border-border"
                              >
                                 <Checkbox id={`select-list-${item.id}`} onCheckedChange={() => handleSelect(item.id)} checked={selectedItems.includes(item.id)} />
                                 <div className={`w-8 h-8 rounded flex items-center justify-center  ${getPlatformColor(item.platform)}`}>
                                    {PlatformIcon && <PlatformIcon />}
                                 </div>

                                 <div className="flex-1 min-w-0">
                                    <div className="flex items-center space-x-2 mb-1">
                                       <h3 className="text-sm font-medium  truncate">{item.topic}</h3>
                                       <Badge variant="outline" className="text-xs">
                                          {item.creationType}
                                       </Badge>
                                       <Badge className={`text-xs ${getStatusColor(item.status)}`}>
                                          {item.status}
                                       </Badge>
                                    </div>
                                    <p className="text-sm dark:    truncate">{item.content}</p>
                                    <div className="flex items-center space-x-4 mt-1 text-xs text-muted-foreground">
                                       <span>
                                          {item.scheduleDate ? new Date(item.scheduleDate).toLocaleDateString() : 'N/A'}
                                       </span>
                                    </div>
                                 </div>

                                 <div className="flex items-center space-x-2">
                                    <DropdownMenu>
                                       <DropdownMenuTrigger asChild>
                                          <Button variant="ghost" size="sm">
                                             <MoreHorizontal className="h-4 w-4" />
                                          </Button>
                                       </DropdownMenuTrigger>
                                       <DropdownMenuContent className="dark:  border-border">
                                          {renderActions(item)}
                                       </DropdownMenuContent>
                                    </DropdownMenu>
                                 </div>
                              </div>
                           );
                        })}
                     </div>
                  )}

                  {/* Empty State */}
                  {filteredContent.length === 0 && (
                     <div className="text-center py-12">
                        <Archive className="h-16 w-16 dark:text-muted-foreground mx-auto mb-4" />
                        <h3 className="text-xl font-medium  mb-2">No content found</h3>
                        <p className="    mb-6">
                           {searchQuery ? 'Try adjusting your search criteria' : 'Start creating content to see it here'}
                        </p>
                        <Button className="btn-gradient">
                           <Plus className="h-4 w-4 mr-2" />
                           Create Content
                        </Button>
                     </div>
                  )}
               </CardContent>
            </Card>
         </div>
         <EditContentDialog
            open={!!editingContent}
            onOpenChange={() => setEditingContent(null)}
            contentItem={editingContent}
            onSave={handleSave}
         />
         <ScheduleDialog
            open={isScheduleModalOpen}
            onOpenChange={setIsScheduleModalOpen}
            post={selectedPostForSchedule}
            onConfirmSchedule={handleConfirmSchedule}
         />
      </>
   );
}
