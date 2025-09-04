"use client";

import React from 'react';
import { useCopywriterStore } from '@/hooks/useCopywriterStore';
import { CanvasSelector } from './CanvasSelector';
import { BlockSelector } from './BlockSelector';
import { CoreInputForm } from './CoreInputForm';
import { GeneratedOutputPanel } from './GeneratedOutputPanel';

const CopywriterWorkspace = () => {
  const { currentStep } = useCopywriterStore();

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <CanvasSelector />;
      case 2:
        return <BlockSelector />;
      case 3:
        return <CoreInputForm />;
      case 4:
        return <GeneratedOutputPanel />;
      default:
        return <CanvasSelector />;
    }
  };

  return (
    <div className="p-6 lg:p-8 h-full">
      {renderStep()}
    </div>
  );
};

export default CopywriterWorkspace;
