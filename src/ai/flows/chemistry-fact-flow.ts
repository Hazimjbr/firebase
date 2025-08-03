'use server';
/**
 * @fileOverview A flow that returns a random, fun chemistry fact.
 *
 * - getChemistryFact - A function that returns a fun chemistry fact.
 * - ChemistryFactOutput - The return type for the getChemistryFact function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ChemistryFactOutputSchema = z.object({
  fact: z.string().describe('A surprising and fun fact about chemistry.'),
});
export type ChemistryFactOutput = z.infer<typeof ChemistryFactOutputSchema>;

export async function getChemistryFact(): Promise<ChemistryFactOutput> {
  return chemistryFactFlow();
}

const prompt = ai.definePrompt({
  name: 'chemistryFactPrompt',
  output: {schema: ChemistryFactOutputSchema},
  prompt: `You are a chemistry enthusiast. Provide one surprising and fun fact about chemistry.`,
});

const chemistryFactFlow = ai.defineFlow(
  {
    name: 'chemistryFactFlow',
    outputSchema: ChemistryFactOutputSchema,
  },
  async () => {
    const {output} = await prompt({});
    return output!;
  }
);
