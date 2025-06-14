
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UploadCloud, AlertCircle } from "lucide-react";
import Papa from "papaparse";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface CsvUploadFormProps {
  onFileSelect: (file: File | null) => void;
  setCsvData: (data: any[]) => void;
  onDataProcessed?: (file: File, data: any[]) => void;
}

export function CsvUploadForm({ onFileSelect, setCsvData, onDataProcessed }: CsvUploadFormProps) {
  const { toast } = useToast();
  const { user } = useAuth();
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

      if (!user) {
        toast({
          title: "Authentication Required",
          description: "Please sign in to upload and save CSV files.",
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
            description: `${results.data.length} rows loaded from ${file.name}. Data will be saved to your account.`,
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
        {!user && (
          <Alert className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              You must be signed in to upload and save CSV files. Your data will be securely stored in your account.
            </AlertDescription>
          </Alert>
        )}
        <div className="grid w-full max-w-sm items-center gap-1.5">
          <Label htmlFor="csv-file">CSV File</Label>
          <Input 
            id="csv-file" 
            type="file" 
            accept=".csv" 
            onChange={handleFileChange}
            disabled={!user}
          />
          {fileName && <p className="text-sm text-muted-foreground mt-2">File: {fileName}</p>}
          {!user && <p className="text-sm text-amber-600 mt-2">Please sign in to enable file upload</p>}
        </div>
      </CardContent>
    </Card>
  );
}
