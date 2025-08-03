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
                title: "اكتمل التحليل!",
                description: "رؤى أدائك جاهزة.",
            });
        } catch (error) {
            console.error(error);
            toast({
                title: "فشل التحليل",
                description: "حدث خطأ أثناء تحليل أدائك. يرجى المحاولة مرة أخرى.",
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
                            <CardTitle>أدخل بياناتك</CardTitle>
                            <CardDescription>قدم بيانات أدائك لتحليلها بواسطة الذكاء الاصطناعي.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <FormField
                                control={form.control}
                                name="quizResults"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>نتائج الاختبارات (JSON)</FormLabel>
                                        <FormControl>
                                            <Textarea className="font-mono text-sm text-left" placeholder='e.g., {"quiz1": {"score": 80}}' {...field} rows={8} />
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
                                        <FormLabel>نتائج التجارب (JSON)</FormLabel>
                                        <FormControl>
                                            <Textarea className="font-mono text-sm text-left" placeholder='e.g., {"titration": {"accuracy": "95%"}}' {...field} rows={6} />
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
                                        <FormLabel>المواد الدراسية / المواضيع التي تمت دراستها</FormLabel>
                                        <FormControl>
                                            <Textarea placeholder="صف المواضيع التي تدرسها." {...field} rows={4} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <Button type="submit" disabled={isLoading} size="lg">
                                {isLoading ? (
                                    <>
                                        <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                                        جارٍ التحليل...
                                    </>
                                ) : (
                                    <>
                                        <Sparkles className="ml-2 h-4 w-4" />
                                        تحليل الأداء
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
                        <CardTitle>اكتمل التحليل</CardTitle>
                        <CardDescription>إليك الرؤى من بيانات أدائك.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div>
                            <h3 className="font-semibold mb-2 text-lg">فجوات المعرفة المحددة</h3>
                            <div className="p-4 bg-background/50 rounded-md">
                                <p className="text-sm text-foreground whitespace-pre-wrap">{analysisResult.knowledgeGaps}</p>
                            </div>
                        </div>
                        <div>
                            <h3 className="font-semibold mb-2 text-lg">مصادر التعلم المقترحة</h3>
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
