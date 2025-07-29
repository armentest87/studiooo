'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Server } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
import { Terminal } from 'lucide-react';

export default function DataFetcher() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);
    // In a real application, you would make an API call to a backend server
    // to fetch Jira data securely. This is a placeholder for that logic.
    setTimeout(() => {
        setIsLoading(false);
        // This is a mock error. In a real app, you would handle success and error states
        // based on the API response.
        setError("Failed to fetch data. Please check your JQL query and connection details. Note: This is a demo and fetching is not implemented.");
    }, 2000);
  };

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader>
          <CardTitle>Jira Data Fetcher</CardTitle>
          <CardDescription>
            Connect to your Jira instance and fetch issue data using a JQL query.
            The dashboards will update with the fetched data.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="jql">JQL Query</Label>
                <Textarea
                    id="jql"
                    name="jql"
                    placeholder="project = 'PROJ' AND status = 'Done' ORDER BY created DESC"
                    className="min-h-[100px] text-base"
                    defaultValue="project = 'PHX' AND status in ('To Do', 'In Progress', 'Done', 'Backlog')"
                    required
                />
                 <p className="text-sm text-muted-foreground">
                    Note: For this demo, the dashboards will continue to use mock data regardless of the query.
                 </p>
            </div>
            {error && (
                <Alert variant="destructive">
                <Terminal className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}
        </CardContent>
        <CardFooter>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Server className="mr-2 h-4 w-4" />}
            Fetch Data
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
}
