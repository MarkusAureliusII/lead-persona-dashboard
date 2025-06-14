
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2, TableIcon, CheckCircle, XCircle, Clock } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { ProcessingResult } from "@/types/processing";

interface ProcessingDashboardProps {
  csvData: any[];
  processingResults: ProcessingResult[];
  isProcessing: boolean;
}

export function ProcessingDashboard({ csvData, processingResults, isProcessing }: ProcessingDashboardProps) {
  const headers = csvData.length > 0 ? Object.keys(csvData[0]) : [];

  const getStatusIcon = (index: number) => {
    const result = processingResults.find(r => r.index === index);
    if (!result) return <Clock className="h-4 w-4 text-gray-400" />;
    
    switch (result.status) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'error':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'processing':
        return <Loader2 className="h-4 w-4 animate-spin text-blue-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-400" />;
    }
  };

  const getPersonalizedMessage = (index: number) => {
    const result = processingResults.find(r => r.index === index);
    return result?.personalizedMessage || '';
  };

  const getErrorMessage = (index: number) => {
    const result = processingResults.find(r => r.index === index);
    return result?.error || '';
  };

  const successCount = processingResults.filter(r => r.status === 'success').length;
  const errorCount = processingResults.filter(r => r.status === 'error').length;
  const processingCount = processingResults.filter(r => r.status === 'processing').length;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TableIcon /> Results Dashboard
          {isProcessing && (
            <span className="text-sm font-normal text-muted-foreground">
              ({successCount} ✅ | {errorCount} ❌ | {processingCount} ⏳)
            </span>
          )}
        </CardTitle>
        <CardDescription>
          {isProcessing 
            ? "Processing leads... Results will appear here as they complete."
            : "Preview your uploaded data below. Processed leads with personalized messages will appear here."}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {csvData.length > 0 ? (
          <ScrollArea className="h-96 w-full rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Status</TableHead>
                  {headers.map(header => <TableHead key={header}>{header}</TableHead>)}
                  <TableHead>Personalized Message</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {csvData.map((row, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            {getStatusIcon(index)}
                          </TooltipTrigger>
                          <TooltipContent>
                            {getErrorMessage(index) || `Lead ${index + 1}`}
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </TableCell>
                    {headers.map(header => (
                      <TableCell key={header}>{row[header]}</TableCell>
                    ))}
                    <TableCell className="max-w-xs">
                      {getPersonalizedMessage(index) ? (
                        <div className="text-xs text-muted-foreground truncate">
                          {getPersonalizedMessage(index)}
                        </div>
                      ) : (
                        <span className="text-xs text-muted-foreground">-</span>
                      )}
                    </TableCell>
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
