'use client';

import { useActionState, useMemo } from 'react';
import { useFormStatus } from 'react-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { getConfigurationSuggestions } from '@/app/actions';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Lightbulb, Terminal, Loader2 } from 'lucide-react';
import { issues, projects } from '@/lib/mock-data';

const initialState = {
  suggestions: '',
  error: '',
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Lightbulb className="mr-2 h-4 w-4" />}
      Get Suggestions
    </Button>
  );
}

export default function ConfigurationAssistant() {
  const [state, formAction] = useActionState(getConfigurationSuggestions, initialState);

  const defaultSummary = useMemo(() => {
    const totalProjects = projects.length;
    const softwareProjects = projects.filter(p => p.projectTypeKey === 'software').length;
    const businessProjects = totalProjects - softwareProjects;
    
    const issueTypes = issues.reduce((acc, i) => {
        acc[i.fields.issuetype.name] = (acc[i.fields.issuetype.name] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    const issueTypeSummary = Object.entries(issueTypes)
        .map(([type, count]) => `${count} ${type}(s)`)
        .join(', ');

    return `We have ${totalProjects} projects in total: ${softwareProjects} software and ${businessProjects} business.
Our issue distribution is: ${issueTypeSummary}.
We use story points for estimation in software projects.
Analyze our setup for potential improvements in workflow, custom fields, and issue type usage.`;
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Configuration Assistant</CardTitle>
        <CardDescription>
          Get AI-powered suggestions to improve your Jira configuration. Describe your setup, and the assistant will provide actionable advice.
        </CardDescription>
      </CardHeader>
      <form action={formAction}>
        <CardContent className="space-y-4">
          <Textarea
            name="summary"
            placeholder="Describe your Jira data summary here..."
            className="min-h-[150px] text-base"
            defaultValue={defaultSummary}
          />

          {state.suggestions && (
            <Alert>
              <Lightbulb className="h-4 w-4" />
              <AlertTitle>AI Suggestions</AlertTitle>
              <AlertDescription>
                <div className="prose prose-sm dark:prose-invert max-w-none whitespace-pre-wrap">
                  {state.suggestions}
                </div>
              </AlertDescription>
            </Alert>
          )}
          
          {state.error && (
            <Alert variant="destructive">
              <Terminal className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{state.error}</AlertDescription>
            </Alert>
          )}
        </CardContent>
        <CardFooter>
          <SubmitButton />
        </CardFooter>
      </form>
    </Card>
  );
}
