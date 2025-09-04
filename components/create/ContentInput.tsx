'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PastPostsSelector from './PastPostsSelector';
import { SourceUpload } from '@/components/source/SourceUpload';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

const formSchema = z.object({
   topic: z.string().min(1, { message: "Topic/Title is required." }).max(100, { message: "Topic/Title cannot exceed 100 characters." }),
   brief: z.string().min(1, { message: "Content Brief is required." }).max(500, { message: "Content Brief cannot exceed 500 characters." }),
});

interface ContentInputProps {
   topic: string;
   setTopic: (topic: string) => void;
   brief: string;
   setBrief: (brief: string) => void;
}

export default function ContentInput({
   topic,
   setTopic,
   brief,
   setBrief,
}: ContentInputProps) {
   const form = useForm<z.infer<typeof formSchema>>({
      resolver: zodResolver(formSchema),
      defaultValues: {
         topic: topic,
         brief: brief,
      },
   });

   // Update form values when props change (e.g., when editing an existing post)
   // This is a simplified approach; for more complex scenarios, consider useEffect or reset
   form.setValue('topic', topic);
   form.setValue('brief', brief);

   return (
      <Card  >
         <CardContent className="p-6">
            <h3 className="font-medium mb-4">Content Details</h3>
            <Tabs defaultValue="text" className="w-full">
               <TabsList className="grid w-full grid-cols-4 ">
                  <TabsTrigger value="text">Text</TabsTrigger>
                  <TabsTrigger value="url">URL</TabsTrigger>
                  <TabsTrigger value="past">Past Posts</TabsTrigger>
                  <TabsTrigger value="sources">Sources</TabsTrigger>
               </TabsList>
               <TabsContent value="text" className="mt-4 space-y-4">
                  <div>
                     <label className="text-sm  mb-2 block">Topic/Title</label>
                     <Input
                        {...form.register('topic')}
                        placeholder="How to build SaaS in 7 days"
                        className="dark:  border-border"
                     />
                     {form.formState.errors.topic && (
                        <p className="text-red-500 text-xs mt-1">{form.formState.errors.topic.message}</p>
                     )}
                  </div>
                  <div>
                     <label className="text-sm  mb-2 block">Content Brief</label>
                     <Textarea
                        {...form.register('brief')}
                        placeholder="Describe what you want to talk about..."
                        rows={4}
                        className="dark:  border-border resize-none"
                     />
                     {form.formState.errors.brief && (
                        <p className="text-red-500 text-xs mt-1">{form.formState.errors.brief.message}</p>
                     )}
                  </div>
               </TabsContent>
               <TabsContent value="url" className="mt-4 space-y-4">
                  <div>
                     <label className="text-sm  mb-2 block">URL</label>
                     <Input
                        placeholder="https://example.com/blog-post"
                        className="dark:  border-border"
                     />
                  </div>
                  <div>
                     <label className="text-sm  mb-2 block">Content Brief</label>
                     <Textarea
                        value={brief}
                        onChange={(e) => setBrief(e.target.value)}
                        placeholder="Describe what you want to talk about..."
                        rows={4}
                        className="dark:  border-border resize-none"
                     />
                  </div>
               </TabsContent>
               <TabsContent value="past" className="mt-4">
                  <PastPostsSelector />
               </TabsContent>
               <TabsContent value="sources" className="mt-4">
                  <SourceUpload />
               </TabsContent>
            </Tabs>
         </CardContent>
      </Card>
   );
}
