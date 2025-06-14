
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UploadCloud } from "lucide-react";
import Papa from "papaparse";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

interface CsvUploadFormProps {
  onFileSelect: (file: File | null) => void;
  setCsvData: (data: any[]) => void;
  onDataProcessed?: (file: File, data: any[]) => void;
}

export function CsvUploadForm({ onFileSelect, setCsvData, onDataProcessed }: CsvUploadFormProps) {
  const { toast } = useToast();
  const [fileName, setFileName] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type !== "text/csv") {
        toast({
          title: "Invalid file type",
          description: "Please upload a CSV file.",
          variant: "destructive",
        });
        return;
      }

      setFileName(file.name);
      onFileSelect(file);

      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          console.log("Parsed CSV data:", results.data);
          setCsvData(results.data);
          
          // Call the new callback to handle database storage
          if (onDataProcessed) {
            onDataProcessed(file, results.data);
          }
          
          toast({
            title: "File Uploaded",
            description: `${results.data.length} rows loaded from ${file.name}.`,
          });
        },
        error: (error: any) => {
          console.error("CSV parsing error:", error);
          toast({
            title: "CSV Parsing Error",
            description: "Could not parse the CSV file. Please check its format.",
            variant: "destructive",
          });
          onFileSelect(null);
          setCsvData([]);
          setFileName(null);
        }
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><UploadCloud /> 1. Upload Leads</CardTitle>
        <CardDescription>Upload a CSV file containing your leads. We recommend columns like 'firstName', 'lastName', 'companyName', and 'website'. Data will be saved to your database.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid w-full max-w-sm items-center gap-1.5">
          <Label htmlFor="csv-file">CSV File</Label>
          <Input id="csv-file" type="file" accept=".csv" onChange={handleFileChange} />
          {fileName && <p className="text-sm text-muted-foreground mt-2">File: {fileName}</p>}
        </div>
      </CardContent>
    </Card>
  );
}
