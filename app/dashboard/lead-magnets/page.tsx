'use client';

import { useState } from 'react';
import {
   Target,
   Upload,
   Download,
   Eye,
   Edit,
   Trash2,
   Plus,
   Search,
   Filter,
   BarChart3,
   Users,
   FileText,
   Image as ImageIcon,
   Video,
   Link,
   Copy,
   Share,
   Loader
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
   Select,
   SelectContent,
   SelectItem,
   SelectTrigger,
   SelectValue,
} from "@/components/ui/select"
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';

interface LeadMagnet {
  id: number;
  title: string;
  description: string;
  type: string;
  file_size?: string;
  pages?: number;
  downloads?: number;
  conversion_rate?: number;
  created_date: string;
  status: string;
  thumbnail?: string;
  tags: string[];
  duration?: string;
  files?: number;
}

const leadMagnetStats = {
   total_downloads: 3196,
   avg_conversion_rate: 10.6,
   total_leads: 2847,
   active_magnets: 3
};

export default function LeadMagnets() {
   const queryClient = useQueryClient();
   const { toast } = useToast();
   const [searchQuery, setSearchQuery] = useState('');
   const [selectedType, setSelectedType] = useState('all');
   const [showCreateDialog, setShowCreateDialog] = useState(false);
   const [newMagnet, setNewMagnet] = useState({
      title: '',
      description: '',
      type: 'pdf',
      tags: ''
   });

   const { data: leadMagnets, isLoading, isError } = useQuery<LeadMagnet[]>({
      queryKey: ['leadMagnets'],
      queryFn: async () => {
         const response = await fetch('/api/lead-magnets');
         if (!response.ok) {
            throw new Error('Failed to fetch lead magnets');
         }
         return response.json();
      },
   });

   const createLeadMagnetMutation = useMutation({
      mutationFn: async (item: Omit<LeadMagnet, 'id'>) => {
         const response = await fetch('/api/lead-magnets', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(item),
         });
         if (!response.ok) {
            throw new Error('Failed to create lead magnet');
         }
         return response.json();
      },
      onSuccess: () => {
         queryClient.invalidateQueries({ queryKey: ['leadMagnets'] });
         toast({ title: 'Lead magnet created!', description: 'Your new lead magnet has been added.' });
         setShowCreateDialog(false);
         setNewMagnet({ title: '', description: '', type: 'pdf', tags: '' });
      },
      onError: (error) => {
         toast({ title: 'Error', description: `Failed to create lead magnet: ${error.message}`, variant: 'destructive' });
      },
   });

   const deleteLeadMagnetMutation = useMutation({
      mutationFn: async (id: number) => {
         const response = await fetch(`/api/lead-magnets`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id }),
         });
         if (!response.ok) {
            throw new Error('Failed to delete lead magnet');
         }
      },
      onSuccess: () => {
         queryClient.invalidateQueries({ queryKey: ['leadMagnets'] });
         toast({ title: 'Lead magnet deleted!', description: 'The lead magnet has been removed.' });
      },
      onError: (error) => {
         toast({ title: 'Error', description: `Failed to delete lead magnet: ${error.message}`, variant: 'destructive' });
      },
   });

   const handleCreateLeadMagnet = () => {
    createLeadMagnetMutation.mutate({
        ...newMagnet,
        tags: newMagnet.tags.split(',').map(tag => tag.trim()),
        created_date: new Date().toISOString(),
        status: 'active',
        downloads: 0,
        conversion_rate: 0,
    });
   }

   const getTypeIcon = (type) => {
      switch (type) {
         case 'pdf': return FileText;
         case 'video': return Video;
         case 'image': return ImageIcon;
         case 'zip': return FileText;
         default: return FileText;
      }
   };

   const getStatusColor = (status) => {
      switch (status) {
         case 'active': return 'bg-green-600';
         case 'draft': return 'bg-yellow-600';
         case 'archived': return 'bg-slate-600';
         default: return 'bg-slate-600';
      }
   };

   const filteredMagnets = leadMagnets?.filter(magnet => {
      const matchesSearch = magnet.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
         magnet.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
         (magnet.tags && magnet.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())));
      const matchesType = selectedType === 'all' || magnet.type === selectedType;
      return matchesSearch && matchesType;
   }) || [];

    if (isLoading) {
      return (
         <div className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex justify-center items-center min-h-[calc(100vh-100px)]">
            <Loader className="h-12 w-12 animate-spin text-primary" />
         </div>
      );
   }

   if (isError) {
      return (
         <div className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center text-red-500">
            <h2 className="text-2xl font-bold">Error loading lead magnets</h2>
            <p>Please try again later.</p>
         </div>
      );
   }

   return (
      <div className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
         <div className="mb-8">
            <div className="flex items-center justify-between">
               <div>
                  <h1 className="text-3xl font-bold     mb-2">Lead Magnets</h1>
                  <p className="   ">
                     Create and manage valuable resources to grow your audience
                  </p>
               </div>
               <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
                  <DialogTrigger asChild>
                     <Button className="btn-gradient">
                        <Plus className="h-4 w-4 mr-2" />
                        Create Lead Magnet
                     </Button>
                  </DialogTrigger>
                  <DialogContent className="  border-border max-w-2xl">
                     <DialogHeader>
                        <DialogTitle  >Create New Lead Magnet</DialogTitle>
                        <DialogDescription>
                           Upload or create a valuable resource to attract and convert leads
                        </DialogDescription>
                     </DialogHeader>
                     <div className="space-y-4">
                        <div>
                           <Label htmlFor="title"  >Title</Label>
                           <Input
                              id="title"
                              value={newMagnet.title}
                              onChange={(e) => setNewMagnet({ ...newMagnet, title: e.target.value })}
                              placeholder="e.g., Ultimate AI Productivity Guide"
                              className="   border-border    "
                           />
                        </div>

                        <div>
                           <Label htmlFor="description"  >Description</Label>
                           <Textarea
                              id="description"
                              value={newMagnet.description}
                              onChange={(e) => setNewMagnet({ ...newMagnet, description: e.target.value })}
                              placeholder="Describe what value this lead magnet provides..."
                              rows={3}
                              className="   border-border    "
                           />
                        </div>

                        <div>
                           <Label  >Type</Label>
                           <Select
                              value={newMagnet.type}
                              onValueChange={(value) => setNewMagnet({ ...newMagnet, type: value })}
                           >
                              <SelectTrigger>
                                 <SelectValue placeholder="Select Type" />
                              </SelectTrigger>
                              <SelectContent>
                                 <SelectItem value="pdf">PDF Document</SelectItem>
                                 <SelectItem value="video">Video</SelectItem>
                                 <SelectItem value="zip">Template Pack</SelectItem>
                                 <SelectItem value="image">Image/Infographic</SelectItem>
                              </SelectContent>
                           </Select>
                        </div>

                        <div>
                           <Label  >Upload File</Label>
                           <div className="border-2 border-dashed  border-border rounded-lg p-6 text-center mt-2">
                              <Upload className="h-8 w-8     mx-auto mb-2" />
                              <p className="text-muted-foreground mb-1">Drag and drop your file here, or click to browse</p>
                              <p className="text-xs text-muted-foreground">Supports: PDF, MP4, ZIP, JPG, PNG up to 50MB</p>
                              <Button variant="outline" className="mt-3">
                                 Choose File
                              </Button>
                           </div>
                        </div>

                        <div>
                           <Label htmlFor="tags"  >Tags (comma separated)</Label>
                           <Input
                              id="tags"
                              value={newMagnet.tags}
                              onChange={(e) => setNewMagnet({ ...newMagnet, tags: e.target.value })}
                              placeholder="e.g., AI, productivity, guide, free"
                              className="   border-border    "
                           />
                        </div>

                        <div className="flex space-x-3 pt-4">
                           <Button
                              variant="outline"
                              className="flex-1"
                              onClick={() => setShowCreateDialog(false)}
                           >
                              Cancel
                           </Button>
                           <Button className="flex-1     hover:bg-purple-700" onClick={handleCreateLeadMagnet} disabled={createLeadMagnetMutation.isLoading}>
                              {createLeadMagnetMutation.isLoading ? 'Creating...' : 'Create Lead Magnet'}
                           </Button>
                        </div>
                     </div>
                  </DialogContent>
               </Dialog>
            </div>
         </div>

         {/* Stats Cards */}
         <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card  >
               <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                     <div>
                        <p className="text-sm font-medium    ">Total Downloads</p>
                        <p className="text-2xl font-bold    ">{leadMagnetStats.total_downloads.toLocaleString()}</p>
                     </div>
                     <Download className="h-8 w-8 text-blue-400" />
                  </div>
               </CardContent>
            </Card>

            <Card  >
               <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                     <div>
                        <p className="text-sm font-medium    ">Avg Conversion</p>
                        <p className="text-2xl font-bold    ">{leadMagnetStats.avg_conversion_rate}%</p>
                     </div>
                     <Target className="h-8 w-8 text-green-400" />
                  </div>
               </CardContent>
            </Card>

            <Card  >
               <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                     <div>
                        <p className="text-sm font-medium    ">Total Leads</p>
                        <p className="text-2xl font-bold    ">{leadMagnetStats.total_leads.toLocaleString()}</p>
                     </div>
                     <Users className="h-8 w-8 text-purple-400" />
                  </div>
               </CardContent>
            </Card>

            <Card  >
               <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                     <div>
                        <p className="text-sm font-medium    ">Active Magnets</p>
                        <p className="text-2xl font-bold    ">{leadMagnets?.length || 0}</p>
                     </div>
                     <BarChart3 className="h-8 w-8 text-orange-400" />
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
                        placeholder="Search lead magnets..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10    border-border    "
                     />
                  </div>
                  <div className="flex items-center space-x-2">
                     <Select value={selectedType} onValueChange={setSelectedType}>
                        <SelectTrigger>
                           <SelectValue placeholder="Select Type" />
                        </SelectTrigger>
                        <SelectContent>
                           <SelectItem value="all">All Types</SelectItem>
                           <SelectItem value="pdf">PDF</SelectItem>
                           <SelectItem value="video">Video</SelectItem>
                           <SelectItem value="zip">Templates</SelectItem>
                           <SelectItem value="image">Images</SelectItem>
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

         {/* Lead Magnets Grid */}
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMagnets.map((magnet) => {
               const TypeIcon = getTypeIcon(magnet.type);
               return (
                  <Card key={magnet.id} className="  group hover: border-border transition-colors">
                     <CardContent className="p-0">
                        {/* Thumbnail */}
                        <div className="relative aspect-video   rounded-t-lg overflow-hidden">
                           <img
                              src={magnet.thumbnail}
                              alt={magnet.title}
                              className="w-full h-full object-cover"
                           />
                           <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-2">
                              <Button size="sm" variant="secondary">
                                 <Eye className="h-4 w-4" />
                              </Button>
                              <Button size="sm" variant="secondary">
                                 <Download className="h-4 w-4" />
                              </Button>
                              <Button size="sm" variant="secondary">
                                 <Share className="h-4 w-4" />
                              </Button>
                           </div>

                           {/* Type Badge */}
                           <div className="absolute top-2 left-2">
                              <Badge className="bg-black/70    ">
                                 <TypeIcon className="h-3 w-3 mr-1" />
                                 {magnet.type.toUpperCase()}
                              </Badge>
                           </div>

                           {/* Status Badge */}
                           <div className="absolute top-2 right-2">
                              <Badge className={getStatusColor(magnet.status)}>
                                 {magnet.status}
                              </Badge>
                           </div>
                        </div>

                        {/* Content */}
                        <div className="p-6">
                           <h3 className="text-lg font-medium     mb-2">{magnet.title}</h3>
                           <p className="text-sm     mb-4">{magnet.description}</p>

                           {/* Stats */}
                           <div className="grid grid-cols-2 gap-4 mb-4">
                              <div className="text-center">
                                 <div className="text-lg font-semibold    ">{magnet.downloads}</div>
                                 <div className="text-xs    ">Downloads</div>
                              </div>
                              <div className="text-center">
                                 <div className="text-lg font-semibold text-green-400">{magnet.conversion_rate}%</div>
                                 <div className="text-xs    ">Conversion</div>
                              </div>
                           </div>

                           {/* File Info */}
                           <div className="flex items-center justify-between text-xs     mb-4">
                              <span>{magnet.file_size}</span>
                              <span>
                                 {magnet.pages && `${magnet.pages} pages`}
                                 {magnet.duration && magnet.duration}
                                 {magnet.files && `${magnet.files} files`}
                              </span>
                           </div>

                           {/* Tags */}
                           <div className="flex flex-wrap gap-1 mb-4">
                              {magnet.tags.slice(0, 3).map((tag) => (
                                 <Badge key={tag} variant="outline" className="text-xs">
                                    #{tag}
                                 </Badge>
                              ))}
                              {magnet.tags.length > 3 && (
                                 <Badge variant="outline" className="text-xs">
                                    +{magnet.tags.length - 3}
                                 </Badge>
                              )}
                           </div>

                           {/* Actions */}
                           <div className="flex space-x-2">
                              <Button size="sm" variant="outline" className="flex-1">
                                 <Edit className="h-4 w-4 mr-1" />
                                 Edit
                              </Button>
                              <Button size="sm" variant="outline" className="flex-1">
                                 <Copy className="h-4 w-4 mr-1" />
                                 Copy Link
                              </Button>
                              <Button size="sm" variant="outline" className="text-red-400 hover:text-red-300" onClick={() => deleteLeadMagnetMutation.mutate(magnet.id)} disabled={deleteLeadMagnetMutation.isLoading}>
                                 <Trash2 className="h-4 w-4" />
                              </Button>
                           </div>

                           {/* Created Date */}
                           <div className="text-xs text-muted-foreground mt-3 text-center">
                              Created {new Date(magnet.created_date).toLocaleDateString()}
                           </div>
                        </div>
                     </CardContent>
                  </Card>
               );
            })}
         </div>

         {/* Empty State */}
         {filteredMagnets.length === 0 && (
            <Card  >
               <CardContent className="p-12 text-center">
                  <Target className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-xl font-medium     mb-2">No lead magnets found</h3>
                  <p className="    mb-6">
                     {searchQuery ? 'Try adjusting your search criteria' : 'Create your first lead magnet to start capturing leads'}
                  </p>
                  <Button className="    hover:bg-purple-700" onClick={() => setShowCreateDialog(true)}>
                     <Plus className="h-4 w-4 mr-2" />
                     Create Lead Magnet
                  </Button>
               </CardContent>
            </Card>
         )}
      </div>
   );
}
