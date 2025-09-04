'use client';

import { useState } from 'react';
import {
   BarChart3,
   LayoutGrid,
   List,
   Search,
   SlidersHorizontal,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { platforms } from '@/data/mockData';
import FeedbackDialog from './FeedbackDialog';
import GeneratedContentCard from './GeneratedContentCard';

interface GeneratedContentPanelProps {
   generatedContent: Record<string, any>;
   editingContent: Record<string, string>;
   setEditingContent: (content: Record<string, string>) => void;
   setGeneratedContent: (content: Record<string, any>) => void;
   isGenerating: boolean;
}

const FilterControls = () => (
   <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-2">
         <div className="relative w-full max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4    " />
            <Input placeholder="Search content..." className="pl-9   border-border" />
         </div>
         <Button variant="outline" className="  border-border">
            <SlidersHorizontal className="h-4 w-4 mr-2" />
            Filters
         </Button>
      </div>
   </div>
)

export default function GeneratedContentPanel({
   generatedContent,
   editingContent,
   setEditingContent,
   setGeneratedContent,
   isGenerating
}: GeneratedContentPanelProps) {
   const [showFeedbackDialog, setShowFeedbackDialog] = useState(false);
   const [selectedContentKey, setSelectedContentKey] = useState('');

   const handleEdit = (key: string) => {
      const isEditing = editingContent[key] !== undefined;

      if (isEditing) {
         // Save changes
         setGeneratedContent(prev => ({
            ...prev,
            [key]: {
               ...prev[key],
               text: editingContent[key]
            }
         }));
         setEditingContent(prev => {
            const newState = { ...prev };
            delete newState[key];
            return newState;
         });
      } else {
         // Start editing
         setEditingContent(prev => ({
            ...prev,
            [key]: generatedContent[key].text
         }));
      }
   };

   const handleRegenerate = (key: string) => {
      setGeneratedContent(prev => ({
         ...prev,
         [key]: {
            ...prev[key],
            text: prev[key].text + ' [Regenerated]',
            engagement_prediction: Math.floor(Math.random() * 100) + 50,
            generated_at: new Date().toISOString()
         }
      }));
   };

   const handleFeedback = (key: string, feedback: 'good' | 'bad') => {
      if (feedback === 'bad') {
         setSelectedContentKey(key);
         setShowFeedbackDialog(true);
      } else {
         // Handle good feedback, e.g., send to backend
         console.log(`Good feedback for ${key}`);
      }
   };

   const handleAction = (key: string, action: string) => {
      console.log(`Action: ${action} on item ${key}`);
      // Handle actions like duplicate, generate-image, schedule, post-now, delete
   }

   const submitFeedback = (feedbackData: any) => {
      console.log(`Feedback for ${selectedContentKey}:`, feedbackData);
      setShowFeedbackDialog(false);
   };

   if (Object.keys(generatedContent).length === 0) {
      return (
         <Card className="  h-full border-border dark: /30">
            <CardContent className="p-6 h-full flex flex-col items-center justify-center text-center">
               <div className="w-16 h-16 dark: /50   rounded-full flex items-center justify-center mb-4 border border-border">
                  <BarChart3 className="h-8 w-8    " />
               </div>
               <h3 className="text-lg font-medium mb-2">Generated content</h3>
               <p className="    text-sm mb-6 max-w-sm">
                  Your generated content will appear here. Configure your settings and generate content for multiple platforms.
               </p>
            </CardContent>
         </Card>
      );
   }

   const renderContentCards = () => {
      return Object.entries(generatedContent).map(([key, content]) => {
         const isEditing = editingContent[key] !== undefined;
         const platform = platforms.find(p => p.id === content.platformId);
         const currentText = isEditing ? editingContent[key] : content.text;

         return (
            <GeneratedContentCard
               key={key}
               content={{ ...content, text: currentText }}
               platform={platform}
               isEditing={isEditing}
               onEdit={() => handleEdit(key)}
               onSave={() => handleEdit(key)} // Using handleEdit for save as well
               onChange={(newText) => setEditingContent(prev => ({ ...prev, [key]: newText }))}
               onFeedback={(feedback) => handleFeedback(key, feedback)}
               onRegenerate={() => handleRegenerate(key)}
               onAction={(action) => handleAction(key, action)}
            />
         )
      })
   }

   return (
      <>
         <Tabs defaultValue="grid" className="w-full">
            <div className="flex items-center justify-between mb-4">
               <h3 className="    font-medium text-lg">Generated Content</h3>
               <TabsList className="  border-border border">
                  <TabsTrigger value="grid"><LayoutGrid className="h-4 w-4" /></TabsTrigger>
                  <TabsTrigger value="list"><List className="h-4 w-4" /></TabsTrigger>
               </TabsList>
            </div>

            <FilterControls />

            <TabsContent value="grid">
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {renderContentCards()}
               </div>
            </TabsContent>
            <TabsContent value="list">
               <div className="space-y-4">
                  {renderContentCards()}
               </div>
            </TabsContent>
         </Tabs>

         <FeedbackDialog
            open={showFeedbackDialog}
            onOpenChange={setShowFeedbackDialog}
            onSubmit={submitFeedback}
         />
      </>
   );
}
