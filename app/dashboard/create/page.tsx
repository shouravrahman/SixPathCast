"use client";

import { useState } from "react";
import { generateMockContent } from "@/data/mockData";
import { toast } from "sonner";

import PlatformSelectorNew from "@/components/create/PlatformSelectorNew";
import ContentInput from "@/components/create/ContentInput";
import GeneratedContentPanel from "@/components/create/GeneratedContentPanel";
import CreateHeader from "@/components/create/CreateHeader";
import { Button } from "@/components/ui/button";
import { Wand2 } from "lucide-react";

export default function CreateContent() {
   const [selectedCampaign, setSelectedCampaign] = useState("");
   const [selectedModel, setSelectedModel] = useState("gpt-4-turbo");
   const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
   const [selectedTargets, setSelectedTargets] = useState<any[]>([]);
   const [selectedPostTypes, setSelectedPostTypes] = useState<
      Record<string, string[]>
   >({});
   const [topic, setTopic] = useState("");
   const [brief, setBrief] = useState("");

   const [generatedContent, setGeneratedContent] = useState<
      Record<string, any>
   >({});
   const [editingContent, setEditingContent] = useState<
      Record<string, string>
   >({});
   const [isGenerating, setIsGenerating] = useState(false);
   const [generationProgress, setGenerationProgress] = useState(0);

   const generateContent = async () => {
      setIsGenerating(true);
      setGenerationProgress(0);
      setGeneratedContent({});

      const mockContent: Record<string, any> = {};
      let totalGenerations = 0;

      selectedPlatforms.forEach(platformId => {
         const postTypes = selectedPostTypes[platformId] || ['post'];
         postTypes.forEach(postType => {
            const key = `${platformId}-${postType}`;
            mockContent[key] = {
               ...generateMockContent(
                  platformId,
                  postType,
                  topic,
                  brief
               ),
               targetName: platformId,
               platformName: platformId,
            };
            totalGenerations++;
         });
      });

      // Simulate generation progress
      if (totalGenerations > 0) {
         let completed = 0;
         const interval = setInterval(() => {
            completed++;
            setGenerationProgress((completed / totalGenerations) * 100);

            if (completed >= totalGenerations) {
               clearInterval(interval);
               setGeneratedContent(mockContent);
               setIsGenerating(false);
               toast.success("Content generated successfully!");
            }
         }, 300);
      } else {
         setIsGenerating(false);
         toast.info("No platforms or post types selected.");
      }
   };

   const canGenerate = () => {
      return topic && brief && selectedPlatforms.length > 0 && !isGenerating;
   };

   return (
      <div className="h-full">
         <div className="dashboard-page-container max-w-screen-2xl flex flex-col h-full">
            <CreateHeader
               selectedCampaign={selectedCampaign}
               setSelectedCampaign={setSelectedCampaign}
               selectedModel={selectedModel}
               setSelectedModel={setSelectedModel}
            />

            {/* Main Content Grid */}
            <main className="grid grid-cols-12 gap-6 flex-grow  overflow-hidden">
               {/* Left Column - Configuration & Controls */}
               <div className="col-span-6 space-y-6 overflow-y-auto pr-4">
                  <ContentInput
                     topic={topic}
                     setTopic={setTopic}
                     brief={brief}
                     setBrief={setBrief}
                  />

                  <PlatformSelectorNew
                     selectedPlatforms={selectedPlatforms}
                     setSelectedPlatforms={setSelectedPlatforms}
                     selectedTargets={selectedTargets}
                     setSelectedTargets={setSelectedTargets}
                     selectedPostTypes={selectedPostTypes}
                     setSelectedPostTypes={setSelectedPostTypes}
                  />

                  <div className="flex justify-end">
                     <Button onClick={generateContent} disabled={!canGenerate()} size="lg" className="btn-gradient ">
                        {isGenerating ? <Wand2 className="h-5 w-5 mr-2 animate-spin" /> : <Wand2 className="h-5 w-5 mr-2" />}
                        Generate Content
                     </Button>
                  </div>
               </div>

               {/* Right Column - Generated Content Workspace */}
               <div className="col-span-6 overflow-y-auto   rounded-lg border border-border">
                  <GeneratedContentPanel
                     generatedContent={generatedContent}
                     editingContent={editingContent}
                     setEditingContent={setEditingContent}
                     setGeneratedContent={setGeneratedContent}
                     isGenerating={isGenerating}
                  />
               </div>
            </main>
         </div>
      </div>
   );
}
