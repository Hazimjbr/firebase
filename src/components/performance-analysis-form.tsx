'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { analyzeStudentPerformance, AnalyzeStudentPerformanceOutput } from '@/ai/flows/analyze-student-performance';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Sparkles } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const formSchema = z.object({
    quizResults: z.string().min(10, "Please provide some quiz results."),
    experimentResults: z.string().min(10, "Please provide some experiment results."),
    courseMaterial: z.string().min(10, "Please describe the course material."),
});

export default function PerformanceAnalysisForm() {
    const [isLoading, setIsLoading] = useState(false);
    const [analysisResult, setAnalysisResult] = useState<AnalyzeStudentPerformanceOutput | null>(null);
    const { toast } = useToast();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            quizResults: '{\n  "quiz1": {\n    "score": 75,\n    "topic": "Stoichiometry"\n  },\n  "quiz2": {\n    "score": 60,\n    "topic": "Gas Laws"\n  }\n}',
            experimentResults: '{\n  "titration_lab": {\n    "accuracy": "85%",\n    "errors": ["Endpoint overshot"]\n  }\n}',
            courseMaterial: 'First-year university chemistry, focusing on chemical reactions, stoichiometry, and gas laws.',
        },
    });

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setIsLoading(true);
        setAnalysisResult(null);
        try {
            const result = await analyzeStudentPerformance(values);
            setAnalysisResult(result);
            toast({
                title: "Analysis Complete!",
                description: "Your performance insights are ready.",
            });
        } catch (error) {
            console.error(error);
            toast({
                title: "Analysis Failed",
                description: "There was an error analyzing your performance. Please try again.",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="space-y-8">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Input Your Data</CardTitle>
                            <CardDescription>Provide your performance data for AI analysis.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <FormField
                                control={form.control}
                                name="quizResults"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Quiz Results (JSON)</FormLabel>
                                        <FormControl>
                                            <Textarea className="font-mono text-sm" placeholder='e.g., {"quiz1": {"score": 80}}' {...field} rows={8} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="experimentResults"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Experiment Results (JSON)</FormLabel>
                                        <FormControl>
                                            <Textarea className="font-mono text-sm" placeholder='e.g., {"titration": {"accuracy": "95%"}}' {...field} rows={6} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="courseMaterial"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Course Material / Topics Studied</FormLabel>
                                        <FormControl>
                                            <Textarea placeholder="Describe the topics you're studying." {...field} rows={4} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <Button type="submit" disabled={isLoading} size="lg">
                                {isLoading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Analyzing...
                                    </>
                                ) : (
                                    <>
                                        <Sparkles className="mr-2 h-4 w-4" />
                                        Analyze Performance
                                    </>
                                )}
                            </Button>
                        </CardContent>
                    </Card>
                </form>
            </Form>

            {analysisResult && (
                <Card className="bg-gradient-to-br from-card to-secondary/20">
                    <CardHeader>
                        <CardTitle>Analysis Complete</CardTitle>
                        <CardDescription>Here are the insights from your performance data.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div>
                            <h3 className="font-semibold mb-2 text-lg">Identified Knowledge Gaps</h3>
                            <div className="p-4 bg-background/50 rounded-md">
                                <p className="text-sm text-foreground whitespace-pre-wrap">{analysisResult.knowledgeGaps}</p>
                            </div>
                        </div>
                        <div>
                            <h3 className="font-semibold mb-2 text-lg">Suggested Learning Resources</h3>
                            <div className="p-4 bg-background/50 rounded-md">
                               <p className="text-sm text-foreground whitespace-pre-wrap">{analysisResult.suggestedResources}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
