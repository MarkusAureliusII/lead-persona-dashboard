
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2, TableIcon } from "lucide-react";

interface ProcessingDashboardProps {
  csvData: any[];
  processingResults: any[];
  isProcessing: boolean;
}

export function ProcessingDashboard({ csvData, processingResults, isProcessing }: ProcessingDashboardProps) {
  const headers = csvData.length > 0 ? Object.keys(csvData[0]) : [];

  const getStatus = (index: number) => {
    if (processingResults[index]) {
      return processingResults[index].status === 'success' ? '✅' : '❌';
    }
    return '⏳';
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><TableIcon /> Results Dashboard</CardTitle>
        <CardDescription>
          {isProcessing 
            ? "Processing leads... Results will appear here as they complete."
            : "Preview your uploaded data below. Processed leads with personalized messages will appear here."}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isProcessing && csvData.length === 0 && (
          <div className="flex items-center justify-center p-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="ml-4 text-muted-foreground">Processing...</p>
          </div>
        )}

        {csvData.length > 0 ? (
           <ScrollArea className="h-96 w-full rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  {isProcessing && <TableHead>Status</TableHead>}
                  {headers.map(header => <TableHead key={header}>{header}</TableHead>)}
                  {/* Later, we'll add a column for personalized message */}
                </TableRow>
              </TableHeader>
              <TableBody>
                {csvData.map((row, index) => (
                  <TableRow key={index}>
                     {isProcessing && <TableCell>{getStatus(index)}</TableCell>}
                    {headers.map(header => <TableCell key={header}>{row[header]}</TableCell>)}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </ScrollArea>
        ) : (
          <div className="text-center text-muted-foreground p-8 border-2 border-dashed rounded-lg">
            <p>Upload a CSV file to see a preview of your data.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
