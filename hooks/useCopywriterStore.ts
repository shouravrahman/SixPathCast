"use client";

import { create } from 'zustand';

type CanvasType = 'landingPage' | 'emailNewsletter' | 'salesEmail' | null;

interface CopywriterState {
  canvasType: CanvasType;
  setCanvasType: (canvas: CanvasType) => void;

  selectedBlocks: string[];
  toggleBlock: (block: string) => void;

  coreInfo: Record<string, string>;
  setCoreInfo: (info: Record<string, string>) => void;

  generatedContent: Record<string, { title: string; content: string }> | null;
  setGeneratedContent: (content: Record<string, { title: string; content: string }> | null) => void;

  currentStep: number;
  setCurrentStep: (step: number) => void;
  reset: () => void;
}

const initialState = {
  canvasType: null,
  selectedBlocks: [],
  coreInfo: {},
  generatedContent: null,
  currentStep: 1,
};

export const useCopywriterStore = create<CopywriterState>((set, get) => ({
  ...initialState,
  setCanvasType: (canvas) => set({ canvasType: canvas, currentStep: 2, selectedBlocks: [], generatedContent: null }),
  toggleBlock: (block) =>
    set((state) => ({
      selectedBlocks: state.selectedBlocks.includes(block)
        ? state.selectedBlocks.filter((b) => b !== block)
        : [...state.selectedBlocks, block],
    })),
  setCoreInfo: (info) => set({ coreInfo: info }),
  setGeneratedContent: (content) => set({ generatedContent: content, currentStep: 4 }),
  updateBlockContent: (blockId, newContent) => 
    set((state) => ({
        ...state,
        generatedContent: {
            ...state.generatedContent,
            [blockId]: {
                // @ts-ignore
                ...state.generatedContent[blockId],
                content: newContent
            }
        }
    })),
  setCurrentStep: (step) => set({ currentStep: step }),
  reset: () => set(initialState),
}));
