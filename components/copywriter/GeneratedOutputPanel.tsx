"use client";

import React, { useState, useEffect } from 'react';
import { useCopywriterStore } from '@/hooks/useCopywriterStore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Copy, Edit, RefreshCw, Check, X } from 'lucide-react';
import { Textarea } from '../ui/textarea';

export const GeneratedOutputPanel = () => {
  const { generatedContent, reset, updateBlockContent } = useCopywriterStore();
  const [editingBlockId, setEditingBlockId] = useState<string | null>(null);
  const [editedContent, setEditedContent] = useState("");

  useEffect(() => {
    if (editingBlockId && generatedContent && generatedContent[editingBlockId]) {
        setEditedContent(generatedContent[editingBlockId].content);
    } else {
        setEditedContent("");
    }
  }, [editingBlockId, generatedContent]);

  if (!generatedContent) {
    return (
        <div className="text-center">
            <h2 className="text-2xl font-bold mb-2">Generating your content...</h2>
            <p className="text-muted-foreground">Our AI is warming up. This should only take a moment.</p>
        </div>
    )
  }

  const handleSave = () => {
    if (editingBlockId) {
        updateBlockContent(editingBlockId, editedContent);
        setEditingBlockId(null);
    }
  }

  const handleCancel = () => {
    setEditingBlockId(null);
  }

  return (
    <div className="space-y-6">
        <Button variant="outline" onClick={() => reset()}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Start Over
        </Button>
      {Object.entries(generatedContent).map(([key, value]) => (
        <Card key={key}>
          <CardHeader className='flex flex-row items-center justify-between'>
            <CardTitle>{value.title}</CardTitle>
            <div className='flex items-center gap-1'>
                {editingBlockId === key ? (
                    <>
                        <Button variant="ghost" size="icon" onClick={handleSave}><Check className='h-4 w-4 text-green-500'/></Button>
                        <Button variant="ghost" size="icon" onClick={handleCancel}><X className='h-4 w-4 text-red-500'/></Button>
                    </>
                ) : (
                    <>
                        <Button variant="ghost" size="icon"><Copy className='h-4 w-4'/></Button>
                        <Button variant="ghost" size="icon"><RefreshCw className='h-4 w-4'/></Button>
                        <Button variant="ghost" size="icon" onClick={() => setEditingBlockId(key)}><Edit className='h-4 w-4'/></Button>
                    </>
                )}
            </div>
          </CardHeader>
          <CardContent>
            {editingBlockId === key ? (
                <Textarea 
                    value={editedContent}
                    onChange={(e) => setEditedContent(e.target.value)}
                    className="h-48"
                />
            ) : (
                <div className="prose prose-sm max-w-none whitespace-pre-wrap">
                    {value.content}
                </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
