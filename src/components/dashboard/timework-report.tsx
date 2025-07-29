'use client';

import { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { issues, users } from '@/lib/mock-data';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export default function TimeworkReport() {
  const timeDataByAssignee = useMemo(() => {
    const data = users.map(user => {
      const assignedIssues = issues.filter(i => i.fields.assignee?.accountId === user.accountId);
      const estimated = assignedIssues.reduce((acc, i) => acc + (i.fields.timeoriginalestimate || 0), 0) / 3600;
      const logged = assignedIssues.reduce((acc, i) => acc + (i.fields.timespent || 0), 0) / 3600;
      return {
        name: user.displayName,
        estimated,
        logged,
        variance: logged - estimated,
        issueCount: assignedIssues.length,
        avatar: user.avatarUrls['48x48'],
      };
    });
    return data;
  }, []);

  return (
    <div className="flex flex-col gap-4">
      <Card>
        <CardHeader>
          <CardTitle>Workload Analysis</CardTitle>
          <CardDescription>Comparison of estimated vs. logged hours and total issues per assignee.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={timeDataByAssignee}>
              <XAxis dataKey="name" stroke="hsl(var(--foreground))" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis label={{ value: 'Hours', angle: -90, position: 'insideLeft', fill: 'hsl(var(--foreground))' }} stroke="hsl(var(--foreground))" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip cursor={{ fill: 'hsl(var(--muted))' }} contentStyle={{ background: "hsl(var(--background))", borderColor: "hsl(var(--border))" }} />
              <Legend />
              <Bar dataKey="estimated" name="Estimated Hours" fill="hsl(var(--chart-1))" radius={[4, 4, 0, 0]} />
              <Bar dataKey="logged" name="Logged Hours" fill="hsl(var(--chart-2))" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={timeDataByAssignee}>
              <XAxis dataKey="name" stroke="hsl(var(--foreground))" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis label={{ value: 'Issues', angle: -90, position: 'insideLeft', fill: 'hsl(var(--foreground))' }} stroke="hsl(var(--foreground))" fontSize={12} tickLine={false} axisLine={false} allowDecimals={false} />
              <Tooltip cursor={{ fill: 'hsl(var(--muted))' }} contentStyle={{ background: "hsl(var(--background))", borderColor: "hsl(var(--border))" }} />
              <Bar dataKey="issueCount" name="Total Issues" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Detailed Time Variance</CardTitle>
          <CardDescription>A breakdown of estimated, logged, and variance hours for each team member.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Assignee</TableHead>
                <TableHead className="text-right">Estimated Hours</TableHead>
                <TableHead className="text-right">Logged Hours</TableHead>
                <TableHead className="text-right">Variance (Hours)</TableHead>
                <TableHead className="text-right">Issue Count</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {timeDataByAssignee.map(data => (
                <TableRow key={data.name}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                       <Avatar className="h-8 w-8">
                        <AvatarImage src={data.avatar} alt={data.name} data-ai-hint="avatar"/>
                        <AvatarFallback>{data.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <span className="font-medium">{data.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">{data.estimated.toFixed(2)}</TableCell>
                  <TableCell className="text-right">{data.logged.toFixed(2)}</TableCell>
                  <TableCell className="text-right">
                    <Badge variant={data.variance > 0 ? 'destructive' : 'secondary'}>
                      {data.variance.toFixed(2)}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">{data.issueCount}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
