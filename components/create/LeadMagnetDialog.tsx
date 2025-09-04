'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Upload, Search, Loader, FileText, Video, Image as ImageIcon } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

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

export default function LeadMagnetDialog({ open, onOpenChange, onSelectLeadMagnet }: { open: boolean; onOpenChange: (open: boolean) => void; onSelectLeadMagnet: (leadMagnet: any) => void }) {
   const queryClient = useQueryClient();
   const { toast } = useToast();
   const [selectedId, setSelectedId] = useState<string | undefined>(undefined);
   const [searchQuery, setSearchQuery] = useState('');
   const [uploadingFile, setUploadingFile] = useState(false);
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
      enabled: open, // Only fetch when dialog is open
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
         setNewMagnet({ title: '', description: '', type: 'pdf', tags: '' });
      },
      onError: (error) => {
         toast({ title: 'Error', description: `Failed to create lead magnet: ${error.message}`, variant: 'destructive' });
      },
   });

   const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) return;

      setUploadingFile(true);

      const formData = new FormData();
      formData.append('file', file);

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

         createLeadMagnetMutation.mutate({
            ...newMagnet,
            tags: newMagnet.tags.split(',').map(tag => tag.trim()),
            created_date: new Date().toISOString(),
            status: 'active',
            downloads: 0,
            conversion_rate: 0,
            thumbnail: publicUrl
         });

      } catch (error: any) {
         toast({ title: 'Upload Error', description: `Failed to upload file: ${error.message}`, variant: 'destructive' });
      } finally {
         setUploadingFile(false);
      }
   };

   const handleAttach = () => {
      const selectedLeadMagnet = leadMagnets?.find(lm => lm.id.toString() === selectedId);
      if (selectedLeadMagnet) {
         onSelectLeadMagnet(selectedLeadMagnet);
         onOpenChange(false);
      }
   };

   const getTypeIcon = (type) => {
      switch (type) {
         case 'pdf': return FileText;
         case 'video': return Video;
         case 'image': return ImageIcon;
         case 'zip': return FileText;
         default: return FileText;
      }
   };

   const filteredLeadMagnets = leadMagnets?.filter(magnet =>
      magnet.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      magnet.description.toLowerCase().includes(searchQuery.toLowerCase())
   ) || [];

   return (
      <Dialog open={open} onOpenChange={onOpenChange}>
         <DialogContent className="max-w-3xl">
            <DialogHeader>
               <DialogTitle>Attach Lead Magnet</DialogTitle>
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
                        placeholder="Search lead magnets..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10"
                     />
                  </div>
                  {isLoading ? (
                     <div className="flex justify-center items-center h-[400px]">
                        <Loader className="h-12 w-12 animate-spin text-primary" />
                     </div>
                  ) : isError ? (
                     <div className="flex justify-center items-center h-[400px] text-red-500">
                        Error loading lead magnets. Please try again.
                     </div>
                  ) : filteredLeadMagnets.length === 0 ? (
                     <div className="flex flex-col justify-center items-center h-[400px] text-muted-foreground">
                        <FileText className="h-16 w-16 mb-4" />
                        <p>No lead magnets found.</p>
                        <p>Go to the Upload tab to add a new lead magnet.</p>
                     </div>
                  ) : (
                     <RadioGroup value={selectedId} onValueChange={setSelectedId}>
                        <div className="space-y-4 max-h-[400px] overflow-y-auto p-1">
                           {filteredLeadMagnets.map((magnet) => {
                              const TypeIcon = getTypeIcon(magnet.type);
                              return (
                                 <Label key={magnet.id} htmlFor={magnet.id.toString()} className="flex items-start space-x-4 p-4 border border-border rounded-lg cursor-pointer hover:bg-muted/50">
                                    <RadioGroupItem value={magnet.id.toString()} id={magnet.id.toString()} />
                                    <div className="-mt-1 flex-1">
                                       <h4 className="font-semibold">{magnet.title}</h4>
                                       <p className="text-sm text-muted-foreground mt-1">{magnet.description}</p>
                                       <div className="flex items-center space-x-2 mt-2">
                                          <Badge variant="outline" className="text-xs">
                                             <TypeIcon className="h-3 w-3 mr-1" />
                                             {magnet.type.toUpperCase()}
                                          </Badge>
                                       </div>
                                    </div>
                                 </Label>
                              )
                           })}
                        </div>
                     </RadioGroup>
                  )}
                  <div className="flex justify-end space-x-2 pt-4">
                     <Button variant="ghost" onClick={() => onOpenChange(false)}>Cancel</Button>
                     <Button onClick={handleAttach} disabled={!selectedId}>Attach</Button>
                  </div>
               </TabsContent>
               <TabsContent value="upload" className="mt-4">
                  <div className="space-y-4">
                     <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
                        {uploadingFile ? (
                           <Loader className="h-12 w-12 mx-auto mb-4 animate-spin" />
                        ) : (
                           <Upload className="h-12 w-12 mx-auto mb-4" />
                        )}
                        <p className="text-muted-foreground mb-2">Drag and drop your file here, or click to browse</p>
                        <p className="text-sm text-muted-foreground">Supports: PDF, MP4, ZIP, JPG, PNG up to 50MB</p>
                        <Label htmlFor="lead-magnet-upload" className="mt-4 inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 cursor-pointer">
                           Choose File
                        </Label>
                        <Input
                           id="lead-magnet-upload"
                           type="file"
                           className="hidden"
                           onChange={handleFileUpload}
                           disabled={uploadingFile}
                        />
                     </div>
                     <div>
                        <Label htmlFor="title">Title</Label>
                        <Input
                           id="title"
                           value={newMagnet.title}
                           onChange={(e) => setNewMagnet({ ...newMagnet, title: e.target.value })}
                           placeholder="e.g., Ultimate AI Productivity Guide"
                        />
                     </div>
                     <div>
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                           id="description"
                           value={newMagnet.description}
                           onChange={(e) => setNewMagnet({ ...newMagnet, description: e.target.value })}
                           placeholder="Describe what value this lead magnet provides..."
                           rows={3}
                        />
                     </div>
                     <div>
                        <Label htmlFor="tags">Tags (comma separated)</Label>
                        <Input
                           id="tags"
                           value={newMagnet.tags}
                           onChange={(e) => setNewMagnet({ ...newMagnet, tags: e.target.value })}
                           placeholder="e.g., AI, productivity, guide, free"
                        />
                     </div>
                  </div>
                  <DialogFooter className="mt-6">
                     <Button
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                        disabled={uploadingFile || createLeadMagnetMutation.isLoading}
                     >
                        Cancel
                     </Button>
                     <Button
                        onClick={() => createLeadMagnetMutation.mutate({
                           ...newMagnet,
                           tags: newMagnet.tags.split(',').map(tag => tag.trim()),
                           created_date: new Date().toISOString(),
                           status: 'active',
                           downloads: 0,
                           conversion_rate: 0,
                        })}
                        disabled={uploadingFile || createLeadMagnetMutation.isLoading}
                     >
                        {createLeadMagnetMutation.isLoading ? 'Creating...' : 'Create & Attach'}
                     </Button>
                  </DialogFooter>
               </TabsContent>
            </Tabs>
         </DialogContent>
      </Dialog>
   );
}
