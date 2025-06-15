
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface CsvUpload {
  id: string;
  filename: string;
  upload_date: string;
  row_count: number;
  status: string;
}

export function useCsvUpload() {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const createCsvUpload = async (filename: string, rowCount: number): Promise<string | null> => {
    try {
      setIsLoading(true);
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Authentication Required",
          description: "Please log in to save your CSV data.",
          variant: "destructive"
        });
        return null;
      }

      const { data, error } = await supabase
        .from('csv_uploads')
        .insert({
          filename,
          row_count: rowCount,
          user_id: user.id
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating CSV upload:', error);
        toast({
          title: "Database Error",
          description: "Failed to save CSV upload information.",
          variant: "destructive"
        });
        return null;
      }

      return data.id;
    } catch (error) {
      console.error('Error in createCsvUpload:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred.",
        variant: "destructive"
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const saveCsvLeads = async (csvUploadId: string, csvData: any[]) => {
    try {
      setIsLoading(true);

      const leadsToInsert = csvData.map((leadData, index) => ({
        csv_upload_id: csvUploadId,
        row_index: index,
        lead_data: leadData
      }));

      const { error } = await supabase
        .from('csv_leads')
        .insert(leadsToInsert);

      if (error) {
        console.error('Error saving CSV leads:', error);
        toast({
          title: "Database Error",
          description: "Failed to save lead data.",
          variant: "destructive"
        });
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error in saveCsvLeads:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const savePersonalizationConfig = async (csvUploadId: string, productService: string, tonality: string, language: string = 'en') => {
    try {
      const { error } = await supabase
        .from('personalization_configs')
        .insert({
          csv_upload_id: csvUploadId,
          product_service: productService,
          tonality,
          language
        });

      if (error) {
        console.error('Error saving personalization config:', error);
        toast({
          title: "Database Error",
          description: "Failed to save personalization configuration.",
          variant: "destructive"
        });
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error in savePersonalizationConfig:', error);
      return false;
    }
  };

  const updateLeadProcessingResult = async (
    csvUploadId: string, 
    rowIndex: number, 
    status: 'pending' | 'processing' | 'success' | 'error',
    personalizedMessage?: string,
    errorMessage?: string,
    language?: string
  ) => {
    try {
      const updateData: any = {
        processing_status: status,
        processed_at: new Date().toISOString()
      };

      if (personalizedMessage) {
        updateData.personalized_message = personalizedMessage;
      }

      if (errorMessage) {
        updateData.error_message = errorMessage;
      }

      if (language) {
        updateData.language = language;
      }

      const { error } = await supabase
        .from('csv_leads')
        .update(updateData)
        .eq('csv_upload_id', csvUploadId)
        .eq('row_index', rowIndex);

      if (error) {
        console.error('Error updating lead processing result:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error in updateLeadProcessingResult:', error);
      return false;
    }
  };

  return {
    isLoading,
    createCsvUpload,
    saveCsvLeads,
    savePersonalizationConfig,
    updateLeadProcessingResult
  };
}
