'use server';

/**
 * @fileOverview AI flow to analyze student performance on quizzes and experiments.
 *
 * - analyzeStudentPerformance - Analyzes student performance and suggests learning resources.
 * - AnalyzeStudentPerformanceInput - The input type for the analyzeStudentPerformance function.
 * - AnalyzeStudentPerformanceOutput - The return type for the analyzeStudentPerformance function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeStudentPerformanceInputSchema = z.object({
  quizResults: z.string().describe('The results of the student\'s quizzes, in JSON format.'),
  experimentResults: z.string().describe('The results of the student\'s experiments, in JSON format.'),
  courseMaterial: z.string().describe('The course material the student is learning from.'),
});
export type AnalyzeStudentPerformanceInput = z.infer<typeof AnalyzeStudentPerformanceInputSchema>;

const AnalyzeStudentPerformanceOutputSchema = z.object({
  knowledgeGaps: z.string().describe('The identified knowledge gaps of the student.'),
  suggestedResources: z.string().describe('Suggested learning resources to address the knowledge gaps.'),
});
export type AnalyzeStudentPerformanceOutput = z.infer<typeof AnalyzeStudentPerformanceOutputSchema>;

export async function analyzeStudentPerformance(input: AnalyzeStudentPerformanceInput): Promise<AnalyzeStudentPerformanceOutput> {
  return analyzeStudentPerformanceFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeStudentPerformancePrompt',
  input: {schema: AnalyzeStudentPerformanceInputSchema},
  output: {schema: AnalyzeStudentPerformanceOutputSchema},
  prompt: `You are an AI assistant that analyzes student performance in chemistry.

  Based on the student\'s quiz results, experiment results, and the course material, identify the student\'s knowledge gaps and suggest relevant learning resources.

  Quiz Results: {{{quizResults}}}
  Experiment Results: {{{experimentResults}}}
  Course Material: {{{courseMaterial}}}

  Knowledge Gaps:
  Suggested Resources: `,
});

const analyzeStudentPerformanceFlow = ai.defineFlow(
  {
    name: 'analyzeStudentPerformanceFlow',
    inputSchema: AnalyzeStudentPerformanceInputSchema,
    outputSchema: AnalyzeStudentPerformanceOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
