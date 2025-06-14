
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2, TableIcon, CheckCircle, XCircle, Clock, Activity } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { ProcessingResult } from "@/types/processing";
import { Progress } from "@/components/ui/progress";

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
  const pendingCount = processingResults.filter(r => r.status === 'pending').length;
  
  const totalProcessed = successCount + errorCount;
  const progressPercentage = csvData.length > 0 ? (totalProcessed / csvData.length) * 100 : 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TableIcon /> 
          Live Processing Dashboard
          {isProcessing && (
            <Activity className="h-4 w-4 text-blue-500 animate-pulse" />
          )}
        </CardTitle>
        <CardDescription>
          {isProcessing 
            ? "Processing leads individually... Watch the live updates as each lead is processed in real-time."
            : "Preview your uploaded data below. Individual processing results will appear here with live updates."}
        </CardDescription>
        
        {isProcessing && csvData.length > 0 && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Live Progress</span>
              <span>{totalProcessed}/{csvData.length} completed</span>
            </div>
            <Progress value={progressPercentage} className="w-full" />
          </div>
        )}
        
        {(successCount > 0 || errorCount > 0 || processingCount > 0 || pendingCount > 0) && (
          <div className="flex gap-4 text-sm">
            <span className="text-green-600">✅ {successCount} successful</span>
            <span className="text-red-600">❌ {errorCount} errors</span>
            {processingCount > 0 && (
              <span className="text-blue-600">🔄 {processingCount} processing</span>
            )}
            {pendingCount > 0 && (
              <span className="text-gray-600">⏳ {pendingCount} pending</span>
            )}
          </div>
        )}
      </CardHeader>
      <CardContent>
        {csvData.length > 0 ? (
          <ScrollArea className="h-96 w-full rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Live Status</TableHead>
                  {headers.map(header => <TableHead key={header}>{header}</TableHead>)}
                  <TableHead>Personalized Message</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {csvData.map((row, index) => (
                  <TableRow key={index} className={
                    processingResults.find(r => r.index === index)?.status === 'processing' 
                      ? 'bg-blue-50 animate-pulse' 
                      : ''
                  }>
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
                      ) : processingResults.find(r => r.index === index)?.status === 'processing' ? (
                        <span className="text-xs text-blue-600">Processing...</span>
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
