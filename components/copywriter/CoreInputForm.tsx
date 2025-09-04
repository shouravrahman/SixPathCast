"use client";

import React from 'react';
import { useForm } from 'react-hook-form';
import { useCopywriterStore } from '@/hooks/useCopywriterStore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Sparkles } from 'lucide-react';

// Mock data for generated content
import { mockLandingPage, mockEmailNewsletter } from '@/data/mockCopywriterData';

export const CoreInputForm = () => {
   const { setCoreInfo, setGeneratedContent, setCurrentStep, canvasType } = useCopywriterStore();
   const { register, handleSubmit } = useForm();

   const onSubmit = (data: any) => {
      setCoreInfo(data);
      // In a real app, you would make an API call here.
      // For now, we'll use mock data.
      setTimeout(() => {
         const mockContent = canvasType === 'landingPage' ? mockLandingPage : mockEmailNewsletter;
         setGeneratedContent(mockContent);
      }, 1000);
   };

   return (
      <div>
         <Button variant="ghost" onClick={() => setCurrentStep(2)} className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to block selection
         </Button>
         <Card>
            <CardHeader>
               <CardTitle>Provide Core Information</CardTitle>
               <CardDescription>Give the AI the raw materials it needs to write amazing copy.</CardDescription>
            </CardHeader>
            <CardContent>
               <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  <div className="space-y-2">
                     <Label htmlFor="productName">Product/Service Name</Label>
                     <Input id="productName" {...register('productName', { required: true })} placeholder="e.g., SixPathCast" />
                  </div>
                  <div className="space-y-2">
                     <Label htmlFor="targetAudience">Target Audience</Label>
                     <Input id="targetAudience" {...register('targetAudience', { required: true })} placeholder="e.g., Content creators and marketers" />
                  </div>
                  <div className="space-y-2">
                     <Label htmlFor="features">Key Features/Benefits (one per line)</Label>
                     <Textarea id="features" {...register('features', { required: true })} placeholder="- AI-powered content generation\n- Smart scheduling\n- In-depth analytics" rows={5} />
                  </div>
                  <div className="flex justify-end">
                     <Button type="submit">
                        <Sparkles className="mr-2 h-4 w-4" />
                        Generate All Copy
                     </Button>
                  </div>
               </form>
            </CardContent>
         </Card>
      </div>
   );
};
