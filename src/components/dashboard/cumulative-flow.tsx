
'use client';

import { useMemo } from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { issues } from '@/lib/mock-data';
import { subDays, eachDayOfInterval, format, startOfDay } from 'date-fns';

const STATUS_MAP: Record<string, 'To Do' | 'In Progress' | 'Done'> = {
  'To Do': 'To Do',
  'Backlog': 'To Do',
  'In Progress': 'In Progress',
  'In Review': 'In Progress',
  'Done': 'Done',
  'Closed': 'Done',
  'Resolved': 'Done',
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

    const thirtyDaysAgo = subDays(new Date(), 30);
    const issueCreationDates = issues.map(i => new Date(i.fields.created));
    const firstCreationDate = new Date(Math.min(...issueCreationDates.map(d => d.getTime())));
    const startDate = thirtyDaysAgo < firstCreationDate ? thirtyDaysAgo : firstCreationDate;
    const endDate = new Date();
    const dateRange = eachDayOfInterval({ start: startDate, end: endDate });

    const dailySnapshots: CfdDataPoint[] = dateRange.map(date => {
        const dateStartOfDay = startOfDay(date);
        const statusCounts: { [key in 'To Do' | 'In Progress' | 'Done']: number } = {
            'To Do': 0,
            'In Progress': 0,
            'Done': 0,
        };

        issues.forEach(issue => {
            const issueCreationDate = startOfDay(new Date(issue.fields.created));

            if (issueCreationDate > dateStartOfDay) {
                return; // Issue didn't exist yet
            }

            let statusOnDate = 'To Do'; // Default status at creation

            const relevantHistory = issue.changelog?.histories
                .map(h => ({ ...h, created: startOfDay(new Date(h.created)) }))
                .filter(h => h.created <= dateStartOfDay && h.items.some(item => item.field === 'status'))
                .sort((a, b) => b.created.getTime() - a.created.getTime());
            
            if (relevantHistory && relevantHistory.length > 0) {
                 const latestStatusChange = relevantHistory[0].items.find(item => item.field === 'status');
                 if(latestStatusChange && latestStatusChange.toString) {
                    statusOnDate = latestStatusChange.toString;
                 }
            } else {
                // If no history before or on the date, its status is the one at creation, if that's before date
                statusOnDate = issue.fields.status.name;
            }
            
            // If the issue was created on this day, its first status is its current status unless a change happened
            if (issueCreationDate.getTime() === dateStartOfDay.getTime()) {
                statusOnDate = issue.fields.status.name;
            }


            const mappedStatus = STATUS_MAP[statusOnDate as keyof typeof STATUS_MAP] || 'In Progress';
            statusCounts[mappedStatus]++;
        });

        return {
            date: format(date, 'MMM d'),
            ...statusCounts,
        };
    });

    // The logic to calculate CFD data from the Python script has been adapted here.
    // It iterates through a date range and calculates the number of issues in each status category for each day.
    // This involves checking the issue's creation date and its status changes from the changelog.
    const statusChanges: any[] = [];
    issues.forEach(row => {
        if(row.changelog) {
            row.changelog.histories.forEach(hist => {
                hist.items.forEach(item => {
                    if (item.field === 'status') {
                        statusChanges.push({
                            key: row.key,
                            date: startOfDay(new Date(hist.created)),
                            status: item.toString
                        });
                    }
                });
            });
        }
        statusChanges.push({
            key: row.key,
            date: startOfDay(new Date(row.fields.created)),
            status: 'To Do'
        });
    });

    if (statusChanges.length === 0) return [];
    
    const statusDf = statusChanges.sort((a,b) => a.date - b.date).filter((v,i,a)=>a.findIndex(t=>(t.key === v.key && t.date === v.date))===i);
    
    const allKeys = [...new Set(statusDf.map(item => item.key))];
    const gridData = allKeys.flatMap(key => dateRange.map(date => ({key, date: startOfDay(date)})));
    
    let merged = gridData.map(gridItem => {
        const correspondingStatus = statusDf.find(s => s.key === gridItem.key && s.date.getTime() === gridItem.date.getTime());
        return {...gridItem, status: correspondingStatus ? correspondingStatus.status : null};
    });
    
    merged = merged.sort((a,b) => a.key.localeCompare(b.key) || a.date - b.date);

    let lastStatus: {[key: string]: string | null} = {};
    merged.forEach(item => {
        if(item.status) {
            lastStatus[item.key] = item.status;
        } else if (lastStatus[item.key]) {
            item.status = lastStatus[item.key];
        }
    });

    const cfdCounts = dateRange.map(date => {
        const dailyData = merged.filter(d => d.date.getTime() === startOfDay(date).getTime() && d.status);
        const counts = { 'To Do': 0, 'In Progress': 0, 'Done': 0 };
        dailyData.forEach(d => {
            const mappedStatus = STATUS_MAP[d.status! as keyof typeof STATUS_MAP] || 'In Progress';
            counts[mappedStatus]++;
        });
        return {date: format(date, 'MMM d'), ...counts};
    });


    return cfdCounts;
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
            <YAxis stroke="hsl(var(--foreground))" fontSize={12} allowDecimals={false}/>
            <Tooltip
              cursor={{ fill: 'hsl(var(--muted))' }}
              contentStyle={{
                background: "hsl(var(--background))",
                borderColor: "hsl(var(--border))",
              }}
            />
            <Legend />
            <Area type="monotone" dataKey="To Do" stackId="1" name="Backlog" stroke="hsl(var(--chart-3))" fill="hsl(var(--chart-3))" />
            <Area type="monotone" dataKey="In Progress" stackId="1" stroke="hsl(var(--chart-4))" fill="hsl(var(--chart-4))" />
            <Area type="monotone" dataKey="Done" stackId="1" stroke="hsl(var(--chart-2))" fill="hsl(var(--chart-2))" />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
