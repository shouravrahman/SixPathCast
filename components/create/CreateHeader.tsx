"use client";

import CampaignSelector from "./CampaignSelector";
import AIModelSelector from "./AIModelSelector";

interface CreateHeaderProps {
  selectedCampaign: string;
  setSelectedCampaign: (campaign: string) => void;
  selectedModel: string;
  setSelectedModel: (model: string) => void;
}

export default function CreateHeader({
  selectedCampaign,
  setSelectedCampaign,
  selectedModel,
  setSelectedModel,
}: CreateHeaderProps) {
  return (
    <header className="mb-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="dashboard-header-title">
            AI Content Creator
          </h1>
          <p className="dashboard-header-description">
            Create, customize, and generate content for all your platforms.
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <CampaignSelector
              selectedCampaign={selectedCampaign}
              setSelectedCampaign={setSelectedCampaign}
            />
            <AIModelSelector
              selectedModel={selectedModel}
              setSelectedModel={setSelectedModel}
            />
          </div>
        </div>
      </div>
    </header>
  );
}
