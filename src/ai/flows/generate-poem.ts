'use server';
/**
 * @fileOverview Generates a poem based on the analyzed image content.
 *
 * - generatePoem - A function that handles the poem generation process.
 * - GeneratePoemInput - The input type for the generatePoem function.
 * - GeneratePoemOutput - The return type for the generatePoem function.
 */

import {ai} from '@/ai/ai-instance';
import {z} from 'genkit';

const GeneratePoemInputSchema = z.object({
  imageAnalysis: z.string().describe('The analysis of the image content.'),
  language: z.enum(['en', 'zh']).describe('The language of the generated poem.').default('en'),
});

export type GeneratePoemInput = z.infer<typeof GeneratePoemInputSchema>;

const GeneratePoemOutputSchema = z.object({
  poem: z.string().describe('The generated poem based on the image analysis.'),
});
export type GeneratePoemOutput = z.infer<typeof GeneratePoemOutputSchema>;

export async function generatePoem(input: GeneratePoemInput): Promise<GeneratePoemOutput> {
  try {
    return generatePoemFlow(input);
  } catch (error) {
    console.error('Error in generatePoem:', error);
    throw error; // Re-throw the error to be caught by the caller
  }
}

const poemPrompt = ai.definePrompt({
  name: 'poemPrompt',
  input: {
    schema: z.object({
      imageAnalysis: z.string().describe('The analysis of the image content.'),
      language: z.enum(['en', 'zh']).describe('The language of the generated poem.').default('en'),
    }),
  },
  output: {
    schema: z.object({
      poem: z.string().describe('The generated poem based on the image analysis.'),
    }),
  },
  prompt: `You are a poet. Generate a poem based on the following image analysis. The poem should be in {{{language}}} language.

Image Analysis: {{{imageAnalysis}}}

Poem:`,
});

const generatePoemFlow = ai.defineFlow<
  typeof GeneratePoemInputSchema,
  typeof GeneratePoemOutputSchema
>(
  {
    name: 'generatePoemFlow',
    inputSchema: GeneratePoemInputSchema,
    outputSchema: GeneratePoemOutputSchema,
  },
  async input => {
    try {
      const {output} = await poemPrompt(input);
      return output!;
    } catch (error) {
      console.error('Error in generatePoemFlow:', error);
      throw error; // Re-throw the error to be caught by the caller
    }
  }
);
