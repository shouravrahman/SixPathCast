"use client";

import React from 'react';
import { useCopywriterStore } from '@/hooks/useCopywriterStore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { ArrowLeft } from 'lucide-react';

const blockOptions = {
  landingPage: [
    { id: 'hero', label: 'Hero Section (Headline, Sub-headline, CTA)' },
    { id: 'problemSolution', label: 'Problem/Solution' },
    { id: 'featuresBenefits', label: 'Features & Benefits' },
    { id: 'howItWorks', label: 'How It Works' },
    { id: 'testimonials', label: 'Testimonials' },
    { id: 'pricingTable', label: 'Pricing Table' },
    { id: 'faq', label: 'FAQ Section' },
    { id: 'aboutUs', label: 'About Us' },
    { id: 'finalCta', label: 'Final Call-to-Action' },
  ],
  emailNewsletter: [
    { id: 'subjectLine', label: 'Subject Line' },
    { id: 'greeting', label: 'Greeting' },
    { id: 'introHook', label: 'Introduction Hook' },
    { id: 'mainStory', label: 'Main Story / Article' },
    { id: 'quickLinks', label: 'Quick Links / Resources' },
    { id: 'cta', label: 'Call-to-Action' },
  ],
  salesEmail: [
    { id: 'subjectLine', label: 'Compelling Subject Line' },
    { id: 'opening', label: 'Personalized Opening' },
    { id: 'problem', label: 'Agitate the Problem' },
    { id: 'solution', label: 'Introduce the Solution' },
    { id: 'proof', label: 'Social Proof / Testimonial' },
    { id: 'offer', label: 'The Main Offer' },
    { id: 'cta', label: 'Clear Call-to-Action' },
    { id: 'ps', label: 'P.S. / Urgency' },
  ],
};

export const BlockSelector = () => {
  const { canvasType, selectedBlocks, toggleBlock, setCurrentStep, reset } = useCopywriterStore();

  if (!canvasType) return null;

  const handleNext = () => {
    if (selectedBlocks.length > 0) {
      setCurrentStep(3);
    }
  };

  return (
    <div>
        <Button variant="ghost" onClick={() => reset()} className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to canvas selection
        </Button>
      <Card>
        <CardHeader>
          <CardTitle>Assemble Your Page with "Content Blocks"</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {blockOptions[canvasType].map((block) => (
              <div key={block.id} className="flex items-center space-x-3 p-3 rounded-md border">
                <Checkbox
                  id={block.id}
                  checked={selectedBlocks.includes(block.id)}
                  onCheckedChange={() => toggleBlock(block.id)}
                />
                <label htmlFor={block.id} className="font-medium leading-none cursor-pointer">
                  {block.label}
                </label>
              </div>
            ))}
          </div>
          <div className="flex justify-end mt-6">
            <Button onClick={handleNext} disabled={selectedBlocks.length === 0}>
              Next: Provide Core Info
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
