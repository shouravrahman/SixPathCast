'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Image from 'next/image';
import { Upload, Search, Loader, Image as ImageIcon, Video, FileText } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { Label } from '@/components/ui/label';
import {
   Select,
   SelectContent,
   SelectItem,
   SelectTrigger,
   SelectValue,
} from "@/components/ui/select";

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
   { name: 'All Media', count: 0, color: '' },
   { name: 'Hero Images', count: 0, color: '' },
   { name: 'Videos', count: 0, color: 'bg-red-500' },
   { name: 'Lead Magnets', count: 0, color: 'bg-green-500' },
   { name: 'Templates', count: 0, color: 'bg-yellow-500' },
   { name: 'Brand Assets', count: 0, color: 'bg-pink-500' },
   { name: 'Webinars', count: 0, color: 'bg-indigo-500' },
   { name: 'AI Generated', count: 0, color: 'bg-emerald-500' }
];

export default function MediaLibraryDialog({ open, onOpenChange, onSelectMedia }: { open: boolean; onOpenChange: (open: boolean) => void; onSelectMedia: (media: MediaItem) => void }) {
   const queryClient = useQueryClient();
   const { toast } = useToast();

   const [searchQuery, setSearchQuery] = useState('');
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
      enabled: open, // Only fetch when dialog is open
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
         setNewMediaItemData({ name: '', folder: '', tags: '' });
      },
      onError: (error) => {
         toast({ title: 'Error', description: `Failed to add media item: ${error.message}`, variant: 'destructive' });
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

         let type: MediaItem['type'] = 'document';
         let mime_type = file.type;
         if (file.type.startsWith('image/')) {
            type = 'image';
         } else if (file.type.startsWith('video/')) {
            type = 'video';
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
         };

         createMediaItemMutation.mutate(itemToCreate);

      } catch (error: any) {
         toast({ title: 'Upload Error', description: `Failed to upload file: ${error.message}`, variant: 'destructive' });
      } finally {
         setUploadingFile(false);
      }
   };

   const handleSelect = (media: MediaItem) => {
      onSelectMedia(media);
      onOpenChange(false);
   };

   const getTypeIcon = (type: string) => {
      switch (type) {
         case 'image': return ImageIcon;
         case 'video': return Video;
         case 'document': return FileText;
         default: return FileText;
      }
   };

   const filteredMediaItems = mediaItems?.filter(item =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())) || false
   ) || [];

   return (
      <Dialog open={open} onOpenChange={onOpenChange}>
         <DialogContent className="max-w-3xl">
            <DialogHeader>
               <DialogTitle>Media Library</DialogTitle>
            </DialogHeader>
            <Tabs defaultValue="library">
               <TabsList>
                  <TabsTrigger value="library">Library</TabsTrigger>
                  <TabsTrigger value="upload">Upload</TabsTrigger>
               </TabsList>
               <TabsContent value="library" className="mt-4">
                  <div className="relative mb-4">
                     <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                     <Input
                        placeholder="Search media..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10"
                     />
                  </div>
                  {isLoading ? (
                     <div className="flex justify-center items-center h-[500px]">
                        <Loader className="h-12 w-12 animate-spin text-primary" />
                     </div>
                  ) : isError ? (
                     <div className="flex justify-center items-center h-[500px] text-red-500">
                        Error loading media. Please try again.
                     </div>
                  ) : filteredMediaItems.length === 0 ? (
                     <div className="flex flex-col justify-center items-center h-[500px] text-muted-foreground">
                        <ImageIcon className="h-16 w-16 mb-4" />
                        <p>No media items found.</p>
                        <p>Go to the Upload tab to add new media.</p>
                     </div>
                  ) : (
                     <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 max-h-[500px] overflow-y-auto p-1">
                        {filteredMediaItems.map((item) => {
                           const TypeIcon = getTypeIcon(item.type);
                           return (
                              <div key={item.id} className="group relative bg-muted/30 rounded-lg overflow-hidden hover:bg-muted/50 transition-colors cursor-pointer" onClick={() => handleSelect(item)}>
                                 <div className="aspect-video relative">
                                    {item.type === 'image' ? (
                                       <Image
                                          src={item.url}
                                          alt={item.name}
                                          width={150}
                                          height={150}
                                          className="w-full h-full object-cover"
                                       />
                                    ) : (
                                       <div className="flex items-center justify-center h-full">
                                          <TypeIcon className="h-12 w-12 text-muted-foreground" />
                                       </div>
                                    )}
                                 </div>
                                 <div className="p-3">
                                    <h3 className="text-sm font-medium truncate">{item.name}</h3>
                                 </div>
                              </div>
                           );
                        })}
                     </div>
                  )}
               </TabsContent>
               <TabsContent value="upload" className="mt-4">
                  <div className="space-y-4">
                     <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
                        {uploadingFile ? (
                           <Loader className="h-12 w-12 mx-auto mb-4 animate-spin" />
                        ) : (
                           <Upload className="h-12 w-12 mx-auto mb-4" />
                        )}
                        <p className="text-muted-foreground mb-2">Drag and drop files here, or click to browse</p>
                        <p className="text-sm text-muted-foreground">Supports: JPG, PNG, MP4, PDF, up to 100MB</p>
                        <Label htmlFor="dialog-file-upload" className="mt-4 inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 cursor-pointer">
                           Choose Files
                        </Label>
                        <Input
                           id="dialog-file-upload"
                           type="file"
                           className="hidden"
                           onChange={handleFileUpload}
                           disabled={uploadingFile}
                        />
                     </div>
                     <div>
                        <Label htmlFor="dialog-media-name">Media Name</Label>
                        <Input
                           id="dialog-media-name"
                           value={newMediaItemData.name}
                           onChange={(e) => setNewMediaItemData({ ...newMediaItemData, name: e.target.value })}
                           placeholder="e.g., My Awesome Image"
                        />
                     </div>
                     <div>
                        <Label htmlFor="dialog-folder">Folder</Label>
                        <Select
                           value={newMediaItemData.folder}
                           onValueChange={(value) => setNewMediaItemData({ ...newMediaItemData, folder: value })}
                        >
                           <SelectTrigger id="dialog-folder">
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
                        <Label htmlFor="dialog-tags">Tags (comma separated)</Label>
                        <Input
                           id="dialog-tags"
                           value={newMediaItemData.tags}
                           onChange={(e) => setNewMediaItemData({ ...newMediaItemData, tags: e.target.value })}
                           placeholder="e.g., social media, hero, brand"
                        />
                     </div>
                  </div>
                  <DialogFooter className="mt-6">
                     <Button
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                        disabled={uploadingFile || createMediaItemMutation.isLoading}
                     >
                        Cancel
                     </Button>
                     <Button
                        onClick={() => {
                           // This button is primarily for closing the dialog after file selection and metadata input
                           // The actual upload and creation is triggered by handleFileUpload
                           onOpenChange(false);
                        }}
                        disabled={uploadingFile || createMediaItemMutation.isLoading}
                     >
                        Done
                     </Button>
                  </DialogFooter>
               </TabsContent>
            </Tabs>
         </DialogContent>
      </Dialog>
   );
}