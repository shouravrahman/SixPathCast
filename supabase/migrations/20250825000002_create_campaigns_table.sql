-- Create campaigns table
CREATE TABLE public.campaigns (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  name text NOT NULL,
  description text,
  category text,
  status text DEFAULT 'draft',
  target_audience text,
  content_pillars text[],
  platforms text[],
  posts_generated integer DEFAULT 0,
  scheduled_posts integer DEFAULT 0,
  engagement_rate numeric DEFAULT 0.0
);

-- Enable Row Level Security
ALTER TABLE public.campaigns ENABLE ROW LEVEL SECURITY;

-- Policies for campaigns
CREATE POLICY "Users can view their own campaigns." ON public.campaigns
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create campaigns." ON public.campaigns
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own campaigns." ON public.campaigns
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own campaigns." ON public.campaigns
  FOR DELETE USING (auth.uid() = user_id);

-- Function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_campaign_update()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to update the timestamp on each update
CREATE TRIGGER on_campaign_update
  BEFORE UPDATE ON public.campaigns
  FOR EACH ROW EXECUTE PROCEDURE public.handle_campaign_update();
