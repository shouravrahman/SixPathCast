'use client';

import { useState, useEffect } from 'react';
import {
   Upload,
   Search,
   Filter,
   Grid3X3,
   List,
   FolderPlus,
   Image as ImageIcon,
   Video,
   FileText,
   Download,
   Trash2,
   Eye,
   Copy,
   Star, Wand2, Loader, Edit
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
   Select,
   SelectContent,
   SelectItem,
   SelectTrigger,
   SelectValue,
} from "@/components/ui/select";
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';

interface MediaItem {
   id: string;
   user_id: string;
   created_at: string;
   updated_at: string;
   name: string;
   type: 'image' | 'video' | 'document';
   url: string;
   file_path: string;
   size_bytes?: number;
   mime_type?: string;
   dimensions?: string;
   duration_seconds?: number;
   page_count?: number;
   folder?: string;
   tags?: string[];
   usage_count?: number;
   is_favorite?: boolean;
   is_ai_generated?: boolean;
}

const folders = [
   { name: 'All Media', count: 0, color: '' }, // Count will be dynamic
   { name: 'Hero Images', count: 0, color: '' },
   { name: 'Videos', count: 0, color: 'bg-red-500' },
   { name: 'Lead Magnets', count: 0, color: 'bg-green-500' },
   { name: 'Templates', count: 0, color: 'bg-yellow-500' },
   { name: 'Brand Assets', count: 0, color: 'bg-pink-500' },
   { name: 'Webinars', count: 0, color: 'bg-indigo-500' },
   { name: 'AI Generated', count: 0, color: 'bg-emerald-500' }
];

export default function MediaLibrary() {
   const queryClient = useQueryClient();
   const { toast } = useToast();

   const [viewMode, setViewMode] = useState('grid');
   const [selectedFolder, setSelectedFolder] = useState('All Media');
   const [searchQuery, setSearchQuery] = useState('');
   const [showUploadDialog, setShowUploadDialog] = useState(false);
   const [showAIGenerateDialog, setShowAIGenerateDialog] = useState(false);
   const [showEditDialog, setShowEditDialog] = useState(false);
   const [showDeleteDialog, setShowDeleteDialog] = useState(false);
   const [currentMediaItem, setCurrentMediaItem] = useState<MediaItem | null>(null);

   const [uploadingFile, setUploadingFile] = useState(false);
   const [newMediaItemData, setNewMediaItemData] = useState({
      name: '',
      folder: '',
      tags: '',
   });

   const { data: mediaItems, isLoading, isError } = useQuery<MediaItem[]>({
      queryKey: ['mediaItems'],
      queryFn: async () => {
         const response = await fetch('/api/media');
         if (!response.ok) {
            throw new Error('Failed to fetch media items');
         }
         return response.json();
      },
   });

   const createMediaItemMutation = useMutation({
      mutationFn: async (item: Omit<MediaItem, 'id' | 'user_id' | 'created_at' | 'updated_at' | 'usage_count' | 'is_favorite' | 'is_ai_generated'>) => {
         const response = await fetch('/api/media', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(item),
         });
         if (!response.ok) {
            throw new Error('Failed to create media item');
         }
         return response.json();
      },
      onSuccess: () => {
         queryClient.invalidateQueries({ queryKey: ['mediaItems'] });
         toast({ title: 'Media item added!', description: 'Your media has been successfully added to the library.' });
         setShowUploadDialog(false);
         setNewMediaItemData({ name: '', folder: '', tags: '' });
      },
      onError: (error) => {
         toast({ title: 'Error', description: `Failed to add media item: ${error.message}`, variant: 'destructive' });
      },
   });

   const updateMediaItemMutation = useMutation({
      mutationFn: async (item: Partial<MediaItem>) => {
         const response = await fetch(`/api/media/${item.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(item),
         });
         if (!response.ok) {
            throw new Error('Failed to update media item');
         }
         return response.json();
      },
      onSuccess: () => {
         queryClient.invalidateQueries({ queryKey: ['mediaItems'] });
         toast({ title: 'Media item updated!', description: 'Media item details have been saved.' });
         setShowEditDialog(false);
         setCurrentMediaItem(null);
      },
      onError: (error) => {
         toast({ title: 'Error', description: `Failed to update media item: ${error.message}`, variant: 'destructive' });
      },
   });

   const deleteMediaItemMutation = useMutation({
      mutationFn: async (id: string) => {
         const response = await fetch(`/api/media/${id}`, {
            method: 'DELETE',
         });
         if (!response.ok) {
            throw new Error('Failed to delete media item');
         }
      },
      onSuccess: () => {
         queryClient.invalidateQueries({ queryKey: ['mediaItems'] });
         toast({ title: 'Media item deleted!', description: 'The media item has been removed.' });
         setShowDeleteDialog(false);
         setCurrentMediaItem(null);
      },
      onError: (error) => {
         toast({ title: 'Error', description: `Failed to delete media item: ${error.message}`, variant: 'destructive' });
      },
   });

   const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) return;

      setUploadingFile(true);

      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', newMediaItemData.folder || 'general');

      try {
         const uploadResponse = await fetch('/api/upload', {
            method: 'POST',
            body: formData,
         });

         if (!uploadResponse.ok) {
            throw new Error('Upload failed');
         }

         const uploadData = await uploadResponse.json();
         const publicUrl = uploadData.url;

         // Determine file type and other metadata
         let type: MediaItem['type'] = 'document';
         let mime_type = file.type;
         let dimensions: string | undefined;
         let duration_seconds: number | undefined;
         let page_count: number | undefined;

         if (file.type.startsWith('image/')) {
            type = 'image';
            // For dimensions, you'd typically read the image data, but that's complex client-side.
            // For now, we'll leave it undefined or get it from a backend processing step.
         } else if (file.type.startsWith('video/')) {
            type = 'video';
            // Similar to dimensions, duration would need media processing.
         }

         const itemToCreate: Omit<MediaItem, 'id' | 'user_id' | 'created_at' | 'updated_at' | 'usage_count' | 'is_favorite' | 'is_ai_generated'> = {
            name: newMediaItemData.name || file.name,
            type: type,
            url: publicUrl,
            file_path: `${newMediaItemData.folder || 'general'}/${file.name}`, // This should match the backend's file path generation
            size_bytes: file.size,
            mime_type: mime_type,
            folder: newMediaItemData.folder || 'general',
            tags: newMediaItemData.tags ? newMediaItemData.tags.split(',').map(tag => tag.trim()) : [],
            dimensions: dimensions,
            duration_seconds: duration_seconds,
            page_count: page_count,
         };

         createMediaItemMutation.mutate(itemToCreate);

      } catch (error: any) {
         toast({ title: 'Upload Error', description: `Failed to upload file: ${error.message}`, variant: 'destructive' });
      } finally {
         setUploadingFile(false);
      }
   };

   const getTypeIcon = (type: string) => {
      switch (type) {
         case 'image': return ImageIcon;
         case 'video': return Video;
         case 'document': return FileText;
         default: return FileText;
      }
   };

   const filteredItems = mediaItems?.filter(item => {
      const matchesFolder = selectedFolder === 'All Media' || item.folder === selectedFolder;
      const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
         item.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())) || false;
      return matchesFolder && matchesSearch;
   }) || [];

   const getInitials = (name: string) => {
      const names = name.split(' ');
      if (names.length > 1) {
         return names[0][0] + names[names.length - 1][0];
      }
      return name.substring(0, 2).toUpperCase();
   };

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
            <h2 className="text-2xl font-bold">Error loading media library</h2>
            <p>Please try again later.</p>
         </div>
      );
   }

   return (
      <div className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
         <div className="mb-8">
            <div className="flex items-center justify-between">
               <div>
                  <h1 className="text-3xl font-bold mb-2">Media Library</h1>
                  <p>
                     Organize and manage all your content assets in one place
                  </p>
               </div>
               <div className="flex space-x-3">
                  <Dialog open={showAIGenerateDialog} onOpenChange={setShowAIGenerateDialog}>
                     <DialogTrigger asChild>
                        <Button className="btn-gradient">
                           <Wand2 className="h-4 w-4 mr-2" />
                           AI Generate
                        </Button>
                     </DialogTrigger>
                     <DialogContent className="border-border">
                        <DialogHeader>
                           <DialogTitle>Generate AI Image</DialogTitle>
                           <DialogDescription>
                              Create custom images using AI for your content
                           </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                           <div>
                              <Label htmlFor="prompt">Image Prompt</Label>
                              <Textarea
                                 id="prompt"
                                 placeholder="Describe the image you want to generate..."
                                 rows={3}
                              />
                           </div>
                           <div className="grid grid-cols-2 gap-4">
                              <div>
                                 <Label>Style</Label>
                                 <Select>
                                    <SelectTrigger>
                                       <SelectValue placeholder="Select Style" />
                                    </SelectTrigger>
                                    <SelectContent>
                                       <SelectItem value="photorealistic">Photorealistic</SelectItem>
                                       <SelectItem value="illustration">Illustration</SelectItem>
                                       <SelectItem value="digital-art">Digital Art</SelectItem>
                                       <SelectItem value="minimalist">Minimalist</SelectItem>
                                    </SelectContent>
                                 </Select>
                              </div>
                              <div>
                                 <Label>Aspect Ratio</Label>
                                 <Select>
                                    <SelectTrigger>
                                       <SelectValue placeholder="Select Aspect Ratio" />
                                    </SelectTrigger>
                                    <SelectContent>
                                       <SelectItem value="16:9">16:9 (Landscape)</SelectItem>
                                       <SelectItem value="1:1">1:1 (Square)</SelectItem>
                                       <SelectItem value="9:16">9:16 (Portrait)</SelectItem>
                                       <SelectItem value="4:3">4:3 (Standard)</SelectItem>
                                    </SelectContent>
                                 </Select>
                              </div>
                           </div>
                           <Button className="w-full">
                              Generate Image
                           </Button>
                        </div>
                     </DialogContent>
                  </Dialog>

                  <Dialog open={showUploadDialog} onOpenChange={setShowUploadDialog}>
                     <DialogTrigger asChild>
                        <Button variant="outline">
                           <Upload className="h-4 w-4 mr-2" />
                           Upload
                        </Button>
                     </DialogTrigger>
                     <DialogContent>
                        <DialogHeader>
                           <DialogTitle>Upload Media</DialogTitle>
                           <DialogDescription>
                              Upload images, videos, or documents to your media library
                           </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                           <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
                              {uploadingFile ? (
                                 <Loader className="h-12 w-12 mx-auto mb-4 animate-spin" />
                              ) : (
                                 <Upload className="h-12 w-12 mx-auto mb-4" />
                              )}
                              <p className="text-muted-foreground mb-2">Drag and drop files here, or click to browse</p>
                              <p className="text-sm text-muted-foreground">Supports: JPG, PNG, MP4, PDF, up to 100MB</p>
                              <Label htmlFor="file-upload" className="mt-4 inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 cursor-pointer">
                                 Choose Files
                              </Label>
                              <Input
                                 id="file-upload"
                                 type="file"
                                 className="hidden"
                                 onChange={handleFileUpload}
                                 disabled={uploadingFile}
                              />
                           </div>
                           <div>
                              <Label htmlFor="media-name">Media Name</Label>
                              <Input
                                 id="media-name"
                                 value={newMediaItemData.name}
                                 onChange={(e) => setNewMediaItemData({ ...newMediaItemData, name: e.target.value })}
                                 placeholder="e.g., My Awesome Image"
                              />
                           </div>
                           <div>
                              <Label htmlFor="folder">Folder</Label>
                              <Select
                                 value={newMediaItemData.folder}
                                 onValueChange={(value) => setNewMediaItemData({ ...newMediaItemData, folder: value })}
                              >
                                 <SelectTrigger>
                                    <SelectValue placeholder="Select Folder" />
                                 </SelectTrigger>
                                 <SelectContent>
                                    {folders.slice(1).map((folder) => (
                                       <SelectItem key={folder.name} value={folder.name}>
                                          {folder.name}
                                       </SelectItem>
                                    ))}
                                 </SelectContent>
                              </Select>
                           </div>
                           <div>
                              <Label htmlFor="tags">Tags (comma separated)</Label>
                              <Input
                                 id="tags"
                                 value={newMediaItemData.tags}
                                 onChange={(e) => setNewMediaItemData({ ...newMediaItemData, tags: e.target.value })}
                                 placeholder="e.g., social media, hero, brand"
                              />
                           </div>
                        </div>
                        <DialogFooter className="mt-6">
                           <Button
                              variant="outline"
                              onClick={() => setShowUploadDialog(false)}
                              disabled={uploadingFile || createMediaItemMutation.isLoading}
                           >
                              Cancel
                           </Button>
                           <Button
                              onClick={() => {
                                 // This button is primarily for closing the dialog after file selection and metadata input
                                 // The actual upload and creation is triggered by handleFileUpload
                                 setShowUploadDialog(false);
                              }}
                              disabled={uploadingFile || createMediaItemMutation.isLoading}
                           >
                              Done
                           </Button>
                        </DialogFooter>
                     </DialogContent>
                  </Dialog>

                  {/* Edit Media Dialog */}
                  <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
                     <DialogContent className="max-w-md">
                        <DialogHeader>
                           <DialogTitle>Edit Media Item</DialogTitle>
                           <DialogDescription>
                              Update the details of your media item.
                           </DialogDescription>
                        </DialogHeader>
                        {currentMediaItem && (
                           <div className="space-y-4">
                              <div>
                                 <Label htmlFor="edit-name">Name</Label>
                                 <Input
                                    id="edit-name"
                                    value={currentMediaItem.name}
                                    onChange={(e) => setCurrentMediaItem({ ...currentMediaItem, name: e.target.value })}
                                 />
                              </div>
                              <div>
                                 <Label htmlFor="edit-folder">Folder</Label>
                                 <Select
                                    value={currentMediaItem.folder}
                                    onValueChange={(value) => setCurrentMediaItem({ ...currentMediaItem, folder: value })}
                                 >
                                    <SelectTrigger>
                                       <SelectValue placeholder="Select Folder" />
                                    </SelectTrigger>
                                    <SelectContent>
                                       {folders.slice(1).map((folder) => (
                                          <SelectItem key={folder.name} value={folder.name}>
                                             {folder.name}
                                          </SelectItem>
                                       ))}
                                    </SelectContent>
                                 </Select>
                              </div>
                              <div>
                                 <Label htmlFor="edit-tags">Tags (comma separated)</Label>
                                 <Input
                                    id="edit-tags"
                                    value={currentMediaItem.tags?.join(', ') || ''}
                                    onChange={(e) => setCurrentMediaItem({ ...currentMediaItem, tags: e.target.value.split(',').map(tag => tag.trim()) })}
                                 />
                              </div>
                              <div className="flex items-center space-x-2">
                                 <input
                                    type="checkbox"
                                    id="edit-favorite"
                                    checked={currentMediaItem.is_favorite}
                                    onChange={(e) => setCurrentMediaItem({ ...currentMediaItem, is_favorite: e.target.checked })}
                                    className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                                 />
                                 <Label htmlFor="edit-favorite">Favorite</Label>
                              </div>
                           </div>
                        )}
                        <DialogFooter className="mt-6">
                           <Button
                              variant="outline"
                              onClick={() => setShowEditDialog(false)}
                              disabled={updateMediaItemMutation.isLoading}
                           >
                              Cancel
                           </Button>
                           <Button
                              onClick={() => currentMediaItem && updateMediaItemMutation.mutate(currentMediaItem)}
                              disabled={updateMediaItemMutation.isLoading}
                           >
                              {updateMediaItemMutation.isLoading ? 'Saving...' : 'Save Changes'}
                           </Button>
                        </DialogFooter>
                     </DialogContent>
                  </Dialog>

                  {/* Delete Media Dialog */}
                  <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                     <DialogContent>
                        <DialogHeader>
                           <DialogTitle>Are you absolutely sure?</DialogTitle>
                           <DialogDescription>
                              This action cannot be undone. This will permanently delete your media item and its associated file.
                           </DialogDescription>
                        </DialogHeader>
                        <DialogFooter>
                           <Button
                              variant="outline"
                              onClick={() => setShowDeleteDialog(false)}
                              disabled={deleteMediaItemMutation.isLoading}
                           >
                              Cancel
                           </Button>
                           <Button
                              variant="destructive"
                              onClick={() => currentMediaItem && deleteMediaItemMutation.mutate(currentMediaItem.id)}
                              disabled={deleteMediaItemMutation.isLoading}
                           >
                              {deleteMediaItemMutation.isLoading ? 'Deleting...' : 'Delete'}
                           </Button>
                        </DialogFooter>
                     </DialogContent>
                  </Dialog>
               </div>
            </div>
         </div>

         <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar */}
            <div className="space-y-6">
               {/* Folders */}
               <Card>
                  <CardHeader>
                     <div className="flex items-center justify-between">
                        <CardTitle>Folders</CardTitle>
                        <Button size="sm" variant="ghost">
                           <FolderPlus className="h-4 w-4" />
                        </Button>
                     </div>
                  </CardHeader>
                  <CardContent>
                     <div className="space-y-2">
                        {folders.map((folder) => (
                           <button
                              key={folder.name}
                              onClick={() => setSelectedFolder(folder.name)}
                              className={`w-full flex items-center justify-between p-2 rounded-lg text-left transition-colors ${selectedFolder === folder.name
                                 ? 'bg-muted text-primary'
                                 : 'text-muted-foreground hover:bg-muted/50'
                                 }`}
                           >
                              <div className="flex items-center space-x-3">
                                 {/* <div className={`w-3 h-3 rounded-full ${folder.color}`}></div> */}
                                 <span className="text-sm">{folder.name}</span>
                              </div>
                              <span className="text-xs text-muted-foreground">{folder.count}</span>
                           </button>
                        ))}
                     </div>
                  </CardContent>
               </Card>

               {/* Quick Stats */}
               <Card>
                  <CardHeader>
                     <CardTitle>Storage</CardTitle>
                  </CardHeader>
                  <CardContent>
                     <div className="space-y-3">
                        <div className="flex justify-between text-sm">
                           <span>Used</span>
                           <span>{formatBytes(mediaItems?.reduce((sum, item) => sum + (item.size_bytes || 0), 0) || 0)} / 10 GB</span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2">
                           <div className="bg-primary h-2 rounded-full" style={{ width: `${((mediaItems?.reduce((sum, item) => sum + (item.size_bytes || 0), 0) || 0) / (10 * 1024 * 1024 * 1024)) * 100}%` }}></div>
                        </div>
                        <div className="grid grid-cols-2 gap-4 pt-2">
                           <div className="text-center">
                              <div className="text-lg font-semibold">{mediaItems?.length || 0}</div>
                              <div className="text-xs text-muted-foreground">Total Files</div>
                           </div>
                           <div className="text-center">
                              <div className="text-lg font-semibold">{mediaItems?.filter(item => item.is_ai_generated).length || 0}</div>
                              <div className="text-xs text-muted-foreground">AI Generated</div>
                           </div>
                        </div>
                     </div>
                  </CardContent>
               </Card>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3 space-y-6">
               {/* Search and Filters */}
               <Card>
                  <CardContent className="p-4">
                     <div className="flex items-center justify-between space-x-4">
                        <div className="flex-1 relative">
                           <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                           <Input
                              placeholder="Search media..."
                              value={searchQuery}
                              onChange={(e) => setSearchQuery(e.target.value)}
                              className="pl-10"
                           />
                        </div>
                        <div className="flex items-center space-x-2">
                           <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setViewMode('grid')}
                              className={viewMode === 'grid' ? 'bg-muted' : ''}
                           >
                              <Grid3X3 className="h-4 w-4" />
                           </Button>
                           <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setViewMode('list')}
                              className={viewMode === 'list' ? 'bg-muted' : ''}
                           >
                              <List className="h-4 w-4" />
                           </Button>
                           <Button variant="outline" size="sm">
                              <Filter className="h-4 w-4" />
                           </Button>
                        </div>
                     </div>
                  </CardContent>
               </Card>

               {/* Media Grid/List */}
               <Card>
                  <CardContent className="p-6">
                     {filteredItems.length > 0 ? (
                        viewMode === 'grid' ? (
                           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                              {filteredItems.map((item) => {
                                 const TypeIcon = getTypeIcon(item.type);
                                 return (
                                    <div
                                       key={item.id}
                                       className="group relative bg-muted/30 rounded-lg overflow-hidden hover:bg-muted/50 transition-colors"
                                    >
                                       {/* Media Preview */}
                                       <div className="aspect-video relative">
                                          {item.type === 'image' ? (
                                             <img
                                                src={item.url}
                                                alt={item.name}
                                                className="w-full h-full object-cover"
                                             />
                                          ) : (
                                             <div className="flex items-center justify-center h-full">
                                                <TypeIcon className="h-12 w-12 text-muted-foreground" />
                                             </div>
                                          )}

                                          {/* Overlay Actions */}
                                          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-2">
                                             <Button size="sm" variant="secondary" onClick={() => {
                                                setCurrentMediaItem(item);
                                                setShowEditDialog(true);
                                             }}>
                                                <Edit className="h-4 w-4" />
                                             </Button>
                                             <Button size="sm" variant="secondary">
                                                <Eye className="h-4 w-4" />
                                             </Button>
                                             <Button size="sm" variant="secondary">
                                                <Copy className="h-4 w-4" />
                                             </Button>
                                             <Button size="sm" variant="secondary" asChild>
                                                <a href={item.url} download={item.name} target="_blank" rel="noopener noreferrer">
                                                   <Download className="h-4 w-4" />
                                                </a>
                                             </Button>
                                             <Button size="sm" variant="destructive" onClick={() => {
                                                setCurrentMediaItem(item);
                                                setShowDeleteDialog(true);
                                             }}>
                                                <Trash2 className="h-4 w-4" />
                                             </Button>
                                          </div>

                                          {/* Favorite Star */}
                                          {item.is_favorite && (
                                             <Star className="absolute top-2 right-2 h-4 w-4 text-yellow-400 fill-current" />
                                          )}
                                       </div>

                                       {/* Media Info */}
                                       <div className="p-3">
                                          <h3 className="text-sm font-medium truncate">{item.name}</h3>
                                          <div className="flex items-center justify-between mt-1">
                                             <span className="text-xs text-muted-foreground">{formatBytes(item.size_bytes || 0)}</span>
                                             <Badge variant="secondary" className="text-xs">
                                                {item.usage_count || 0} uses
                                             </Badge>
                                          </div>
                                          <div className="flex flex-wrap gap-1 mt-2">
                                             {item.tags?.slice(0, 2).map((tag) => (
                                                <Badge key={tag} variant="outline" className="text-xs">
                                                   {tag}
                                                </Badge>
                                             ))}
                                          </div>
                                       </div>
                                    </div>
                                 );
                              })}
                           </div>
                        ) : (
                           <div className="space-y-2">
                              {filteredItems.map((item) => {
                                 const TypeIcon = getTypeIcon(item.type);
                                 return (
                                    <div
                                       key={item.id}
                                       className="flex items-center space-x-4 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
                                    >
                                       <div className="flex-shrink-0">
                                          {item.type === 'image' ? (
                                             <img
                                                src={item.url}
                                                alt={item.name}
                                                className="w-12 h-12 object-cover rounded"
                                             />
                                          ) : (
                                             <div className="w-12 h-12 bg-muted rounded flex items-center justify-center">
                                                <TypeIcon className="h-6 w-6 text-muted-foreground" />
                                             </div>
                                          )}
                                       </div>
                                       <div className="flex-1 min-w-0">
                                          <div className="flex items-center space-x-2">
                                             <h3 className="text-sm font-medium truncate">{item.name}</h3>
                                             {item.is_favorite && (
                                                <Star className="h-4 w-4 text-yellow-400 fill-current" />
                                             )}
                                          </div>
                                          <div className="flex items-center space-x-4 mt-1 text-xs text-muted-foreground">
                                             <span>{item.folder}</span>
                                             <span>{formatBytes(item.size_bytes || 0)}</span>
                                             <span>{new Date(item.created_at).toLocaleDateString()}</span>
                                             <Badge variant="secondary" className="text-xs">
                                                {item.usage_count || 0} uses
                                             </Badge>
                                          </div>
                                       </div>
                                       <div className="flex items-center space-x-2">
                                          <Button size="sm" variant="ghost" onClick={() => {
                                             setCurrentMediaItem(item);
                                             setShowEditDialog(true);
                                          }}>
                                             <Edit className="h-4 w-4" />
                                          </Button>
                                          <Button size="sm" variant="ghost">
                                             <Eye className="h-4 w-4" />
                                          </Button>
                                          <Button size="sm" variant="ghost">
                                             <Copy className="h-4 w-4" />
                                          </Button>
                                          <Button size="sm" variant="ghost" asChild>
                                             <a href={item.url} download={item.name} target="_blank" rel="noopener noreferrer">
                                                <Download className="h-4 w-4" />
                                             </a>
                                          </Button>
                                          <Button size="sm" variant="ghost" className="text-red-400" onClick={() => {
                                             setCurrentMediaItem(item);
                                             setShowDeleteDialog(true);
                                          }}>
                                             <Trash2 className="h-4 w-4" />
                                          </Button>
                                       </div>
                                    </div>
                                 );
                              })}
                           </div>
                        )
                     ) : (
                        <div className="p-12 text-center">
                           <ImageIcon className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                           <h3 className="text-xl font-medium mb-2">No media items found</h3>
                           <p className="mb-6">
                              {searchQuery || selectedFolder !== 'All Media' ? 'Try adjusting your search or filters' : 'Upload your first media item to get started'}
                           </p>
                           <Button onClick={() => setShowUploadDialog(true)}>
                              <Upload className="h-4 w-4 mr-2" />
                              Upload Media
                           </Button>
                        </div>
                     )}
                  </CardContent>
               </Card>
            </div>
         </div>
      </div>
   );
}