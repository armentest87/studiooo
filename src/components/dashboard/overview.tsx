'use client';

import { useMemo } from 'react';
import { Bar, BarChart, Pie, PieChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend, Cell } from 'recharts';
import { ListTodo, CheckCircle2, CircleDot, Activity, Clock } from 'lucide-react';
import { issues } from '@/lib/mock-data';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { MetricCard } from '@/components/dashboard/metric-card';
import { differenceInDays } from 'date-fns';

const COLORS = ['hsl(var(--chart-1))', 'hsl(var(--chart-2))', 'hsl(var(--chart-3))', 'hsl(var(--chart-4))'];

export default function Overview() {
  const kpis = useMemo(() => {
    const totalIssues = issues.length;
    const completedIssues = issues.filter(i => i.fields.status.name === 'Done').length;
    const inProgressIssues = issues.filter(i => i.fields.status.name === 'In Progress').length;
    const todoIssues = issues.filter(i => i.fields.status.name === 'To Do' || i.fields.status.name === 'Backlog').length;
    const completionRate = totalIssues > 0 ? (completedIssues / totalIssues) * 100 : 0;
    
    const resolvedIssues = issues.filter(i => i.fields.resolutiondate);
    const totalResolutionDays = resolvedIssues.reduce((acc, i) => {
        return acc + differenceInDays(new Date(i.fields.resolutiondate!), new Date(i.fields.created));
    }, 0);
    const avgResolutionTime = resolvedIssues.length > 0 ? totalResolutionDays / resolvedIssues.length : 0;

    return { totalIssues, completedIssues, inProgressIssues, todoIssues, completionRate, avgResolutionTime };
  }, []);

  const issuesByStatus = useMemo(() => {
    const counts = issues.reduce((acc, i) => {
      acc[i.fields.status.name] = (acc[i.fields.status.name] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, []);
  
  const issuesByType = useMemo(() => {
    const counts = issues.reduce((acc, i) => {
      acc[i.fields.issuetype.name] = (acc[i.fields.issuetype.name] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, []);

  const recentIssues = useMemo(() => {
    return [...issues]
      .sort((a, b) => new Date(b.fields.created).getTime() - new Date(a.fields.created).getTime())
      .slice(0, 10);
  }, []);

  return (
    <>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <MetricCard title="Total Issues" value={kpis.totalIssues} icon={ListTodo} />
        <MetricCard title="Completed" value={kpis.completedIssues} icon={CheckCircle2} />
        <MetricCard title="Completion Rate" value={`${kpis.completionRate.toFixed(1)}%`} icon={CircleDot} />
        <MetricCard title="In Progress" value={kpis.inProgressIssues} icon={Activity} />
        <MetricCard title="To Do" value={kpis.todoIssues} icon={ListTodo} />
        <MetricCard title="Avg. Resolution" value={`${kpis.avgResolutionTime.toFixed(1)} days`} icon={Clock} />
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Issues by Status</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie data={issuesByStatus} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                   {issuesByStatus.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ background: "hsl(var(--background))", borderColor: "hsl(var(--border))" }} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card className="lg:col-span-4">
          <CardHeader>
            <CardTitle>Issues by Type</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={issuesByType}>
                <XAxis dataKey="name" stroke="hsl(var(--foreground))" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="hsl(var(--foreground))" fontSize={12} tickLine={false} axisLine={false} allowDecimals={false} />
                <Tooltip
                  cursor={{ fill: 'hsl(var(--muted))' }}
                  contentStyle={{ background: "hsl(var(--background))", borderColor: "hsl(var(--border))" }} />
                <Bar dataKey="value" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Recent Issues</CardTitle>
          <CardDescription>The 10 most recently created issues.</CardDescription>
        </CardHeader>
        <CardContent>
           <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Key</TableHead>
                <TableHead>Summary</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Created</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentIssues.map((issue) => (
                <TableRow key={issue.id}>
                  <TableCell>
                    <Badge variant="outline">{issue.key}</Badge>
                  </TableCell>
                  <TableCell className="font-medium">{issue.fields.summary}</TableCell>
                  <TableCell><Badge variant="secondary">{issue.fields.status.name}</Badge></TableCell>
                  <TableCell>{issue.fields.issuetype.name}</TableCell>
                  <TableCell>{issue.fields.priority.name}</TableCell>
                  <TableCell>{new Date(issue.fields.created).toLocaleDateString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </>
  );
}
