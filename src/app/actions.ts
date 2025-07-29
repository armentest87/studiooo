'use server';

import { suggestJiraImprovements } from '@/ai/flows/jira-configuration-assistant';
import { z } from 'zod';

const SuggestionSchema = z.object({
  summary: z.string().min(10, "Summary must be at least 10 characters long."),
});

interface SuggestionState {
  suggestions?: string;
  error?: string;
}

export async function getConfigurationSuggestions(
  prevState: SuggestionState,
  formData: FormData
): Promise<SuggestionState> {
  const validatedFields = SuggestionSchema.safeParse({
    summary: formData.get('summary'),
  });

  if (!validatedFields.success) {
    return {
      error: validatedFields.error.flatten().fieldErrors.summary?.join(', '),
    };
  }

  try {
    const result = await suggestJiraImprovements({
      jiraDataSummary: validatedFields.data.summary,
    });
    return { suggestions: result.suggestions };
  } catch (e) {
    console.error(e);
    return { error: 'An unexpected error occurred. Please try again.' };
  }
}
