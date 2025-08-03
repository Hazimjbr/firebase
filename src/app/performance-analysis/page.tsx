import Header from "@/components/header";
import PerformanceAnalysisForm from "@/components/performance-analysis-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Lightbulb } from "lucide-react";

export default function PerformanceAnalysisPage() {
  return (
    <div className="flex flex-col h-full">
      <Header
        title="Performance Analysis"
        description="Let an AI analyze your results to find knowledge gaps and suggest resources."
      />
      <div className="flex-1 p-8">
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <PerformanceAnalysisForm />
          </div>
          <div className="lg:col-span-1">
             <Card className="bg-secondary/50 sticky top-28">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Lightbulb className="text-primary"/>
                        How It Works
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 text-sm text-muted-foreground">
                    <p><strong>1. Input Data:</strong> Paste in your recent quiz and experiment results in JSON format. The default values provide an example of the required structure.</p>
                    <p><strong>2. Add Context:</strong> Briefly describe the course material or topics you are currently studying. This helps the AI understand the context of your results.</p>
                    <p><strong>3. Get Insights:</strong> Click "Analyze" and the AI will process the information to identify your potential knowledge gaps and recommend personalized learning resources.</p>
                </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
