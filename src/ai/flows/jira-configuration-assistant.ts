'use server';

/**
 * @fileOverview Jira configuration assistant AI agent.
 *
 * - suggestJiraImprovements - A function that suggests improvements to Jira configuration.
 * - SuggestJiraImprovementsInput - The input type for the suggestJiraImprovements function.
 * - SuggestJiraImprovementsOutput - The return type for the suggestJiraImprovements function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestJiraImprovementsInputSchema = z.object({
  jiraDataSummary: z
    .string()
    .describe(
      'A summary of the Jira data, including project types, issue types, custom fields, and trends.'
    ),
});
export type SuggestJiraImprovementsInput = z.infer<typeof SuggestJiraImprovementsInputSchema>;

const SuggestJiraImprovementsOutputSchema = z.object({
  suggestions: z
    .string()
    .describe(
      'A list of suggestions for improving the Jira configuration, such as identifying underutilized custom fields or recommending new issue types.'
    ),
});
export type SuggestJiraImprovementsOutput = z.infer<typeof SuggestJiraImprovementsOutputSchema>;

export async function suggestJiraImprovements(
  input: SuggestJiraImprovementsInput
): Promise<SuggestJiraImprovementsOutput> {
  return suggestJiraImprovementsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestJiraImprovementsPrompt',
  input: {schema: SuggestJiraImprovementsInputSchema},
  output: {schema: SuggestJiraImprovementsOutputSchema},
  prompt: `You are an expert Jira administrator specializing in optimizing Jira configurations.

You will use the following summary of Jira data to suggest improvements to the Jira configuration.

Summary: {{{jiraDataSummary}}}

Based on this information, provide a list of specific, actionable suggestions for improving the Jira configuration. Consider suggesting new issue types, identifying underutilized custom fields, and recommending changes to workflow.

Suggestions:`,
});

const suggestJiraImprovementsFlow = ai.defineFlow(
  {
    name: 'suggestJiraImprovementsFlow',
    inputSchema: SuggestJiraImprovementsInputSchema,
    outputSchema: SuggestJiraImprovementsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
