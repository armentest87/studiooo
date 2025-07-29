'use client';

import { useMemo } from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { issues } from '@/lib/mock-data';
import { subDays, eachDayOfInterval, format } from 'date-fns';

const STATUS_MAP = {
  'To Do': 'To Do',
  'Backlog': 'To Do',
  'In Progress': 'In Progress',
  'Done': 'Done',
};

type CfdDataPoint = {
  date: string;
  'To Do': number;
  'In Progress': number;
  'Done': number;
};

export default function CumulativeFlow() {
  const cfdData = useMemo(() => {
    if (issues.length === 0) return [];

    const startDate = subDays(new Date(), 45);
    const endDate = new Date();
    const dateRange = eachDayOfInterval({ start: startDate, end: endDate });

    const dailySnapshots: CfdDataPoint[] = dateRange.map(date => {
      const formattedDate = format(date, 'MMM d');
      const dataPoint: CfdDataPoint = { date: formattedDate, 'To Do': 0, 'In Progress': 0, 'Done': 0 };

      issues.forEach(issue => {
        const issueCreationDate = new Date(issue.fields.created);
        if (issueCreationDate <= date) {
          let statusOnDate = issue.changelog?.histories
            .filter(h => new Date(h.created) <= date && h.items.some(item => item.field === 'status'))
            .sort((a, b) => new Date(b.created).getTime() - new Date(a.created).getTime())
            [0]?.items.find(item => item.field === 'status')?.toString;

          if (!statusOnDate) {
              statusOnDate = 'To Do' // Assume it was in To Do if no status change found
          }
          
          const mappedStatus = STATUS_MAP[statusOnDate as keyof typeof STATUS_MAP];
          if (mappedStatus) {
            dataPoint[mappedStatus]++;
          }
        }
      });
      
      // A simple approximation: if no explicit status change, assume it starts in 'To Do'
      issues.forEach(issue => {
        const issueCreationDate = new Date(issue.fields.created);
        if (issueCreationDate <= date) {
          const relevantHistories = issue.changelog?.histories
            .filter(h => new Date(h.created) <= date && h.items.some(item => item.field === 'status')) || [];

          if (relevantHistories.length === 0) {
             const mappedStatus = STATUS_MAP[issue.fields.status.name as keyof typeof STATUS_MAP];
             if (mappedStatus && mappedStatus !== "Done") {
                 dataPoint['To Do']++;
             } else if (mappedStatus === "Done" && new Date(issue.fields.resolutiondate!) <= date) {
                 dataPoint['Done']++;
             }
          } else {
             const latestHistory = relevantHistories.sort((a,b) => new Date(b.created).getTime() - new Date(a.created).getTime())[0];
             const status = latestHistory.items.find(i => i.field === 'status')?.toString;
             const mappedStatus = STATUS_MAP[status as keyof typeof STATUS_MAP];
             if (mappedStatus) {
                 dataPoint[mappedStatus]++;
             }
          }
        }
      });

      // A better simplified model
      const statusCounts = { 'To Do': 0, 'In Progress': 0, 'Done': 0 };
       issues.forEach(issue => {
         const issueCreationDate = new Date(issue.fields.created);
         if (issueCreationDate > date) return;

         let currentStatus = 'To Do';
         const statusChanges = issue.changelog?.histories
            .filter(h => new Date(h.created) <= date && h.items.some(item => item.field === 'status'))
            .sort((a, b) => new Date(a.created).getTime() - new Date(b.created).getTime())
            .flatMap(h => h.items.filter(item => item.field === 'status')) || [];

        if (statusChanges.length > 0) {
            currentStatus = statusChanges[statusChanges.length - 1].toString || "To Do";
        }
        
        const mappedStatus = STATUS_MAP[currentStatus as keyof typeof STATUS_MAP];
        if (mappedStatus) {
            statusCounts[mappedStatus]++;
        }
       });

      return { date: formattedDate, ...statusCounts };
    });

    return dailySnapshots;
  }, []);


  return (
    <Card>
      <CardHeader>
        <CardTitle>Cumulative Flow Diagram (CFD)</CardTitle>
        <CardDescription>
          Visualizes the number of issues in each status category over time.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={400}>
          <AreaChart data={cfdData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <XAxis dataKey="date" stroke="hsl(var(--foreground))" fontSize={12} />
            <YAxis stroke="hsl(var(--foreground))" fontSize={12} />
            <Tooltip
              cursor={{ fill: 'hsl(var(--muted))' }}
              contentStyle={{
                background: "hsl(var(--background))",
                borderColor: "hsl(var(--border))",
              }}
            />
            <Legend />
            <Area type="monotone" dataKey="To Do" stackId="1" stroke="hsl(var(--chart-3))" fill="hsl(var(--chart-3))" />
            <Area type="monotone" dataKey="In Progress" stackId="1" stroke="hsl(var(--chart-4))" fill="hsl(var(--chart-4))" />
            <Area type="monotone" dataKey="Done" stackId="1" stroke="hsl(var(--chart-2))" fill="hsl(var(--chart-2))" />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
