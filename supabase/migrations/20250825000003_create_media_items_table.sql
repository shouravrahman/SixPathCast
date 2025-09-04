-- Create media_items table
CREATE TABLE public.media_items (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  name text NOT NULL,
  type text NOT NULL, -- 'image', 'video', 'document'
  url text NOT NULL,
  file_path text NOT NULL,
  size_bytes bigint,
  mime_type text,
  dimensions text, -- For images (e.g., '1920x1080')
  duration_seconds integer, -- For videos (in seconds)
  page_count integer, -- For documents (number of pages)
  folder text,
  tags text[],
  usage_count integer DEFAULT 0,
  is_favorite boolean DEFAULT false,
  is_ai_generated boolean DEFAULT false
);

-- Enable Row Level Security
ALTER TABLE public.media_items ENABLE ROW LEVEL SECURITY;

-- Policies for media_items
CREATE POLICY "Users can view their own media items." ON public.media_items
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create media items." ON public.media_items
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own media items." ON public.media_items
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own media items." ON public.media_items
  FOR DELETE USING (auth.uid() = user_id);

-- Function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_media_item_update()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to update the timestamp on each update
CREATE TRIGGER on_media_item_update
  BEFORE UPDATE ON public.media_items
  FOR EACH ROW EXECUTE PROCEDURE public.handle_media_item_update();
