"use client";

import React from 'react';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useCopywriterStore } from '@/hooks/useCopywriterStore';
import { FileText, Mail, Handshake } from 'lucide-react';

const canvasOptions = [
  {
    id: 'landingPage',
    title: 'Website Landing Page',
    description: 'Generate all the copy needed for a high-converting landing page.',
    icon: <FileText className="h-12 w-12 mb-4" />,
  },
  {
    id: 'emailNewsletter',
    title: 'Email Newsletter',
    description: 'Create engaging content for your next newsletter campaign.',
    icon: <Mail className="h-12 w-12 mb-4" />,
  },
  {
    id: 'salesEmail',
    title: 'Sales Email',
    description: 'Draft a persuasive email to drive sales and conversions.',
    icon: <Handshake className="h-12 w-12 mb-4" />,
  },
];

export const CanvasSelector = () => {
  const setCanvasType = useCopywriterStore((state) => state.setCanvasType);

  return (
    <div className="text-center">
      <h2 className="text-2xl font-bold mb-2">What are we building today?</h2>
      <p className="text-muted-foreground mb-8">Choose your canvas to get started.</p>
      <div className="grid md:grid-cols-3 gap-6">
        {canvasOptions.map((option) => (
          <Card
            key={option.id}
            onClick={() => setCanvasType(option.id as any)}
            className="cursor-pointer hover:border-primary transition-all"
          >
            <CardHeader className="items-center">
              {option.icon}
              <CardTitle>{option.title}</CardTitle>
              <CardDescription className="text-center">{option.description}</CardDescription>
            </CardHeader>
          </Card>
        ))}
      </div>
    </div>
  );
};
