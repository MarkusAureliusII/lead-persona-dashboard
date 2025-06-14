
-- Create table to store uploaded CSV files metadata
CREATE TABLE public.csv_uploads (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users,
  filename TEXT NOT NULL,
  upload_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  row_count INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'uploaded' CHECK (status IN ('uploaded', 'processing', 'completed', 'failed')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create table to store individual CSV rows/leads
CREATE TABLE public.csv_leads (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  csv_upload_id UUID REFERENCES public.csv_uploads(id) ON DELETE CASCADE NOT NULL,
  row_index INTEGER NOT NULL,
  lead_data JSONB NOT NULL,
  processing_status TEXT NOT NULL DEFAULT 'pending' CHECK (processing_status IN ('pending', 'processing', 'success', 'error')),
  personalized_message TEXT,
  error_message TEXT,
  processed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create table to store personalization configurations
CREATE TABLE public.personalization_configs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  csv_upload_id UUID REFERENCES public.csv_uploads(id) ON DELETE CASCADE NOT NULL,
  product_service TEXT NOT NULL,
  tonality TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.csv_uploads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.csv_leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.personalization_configs ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for csv_uploads
CREATE POLICY "Users can view their own csv uploads" 
  ON public.csv_uploads 
  FOR SELECT 
  USING (user_id = auth.uid());

CREATE POLICY "Users can create their own csv uploads" 
  ON public.csv_uploads 
  FOR INSERT 
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own csv uploads" 
  ON public.csv_uploads 
  FOR UPDATE 
  USING (user_id = auth.uid());

CREATE POLICY "Users can delete their own csv uploads" 
  ON public.csv_uploads 
  FOR DELETE 
  USING (user_id = auth.uid());

-- Create RLS policies for csv_leads
CREATE POLICY "Users can view leads from their csv uploads" 
  ON public.csv_leads 
  FOR SELECT 
  USING (EXISTS (
    SELECT 1 FROM public.csv_uploads 
    WHERE csv_uploads.id = csv_leads.csv_upload_id 
    AND csv_uploads.user_id = auth.uid()
  ));

CREATE POLICY "Users can create leads for their csv uploads" 
  ON public.csv_leads 
  FOR INSERT 
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.csv_uploads 
    WHERE csv_uploads.id = csv_leads.csv_upload_id 
    AND csv_uploads.user_id = auth.uid()
  ));

CREATE POLICY "Users can update leads from their csv uploads" 
  ON public.csv_leads 
  FOR UPDATE 
  USING (EXISTS (
    SELECT 1 FROM public.csv_uploads 
    WHERE csv_uploads.id = csv_leads.csv_upload_id 
    AND csv_uploads.user_id = auth.uid()
  ));

CREATE POLICY "Users can delete leads from their csv uploads" 
  ON public.csv_leads 
  FOR DELETE 
  USING (EXISTS (
    SELECT 1 FROM public.csv_uploads 
    WHERE csv_uploads.id = csv_leads.csv_upload_id 
    AND csv_uploads.user_id = auth.uid()
  ));

-- Create RLS policies for personalization_configs
CREATE POLICY "Users can view personalization configs for their csv uploads" 
  ON public.personalization_configs 
  FOR SELECT 
  USING (EXISTS (
    SELECT 1 FROM public.csv_uploads 
    WHERE csv_uploads.id = personalization_configs.csv_upload_id 
    AND csv_uploads.user_id = auth.uid()
  ));

CREATE POLICY "Users can create personalization configs for their csv uploads" 
  ON public.personalization_configs 
  FOR INSERT 
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.csv_uploads 
    WHERE csv_uploads.id = personalization_configs.csv_upload_id 
    AND csv_uploads.user_id = auth.uid()
  ));

CREATE POLICY "Users can update personalization configs for their csv uploads" 
  ON public.personalization_configs 
  FOR UPDATE 
  USING (EXISTS (
    SELECT 1 FROM public.csv_uploads 
    WHERE csv_uploads.id = personalization_configs.csv_upload_id 
    AND csv_uploads.user_id = auth.uid()
  ));

-- Create indexes for better performance
CREATE INDEX idx_csv_uploads_user_id ON public.csv_uploads(user_id);
CREATE INDEX idx_csv_leads_csv_upload_id ON public.csv_leads(csv_upload_id);
CREATE INDEX idx_csv_leads_processing_status ON public.csv_leads(processing_status);
CREATE INDEX idx_personalization_configs_csv_upload_id ON public.personalization_configs(csv_upload_id);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers to automatically update updated_at
CREATE TRIGGER update_csv_uploads_updated_at 
  BEFORE UPDATE ON public.csv_uploads 
  FOR EACH ROW EXECUTE PROCEDURE public.update_updated_at_column();

CREATE TRIGGER update_csv_leads_updated_at 
  BEFORE UPDATE ON public.csv_leads 
  FOR EACH ROW EXECUTE PROCEDURE public.update_updated_at_column();
