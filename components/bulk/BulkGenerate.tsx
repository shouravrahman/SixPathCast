'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Calendar, Edit, Trash2, Wand2, Bot, Sparkles, Download, Upload, Plus, FileDown } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import ScheduleDialog from '@/components/schedule/ScheduleDialog';
import EditContentDialog from '@/components/library/EditContentDialog';
import { useToast } from '@/hooks/use-toast';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import CampaignSelector from '../create/CampaignSelector';
import PlatformSelectorNew from '../create/PlatformSelectorNew';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SourceUpload } from '@/components/source/SourceUpload';
import useCalendarStore from '@/hooks/useCalendarStore';
import useMockDataStore from '@/hooks/useMockDataStore';

export default function BulkGenerate() {
   const { posts, addPost, updatePost, setPosts } = useCalendarStore();
   const { campaigns, tones } = useMockDataStore();
   const [contentGoal, setContentGoal] = useState('');
   const [selectedCampaign, setSelectedCampaign] = useState('');
   const [generatedTopics, setGeneratedTopics] = useState<string[]>([]);
   const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
   const [isGeneratingTopics, setIsGeneratingTopics] = useState(false);
   const [manualTopics, setManualTopics] = useState<string[]>(['']);
   const [topicSource, setTopicSource] = useState('ai-generate');

   const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
   const [selectedTargets, setSelectedTargets] = useState<any[]>([]);
   const [selectedPostTypes, setSelectedPostTypes] = useState<Record<string, string[]>>({});

   const [numPosts, setNumPosts] = useState(5);

   const [isGenerating, setIsGenerating] = useState(false);

   const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
   const [selectedPost, setSelectedPost] = useState<any>(null);
   const [isEditModalOpen, setIsEditModalOpen] = useState(false);
   const [selectedPostForEdit, setSelectedPostForEdit] = useState<any>(null);
   const { toast } = useToast();

   const addManualTopic = () => setManualTopics(prev => [...prev, '']);
   const removeManualTopic = (index: number) => setManualTopics(prev => prev.filter((_, i) => i !== index));
   const updateManualTopic = (index: number, value: string) => {
      setManualTopics(prev => prev.map((topic, i) => (i === index ? value : topic)));
   };

   const handleGenerateTopics = () => {
      if (!contentGoal) {
         toast({ title: "Please define your content goal first.", variant: "destructive" });
         return;
      }
      setIsGeneratingTopics(true);
      setTimeout(() => {
         const newTopics = [
            `The Future of AI in ${contentGoal}`,
            `How to Leverage AI for ${contentGoal}`,
            `Top 5 AI Tools for ${contentGoal}`,
         ];
         setGeneratedTopics(newTopics);
         setSelectedTopics(newTopics);
         setIsGeneratingTopics(false);
      }, 1500);
   };

   const handleTopicSelect = (topic: string) => {
      setSelectedTopics(prev =>
         prev.includes(topic) ? prev.filter(t => t !== topic) : [...prev, topic]
      );
   };

   const handleBulkGenerate = () => {
      let topicsToGenerate = [];
      if (topicSource === 'ai-generate') {
         topicsToGenerate = selectedTopics;
      } else if (topicSource === 'manual') {
         topicsToGenerate = manualTopics.filter(t => t.trim() !== '');
      } else if (topicSource === 'csv') {
         // Add logic to handle topics from CSV
         toast({ title: "CSV upload not implemented yet.", variant: "destructive" });
         return;
      }

      if (topicsToGenerate.length === 0) {
         toast({ title: "Please provide or select at least one topic.", variant: "destructive" });
         return;
      }
      if (selectedTargets.length === 0 || Object.values(selectedPostTypes).every(v => v.length === 0)) {
         toast({ title: "Please select at least one platform and post type.", variant: "destructive" });
         return;
      }

      setIsGenerating(true);
      toast({
         title: "Bulk Generation Started",
         description: "We're generating your content in the background. We will notify you when it's complete.",
      });

      setTimeout(() => {
         const newContent: any[] = [];
         topicsToGenerate.forEach(topic => {
            selectedTargets.forEach(target => {
               const postTypes = selectedPostTypes[target.id] || [];
               if (postTypes.length > 0) {
                  postTypes.forEach(postType => {
                     for (let i = 0; i < numPosts; i++) {
                        const newPost = {
                           id: Date.now() + newContent.length,
                           topic: topic,
                           campaign: selectedCampaign,
                           platform: target.name,
                           postType: postType,
                           content: `Generated ${postType} #${i + 1} for ${target.name} about "${topic}"`,
                           status: "draft",
                           scheduleDate: null,
                           creationType: "bulk",
                           likes: 0, comments: 0, shares: 0,
                        };
                        addPost(newPost);
                        newContent.push(newPost);
                     }
                  });
               }
            });
         });

         setIsGenerating(false);
         toast({
            title: "Bulk Generation Complete!",
            description: `${newContent.length} new posts have been added to your library.`,
            variant: "default",
         });
      }, 3000);
   };

   const handleExport = () => {
      const headers = ['Topic', 'Platform', 'Post Type', 'Content', 'Status', 'Schedule Date'];
      const rows = posts.map(item => [item.topic, item.platform, item.postType, item.content, item.status, item.scheduleDate]);
      const csvContent = "data:text/csv;charset=utf-8," + headers.join(",") + "\n" + rows.map(e => e.join(",")).join("\n");
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", "bulk_content.csv");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
   }

   const handleSchedule = (post: any) => {
      setSelectedPost(post);
      setIsScheduleModalOpen(true);
   };

   const handleConfirmSchedule = (post: any, scheduleDate: Date) => {
      if (post && scheduleDate) {
         updatePost({ ...post, status: 'scheduled', scheduleDate: scheduleDate.toISOString() });
      }
   };

   const handleEdit = (post: any) => {
      setSelectedPostForEdit(post);
      setIsEditModalOpen(true);
   };

   const handleSave = (updatedContent: string) => {
      updatePost({ ...selectedPostForEdit, content: updatedContent });
      setIsEditModalOpen(false);
      setSelectedPostForEdit(null);
   };

   const handleDelete = (id: number) => {
      const newPosts = posts.filter(p => p.id !== id);
      setPosts(newPosts);
   }

   const generatedContent = posts.filter(p => p.creationType === 'bulk');

   return (
      <div className="space-y-6">
         <Card  >
            <CardHeader>
               <CardTitle>Step 1: Provide Topics</CardTitle>
               <CardDescription>Start by giving us topics. Use our AI, input them manually, or upload a CSV.</CardDescription>
            </CardHeader>
            <CardContent>
               <Tabs defaultValue="ai-generate" onValueChange={setTopicSource} className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                     <TabsTrigger value="ai-generate">AI Topic Generation</TabsTrigger>
                     <TabsTrigger value="manual">Manual Entry</TabsTrigger>
                     <TabsTrigger value="csv">Import from CSV</TabsTrigger>
                  </TabsList>
                  <TabsContent value="ai-generate" className="space-y-4 pt-4">
                     <div className="space-y-2">
                        <Label htmlFor="content-goal" className="text-base font-medium">Content Goal or Theme</Label>
                        <Textarea
                           id="content-goal"
                           value={contentGoal}
                           onChange={(e) => setContentGoal(e.target.value)}
                           placeholder="e.g., Promote our new line of sustainable products..."
                           rows={3}
                        />
                     </div>
                     <Button onClick={handleGenerateTopics} disabled={isGeneratingTopics} className="w-full btn-gradient">
                        {isGeneratingTopics ? <Bot className="h-4 w-4 mr-2 animate-spin" /> : <Sparkles className="h-4 w-4 mr-2" />}
                        Generate Topic Ideas
                     </Button>
                     {generatedTopics.length > 0 && (
                        <div className="space-y-2">
                           <h3 className="font-semibold">Select topics to generate content for:</h3>
                           {generatedTopics.map((topic, index) => (
                              <div key={index} className="flex items-center space-x-3 rounded-md border p-3  ">
                                 <Checkbox
                                    id={`topic-${index}`}
                                    checked={selectedTopics.includes(topic)}
                                    onCheckedChange={() => handleTopicSelect(topic)}
                                 />
                                 <Label htmlFor={`topic-${index}`} className="font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex-grow cursor-pointer">
                                    {topic}
                                 </Label>
                              </div>
                           ))}
                        </div>
                     )}
                  </TabsContent>
                  <TabsContent value="manual" className="space-y-4 pt-4">
                     <Label className="text-base font-medium">Enter your topics manually</Label>
                     <div className="space-y-2">
                        {manualTopics.map((topic, index) => (
                           <div key={index} className="flex items-center space-x-2">
                              <Input
                                 value={topic}
                                 onChange={(e) => updateManualTopic(index, e.target.value)}
                                 placeholder={`Topic ${index + 1}...`}
                              />
                              {manualTopics.length > 1 && (
                                 <Button size="icon" variant="destructive" onClick={() => removeManualTopic(index)}>
                                    <Trash2 className="h-4 w-4" />
                                 </Button>
                              )}
                           </div>
                        ))}
                     </div>
                     <Button size="sm" variant="outline" onClick={addManualTopic}>
                        <Plus className="h-4 w-4 mr-2" />
                        Add Topic
                     </Button>
                  </TabsContent>
                  <TabsContent value="csv" className="space-y-4 pt-4">
                     <Card className="p-4 border-dashed border-border dark: /30  /50">
                        <div className="flex flex-col items-center space-y-2 text-center">
                           <Upload className="h-10 w-10    " />
                           <p className="text-sm text-muted-foreground">Drag & drop a CSV file here, or click to upload.</p>
                           <Button variant="outline" className="border-border hover: ">
                              <Upload className="h-4 w-4 mr-2" />
                              Upload File
                           </Button>
                           <p className="text-xs     mt-2">Download a <a href="/bulk-template.csv" download className="underline hover:   ">template file</a>.</p>
                        </div>
                     </Card>
                  </TabsContent>
               </Tabs>
            </CardContent>
         </Card>

         <Card  >
            <CardHeader>
               <CardTitle>Step 2: Configure Platforms & Posts</CardTitle>
               <CardDescription>Select where you want to post and what kind of content to create.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
               <CampaignSelector selectedCampaign={selectedCampaign} setSelectedCampaign={setSelectedCampaign} />
               <PlatformSelectorNew
                  selectedPlatforms={selectedPlatforms}
                  setSelectedPlatforms={setSelectedPlatforms}
                  selectedTargets={selectedTargets}
                  setSelectedTargets={setSelectedTargets}
                  selectedPostTypes={selectedPostTypes}
                  setSelectedPostTypes={setSelectedPostTypes}
               />
               <div className="space-y-2">
                  <Label htmlFor="num-posts" className="text-base font-medium">Number of posts per topic</Label>
                  <Input
                     id="num-posts"
                     type="number"
                     value={numPosts}
                     onChange={(e) => setNumPosts(Math.max(1, parseInt(e.target.value, 10)))}
                     min="1"
                     className="w-32"
                  />
               </div>
            </CardContent>
         </Card>

         <div className="flex justify-end">
            <Button onClick={handleBulkGenerate} disabled={isGenerating} size="lg" className="btn-gradient ">
               {isGenerating ? <Wand2 className="h-5 w-5 mr-2 animate-spin" /> : <Wand2 className="h-5 w-5 mr-2" />}
               Generate Content
            </Button>
         </div>

         {generatedContent.length > 0 && (
            <Card  >
               <CardHeader>
                  <div className="flex items-center justify-between">
                     <div>
                        <CardTitle>Generated Content Library</CardTitle>
                        <CardDescription>Review, edit, schedule, or export your new content.</CardDescription>
                     </div>
                     <Button variant="outline" onClick={handleExport}>
                        <FileDown className="h-4 w-4 mr-2" />
                        Export CSV
                     </Button>
                  </div>
               </CardHeader>
               <CardContent>
                  <Table>
                     <TableHeader>
                        <TableRow className="border-border">
                           <TableHead>Topic</TableHead>
                           <TableHead>Platform</TableHead>
                           <TableHead>Content</TableHead>
                           <TableHead>Status</TableHead>
                           <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                     </TableHeader>
                     <TableBody>
                        {generatedContent.map((item) => (
                           <TableRow key={item.id} className="border-border">
                              <TableCell className="font-medium">{item.topic}</TableCell>
                              <TableCell>
                                 <Badge variant="outline" className="capitalize">{item.platform}</Badge>
                                 <Badge variant="secondary" className="ml-2">{item.postType}</Badge>
                              </TableCell>
                              <TableCell className="max-w-sm truncate">{item.content}</TableCell>
                              <TableCell>
                                 <Badge variant={item.status === 'scheduled' ? 'default' : 'secondary'}>
                                    {item.status}
                                 </Badge>
                              </TableCell>
                              <TableCell className="text-right space-x-2">
                                 <Button size="icon" variant="ghost" onClick={() => handleEdit(item)} className="   "><Edit className="h-4 w-4" /></Button>
                                 <Button size="icon" variant="ghost" onClick={() => handleSchedule(item)} className="   "><Calendar className="h-4 w-4" /></Button>
                                 <Button size="icon" variant="ghost" onClick={() => handleDelete(item.id)} className="text-red-500 hover:text-red-400"><Trash2 className="h-4 w-4" /></Button>
                              </TableCell>
                           </TableRow>
                        ))}
                     </TableBody>
                  </Table>
               </CardContent>
            </Card>
         )}

         <ScheduleDialog
            open={isScheduleModalOpen}
            onOpenChange={setIsScheduleModalOpen}
            post={selectedPost}
            onConfirmSchedule={handleConfirmSchedule}
         />

         <EditContentDialog
            open={isEditModalOpen}
            onOpenChange={setIsEditModalOpen}
            contentItem={selectedPostForEdit}
            onSave={handleSave}
         />

      </div>
   );
}
