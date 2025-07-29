
'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Server, Terminal } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { CalendarIcon } from 'lucide-react';
import { Calendar } from '../ui/calendar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { projects, issues } from '@/lib/mock-data';

const issueTypes = [...new Set(issues.map(i => i.fields.issuetype.name))];
const statuses = [...new Set(issues.map(i => i.fields.status.name))];


export default function DataFetcher() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [jql, setJql] = useState("project = 'PHX' AND status in ('To Do', 'In Progress', 'Done', 'Backlog')");
  const [createdDate, setCreatedDate] = useState<Date>();
  const [updatedDate, setUpdatedDate] = useState<Date>();

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
        setError("Failed to fetch data. Please check your filters and connection details. Note: This is a demo and fetching is not implemented.");
    }, 2000);
  };
  
  const handleBasicFilterChange = (filters: any) => {
    // This function would dynamically build a JQL query from basic filters
    let queryParts = [];
    if(filters.project) queryParts.push(`project = "${filters.project}"`);
    if(filters.issueType) queryParts.push(`issuetype = "${filters.issueType}"`);
    if(filters.status) queryParts.push(`status = "${filters.status}"`);
    if(filters.createdDate) queryParts.push(`created >= "${format(filters.createdDate, 'yyyy-MM-dd')}"`);
    if(filters.updatedDate) queryParts.push(`updated >= "${format(filters.updatedDate, 'yyyy-MM-dd')}"`);
    
    setJql(queryParts.join(' AND '));
  }


  return (
    <Card>
      <CardHeader>
        <CardTitle>Jira Data Fetcher</CardTitle>
        <CardDescription>
          Fetch issue data using either basic filters or an advanced JQL query.
          The dashboards will update with the fetched data.
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
            <Tabs defaultValue="basic" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="basic">Basic Filters</TabsTrigger>
                    <TabsTrigger value="jql">Advanced JQL</TabsTrigger>
                </TabsList>
                <TabsContent value="basic" className="pt-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div className="space-y-2">
                            <Label>Project</Label>
                             <Select onValueChange={(val) => handleBasicFilterChange({project: val})}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select a project" />
                                </SelectTrigger>
                                <SelectContent>
                                    {projects.map(p => <SelectItem key={p.id} value={p.key}>{p.name}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>
                         <div className="space-y-2">
                            <Label>Issue Type</Label>
                            <Select onValueChange={(val) => handleBasicFilterChange({issueType: val})}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select an issue type" />
                                </SelectTrigger>
                                <SelectContent>
                                    {issueTypes.map(it => <SelectItem key={it} value={it}>{it}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>
                         <div className="space-y-2">
                            <Label>Status</Label>
                            <Select onValueChange={(val) => handleBasicFilterChange({status: val})}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select a status" />
                                </SelectTrigger>
                                <SelectContent>
                                    {statuses.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label>Created After</Label>
                            <Popover>
                                <PopoverTrigger asChild>
                                <Button
                                    variant={"outline"}
                                    className={cn(
                                    "w-full justify-start text-left font-normal",
                                    !createdDate && "text-muted-foreground"
                                    )}
                                >
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {createdDate ? format(createdDate, "PPP") : <span>Pick a date</span>}
                                </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0">
                                    <Calendar
                                        mode="single"
                                        selected={createdDate}
                                        onSelect={(d) => { setCreatedDate(d); handleBasicFilterChange({createdDate: d}) }}
                                        initialFocus
                                    />
                                </PopoverContent>
                            </Popover>
                        </div>
                        <div className="space-y-2">
                            <Label>Updated After</Label>
                            <Popover>
                                <PopoverTrigger asChild>
                                <Button
                                    variant={"outline"}
                                    className={cn(
                                    "w-full justify-start text-left font-normal",
                                    !updatedDate && "text-muted-foreground"
                                    )}
                                >
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {updatedDate ? format(updatedDate, "PPP") : <span>Pick a date</span>}
                                </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0">
                                    <Calendar
                                        mode="single"
                                        selected={updatedDate}
                                        onSelect={(d) => { setUpdatedDate(d); handleBasicFilterChange({updatedDate: d}) }}
                                        initialFocus
                                    />
                                </PopoverContent>
                            </Popover>
                        </div>
                    </div>
                </TabsContent>
                <TabsContent value="jql" className="pt-4">
                     <div className="space-y-2">
                        <Label htmlFor="jql">JQL Query</Label>
                        <Textarea
                            id="jql"
                            name="jql"
                            placeholder="project = 'PROJ' AND status = 'Done' ORDER BY created DESC"
                            className="min-h-[100px] text-base font-mono"
                            value={jql}
                            onChange={(e) => setJql(e.target.value)}
                            required
                        />
                    </div>
                </TabsContent>
            </Tabs>
           
             <p className="text-sm text-muted-foreground pt-4">
                Note: For this demo, the dashboards will continue to use mock data regardless of the query.
             </p>
        
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
      </form>
    </Card>
  );
}
