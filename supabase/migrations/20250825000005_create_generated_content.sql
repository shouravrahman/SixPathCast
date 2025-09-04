-- Create generated_content table for storing AI-generated content
CREATE TABLE public.generated_content (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  campaign_id uuid REFERENCES public.campaigns(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  
  -- Content details
  platform text NOT NULL,
  post_type text NOT NULL DEFAULT 'post',
  topic text NOT NULL,
  brief text NOT NULL,
  content text NOT NULL,
  hashtags text[],
  media_description text,
  
  -- Scheduling
  scheduling_suggestion text,
  optimal_time timestamptz,
  scheduled_at timestamptz,
  posted_at timestamptz,
  
  -- Engagement
  engagement_tips text[],
  predicted_engagement_score integer,
  actual_engagement jsonb,
  
  -- Status
  status text DEFAULT 'draft', -- 'draft', 'scheduled', 'posted', 'archived'
  
  -- AI metadata
  ai_model text,
  tokens_used integer,
  generation_time_ms integer
);

-- Enable Row Level Security
ALTER TABLE public.generated_content ENABLE ROW LEVEL SECURITY;

-- Policies for generated_content
CREATE POLICY "Users can view their own generated content." ON public.generated_content
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create generated content." ON public.generated_content
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own generated content." ON public.generated_content
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own generated content." ON public.generated_content
  FOR DELETE USING (auth.uid() = user_id);

-- Function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_generated_content_update()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to update the timestamp on each update
CREATE TRIGGER on_generated_content_update
  BEFORE UPDATE ON public.generated_content
  FOR EACH ROW EXECUTE PROCEDURE public.handle_generated_content_update();

-- Indexes for performance
CREATE INDEX idx_generated_content_user_id ON public.generated_content(user_id);
CREATE INDEX idx_generated_content_campaign_id ON public.generated_content(campaign_id);
CREATE INDEX idx_generated_content_platform ON public.generated_content(platform);
CREATE INDEX idx_generated_content_status ON public.generated_content(status);
CREATE INDEX idx_generated_content_created_at ON public.generated_content(created_at);
CREATE INDEX idx_generated_content_scheduled_at ON public.generated_content(scheduled_at);