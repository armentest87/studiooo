
'use client';

import { useState, useMemo } from 'react';
import { Bar, BarChart, Pie, PieChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend, Cell, Line, LineChart } from 'recharts';
import { sprints, issues, users } from '@/lib/mock-data';
import type { User } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { MetricCard } from './metric-card';
import { GitCommit, GitPullRequest, PieChart as PieChartIcon, User as UserIcon } from 'lucide-react';
import { eachDayOfInterval, format, differenceInDays, isAfter, parseISO, startOfDay } from 'date-fns';

const COLORS = ['hsl(var(--chart-1))', 'hsl(var(--chart-2))', 'hsl(var(--chart-3))', 'hsl(var(--chart-4))'];

export default function SprintAnalysis() {
  const [selectedSprintId, setSelectedSprintId] = useState<string>(sprints.find(s => s.state === 'active')?.id.toString() || sprints[sprints.length - 1].id.toString());
  const [estimationUnit, setEstimationUnit] = useState<'points' | 'count'>('points');
  const [selectedAssigneeId, setSelectedAssigneeId] = useState<string | null>(null);


  const selectedSprint = useMemo(() => {
    return sprints.find(s => s.id.toString() === selectedSprintId);
  }, [selectedSprintId]);

  const historicalVelocity = useMemo(() => {
    const closedSprints = sprints.filter(s => s.state === 'closed');
    return closedSprints.map(sprint => {
      const sprintIssues = issues.filter(i => 
        i.fields['customfield_10007']?.some(s => s.id === sprint.id) && 
        i.fields.status.name === 'Done'
      );
      const value = sprintIssues.reduce((acc, i) => {
        return acc + (estimationUnit === 'points' ? (i.fields['customfield_10004'] || 0) : 1);
      }, 0);
      return { name: sprint.name, value };
    }).sort((a,b) => a.name.localeCompare(b.name));
  }, [estimationUnit]);

  const sprintAnalysis = useMemo(() => {
    if (!selectedSprint) return null;

    const sprintIssues = issues.filter(i => i.fields['customfield_10007']?.some(s => s.id === selectedSprint.id));
    const committed = sprintIssues.reduce((acc, i) => acc + (estimationUnit === 'points' ? (i.fields['customfield_10004'] || 0) : 1), 0);
    const completedIssues = sprintIssues.filter(i => i.fields.status.name === 'Done');
    const completed = completedIssues.reduce((acc, i) => acc + (estimationUnit === 'points' ? (i.fields['customfield_10004'] || 0) : 1), 0);
    const statusDistribution = sprintIssues.reduce((acc, i) => {
      acc[i.fields.status.name] = (acc[i.fields.status.name] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    const statusData = Object.entries(statusDistribution).map(([name, value]) => ({ name, value }));

    const sprintAssignees: User[] = [];
    const assigneeIds = new Set<string>();
    sprintIssues.forEach(issue => {
        if(issue.fields.assignee && !assigneeIds.has(issue.fields.assignee.accountId)) {
            sprintAssignees.push(issue.fields.assignee);
            assigneeIds.add(issue.fields.assignee.accountId);
        }
    });

    return { committed, completed, statusData, sprintIssues, completedIssues, sprintAssignees };
  }, [selectedSprint, estimationUnit]);

  const calculateBurndown = (issues: any[], totalCommitted: number, startDate: Date, endDate: Date, unit: 'points' | 'count') => {
    const unit_col = unit === 'points' ? 'customfield_10004' : null;
    const dateRange = eachDayOfInterval({ start: startDate, end: endDate });

    const resolvedIssues = issues
        .filter(i => i.fields.resolutiondate)
        .map(i => ({
            resolvedDate: startOfDay(parseISO(i.fields.resolutiondate!)),
            value: unit_col ? (i.fields[unit_col] || 0) : 1
        }))
        .sort((a,b) => a.resolvedDate.getTime() - b.resolvedDate.getTime());

    if (totalCommitted <= 0) return [];
    if (resolvedIssues.length === 0) {
       return dateRange.map((day, index) => ({
            day: format(day, 'MMM d'),
            'Ideal': totalCommitted - (totalCommitted / (dateRange.length > 1 ? dateRange.length - 1 : 1) * index),
            'Remaining': totalCommitted,
        }));
    }
    
    let cumulativeCompleted = 0;
    const dailyRemaining = dateRange.map((day, index) => {
        const completedOnDay = resolvedIssues
            .filter(i => i.resolvedDate.getTime() === day.getTime())
            .reduce((sum, i) => sum + i.value, 0);
        
        cumulativeCompleted += completedOnDay;

        return {
            day: format(day, 'MMM d'),
            'Ideal': totalCommitted - (totalCommitted / (dateRange.length > 1 ? dateRange.length - 1 : 1) * index),
            'Remaining': totalCommitted - cumulativeCompleted,
        };
    });

    return dailyRemaining;
  }

  const sprintBurndownData = useMemo(() => {
    if (!selectedSprint || !sprintAnalysis) return [];
    const { sprintIssues, committed } = sprintAnalysis;
    const sprintStart = startOfDay(parseISO(selectedSprint.startDate));
    const sprintEnd = startOfDay(parseISO(selectedSprint.endDate));
    return calculateBurndown(sprintIssues, committed, sprintStart, sprintEnd, estimationUnit);
  }, [selectedSprint, sprintAnalysis, estimationUnit]);

  const assigneeBurndownData = useMemo(() => {
    if (!selectedSprint || !sprintAnalysis || !selectedAssigneeId) return [];

    const { sprintIssues } = sprintAnalysis;
    const assigneeIssues = sprintIssues.filter(i => i.fields.assignee?.accountId === selectedAssigneeId);
    const committedForAssignee = assigneeIssues.reduce((acc, i) => acc + (estimationUnit === 'points' ? (i.fields['customfield_10004'] || 0) : 1), 0);
    
    const sprintStart = startOfDay(parseISO(selectedSprint.startDate));
    const sprintEnd = startOfDay(parseISO(selectedSprint.endDate));

    return calculateBurndown(assigneeIssues, committedForAssignee, sprintStart, sprintEnd, estimationUnit);
  }, [selectedSprint, sprintAnalysis, estimationUnit, selectedAssigneeId]);


  return (
    <div className="flex flex-col gap-4">
      <Card>
        <CardHeader>
          <CardTitle>Historical Sprint Velocity</CardTitle>
          <CardDescription>Amount of work completed in past sprints. Velocity is measured in {estimationUnit === 'points' ? 'Story Points' : 'Issue Count'}.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-end mb-4">
            <RadioGroup defaultValue="points" onValueChange={(value) => setEstimationUnit(value as 'points' | 'count')} className="flex items-center gap-4">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="points" id="points" />
                <Label htmlFor="points">Story Points</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="count" id="count" />
                <Label htmlFor="count">Issue Count</Label>
              </div>
            </RadioGroup>
          </div>
           {historicalVelocity.length > 0 && historicalVelocity.some(v => v.value > 0) ? (
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={historicalVelocity}>
                <XAxis dataKey="name" stroke="hsl(var(--foreground))" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="hsl(var(--foreground))" fontSize={12} tickLine={false} axisLine={false} allowDecimals={false}/>
                <Tooltip cursor={{ fill: 'hsl(var(--muted))' }} contentStyle={{ background: "hsl(var(--background))", borderColor: "hsl(var(--border))" }} formatter={(value) => `${(value as number).toFixed(1)}`} />
                <Bar dataKey="value" name={estimationUnit === 'points' ? 'Story Points' : 'Issues'} fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
           ) : (
            <div className="flex items-center justify-center h-[250px] text-muted-foreground">
                No completed issues with {estimationUnit === 'points' ? 'story points' : 'counts'} found to calculate velocity.
            </div>
           )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <CardTitle>Detailed Sprint Analysis</CardTitle>
              <CardDescription>In-depth look at a specific sprint.</CardDescription>
            </div>
            <Select value={selectedSprintId} onValueChange={(sId) => { setSelectedSprintId(sId); setSelectedAssigneeId(null);}}>
              <SelectTrigger className="w-full md:w-[280px]">
                <SelectValue placeholder="Select a sprint" />
              </SelectTrigger>
              <SelectContent>
                {sprints.map(sprint => (
                  <SelectItem key={sprint.id} value={sprint.id.toString()}>{sprint.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        {sprintAnalysis && selectedSprint && (
          <CardContent className="grid gap-4">
             <div className="grid gap-4 md:grid-cols-3">
                <MetricCard title="Committed" value={sprintAnalysis.committed.toFixed(1)} icon={GitCommit} description={estimationUnit === 'points' ? 'Story Points' : 'Issues'} />
                <MetricCard title="Completed" value={sprintAnalysis.completed.toFixed(1)} icon={GitPullRequest} description={estimationUnit === 'points' ? 'Story Points' : 'Issues'} />
                <MetricCard title="Completion Rate" value={`${sprintAnalysis.committed > 0 ? ((sprintAnalysis.completed / sprintAnalysis.committed) * 100).toFixed(0) : 0}%`} icon={PieChartIcon} />
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="lg:col-span-3">
                    <CardHeader>
                        <CardTitle>Issue Status</CardTitle>
                        <CardDescription>Distribution of issue statuses in the sprint.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie data={sprintAnalysis.statusData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                                    {sprintAnalysis.statusData.map((entry, index) => (
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
                        <CardTitle>Sprint Burndown Chart</CardTitle>
                        <CardDescription>Remaining work for the entire sprint, measured in {estimationUnit === 'points' ? 'Story Points' : 'Issue Count'}.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {sprintBurndownData.length > 0 ? (
                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={sprintBurndownData}>
                                <XAxis dataKey="day" stroke="hsl(var(--foreground))" fontSize={12} />
                                <YAxis stroke="hsl(var(--foreground))" fontSize={12} domain={[0, 'dataMax']} allowDecimals={false}/>
                                <Tooltip contentStyle={{ background: "hsl(var(--background))", borderColor: "hsl(var(--border))" }} formatter={(value) => (value as number).toFixed(1)} />
                                <Legend />
                                <Line type="monotone" dataKey="Ideal" stroke="hsl(var(--muted-foreground))" strokeDasharray="5 5" dot={false} />
                                <Line type="monotone" dataKey="Remaining" stroke="hsl(var(--primary))" strokeWidth={2} dot={false} />
                            </LineChart>
                        </ResponsiveContainer>
                        ) : (
                             <div className="flex items-center justify-center h-[300px] text-muted-foreground">
                                No resolved issues with estimation data found to draw a burndown chart.
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
          </CardContent>
        )}
      </Card>

      {sprintAnalysis && sprintAnalysis.sprintAssignees.length > 0 && (
         <Card>
            <CardHeader>
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                        <CardTitle>Assignee Burndown Chart</CardTitle>
                        <CardDescription>Track the remaining work for a specific team member in this sprint.</CardDescription>
                    </div>
                     <Select value={selectedAssigneeId || ''} onValueChange={setSelectedAssigneeId}>
                        <SelectTrigger className="w-full md:w-[280px]">
                            <SelectValue placeholder="Select an assignee" />
                        </SelectTrigger>
                        <SelectContent>
                            {sprintAnalysis.sprintAssignees.map(assignee => (
                            <SelectItem key={assignee.accountId} value={assignee.accountId}>{assignee.displayName}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </CardHeader>
            <CardContent>
                {selectedAssigneeId ? (
                     assigneeBurndownData.length > 0 ? (
                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={assigneeBurndownData}>
                                <XAxis dataKey="day" stroke="hsl(var(--foreground))" fontSize={12} />
                                <YAxis stroke="hsl(var(--foreground))" fontSize={12} domain={[0, 'dataMax']} allowDecimals={false}/>
                                <Tooltip contentStyle={{ background: "hsl(var(--background))", borderColor: "hsl(var(--border))" }} formatter={(value) => (value as number).toFixed(1)} />
                                <Legend />
                                <Line type="monotone" dataKey="Ideal" name="Ideal" stroke="hsl(var(--muted-foreground))" strokeDasharray="5 5" dot={false} />
                                <Line type="monotone" dataKey="Remaining" name="Remaining" stroke="hsl(var(--accent))" strokeWidth={2} dot={false} />
                            </LineChart>
                        </ResponsiveContainer>
                        ) : (
                             <div className="flex items-center justify-center h-[300px] text-muted-foreground">
                                No resolved issues with estimation data found for this assignee to draw a burndown chart.
                            </div>
                        )
                ) : (
                    <div className="flex items-center justify-center h-[300px] text-muted-foreground gap-2">
                        <UserIcon className="h-5 w-5" />
                        Please select an assignee to view their burndown chart.
                    </div>
                )}
            </CardContent>
         </Card>
      )}

    </div>
  );
}
