
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useCsvUpload } from '@/hooks/useCsvUpload';

export function useCsvData() {
  const { toast } = useToast();
  const { createCsvUpload, saveCsvLeads } = useCsvUpload();
  
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [csvData, setCsvData] = useState<any[]>([]);
  const [csvUploadId, setCsvUploadId] = useState<string | null>(null);

  const handleCsvDataProcessed = async (file: File, data: any[]) => {
    console.log("📊 Processing CSV data for database storage:", { filename: file.name, rowCount: data.length });
    
    // Create CSV upload record in database
    const uploadId = await createCsvUpload(file.name, data.length);
    if (uploadId) {
      setCsvUploadId(uploadId);
      
      // Save CSV leads to database
      const success = await saveCsvLeads(uploadId, data);
      if (success) {
        toast({
          title: "CSV Data Saved",
          description: `Successfully saved ${data.length} leads to database.`,
        });
      }
    }
  };

  return {
    csvFile,
    setCsvFile,
    csvData,
    setCsvData,
    csvUploadId,
    handleCsvDataProcessed
  };
}
