
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { JiraIcon } from '@/components/dashboard/icons';
import { Loader2 } from 'lucide-react';

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);

    const formData = new FormData(event.currentTarget);
    const jiraUrl = formData.get('url') as string;
    const email = formData.get('email') as string;
    const token = formData.get('token') as string;

    // In a real app, you would authenticate against Jira.
    // For this demo, we'll just store the credentials in localStorage.
    localStorage.setItem('jira_credentials', JSON.stringify({ jiraUrl, email, token }));

    setTimeout(() => {
      router.push('/data-fetcher');
    }, 1000);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <form onSubmit={handleSubmit}>
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4">
               <JiraIcon className="h-12 w-12 text-primary" />
            </div>
            <CardTitle>Jira Insights Lite</CardTitle>
            <CardDescription>Connect to your Jira instance to begin</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="url">Jira Instance URL</Label>
              <Input
                id="url"
                name="url"
                type="url"
                placeholder="https://your-domain.atlassian.net"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Jira Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="user@example.com"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="token">API Token</Label>
              <Input id="token" name="token" type="password" required />
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Connect
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
}
