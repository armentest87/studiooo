
'use client';

import { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { MetricCard } from './metric-card';
import { issues, users } from '@/lib/mock-data';
import { CheckCircle, Briefcase, CalendarOff, Hourglass } from 'lucide-react';

const MOCK_CURRENT_USER_ID = 'u1'; // Assuming Alice is the logged-in user

// Mock HR Data
const mockHrData = {
  u1: { vacationDays: 12, sickDaysTaken: 3, targetHours: 40 },
  u2: { vacationDays: 5, sickDaysTaken: 1, targetHours: 40 },
  u3: { vacationDays: 8, sickDaysTaken: 5, targetHours: 35 },
  u4: { vacationDays: 20, sickDaysTaken: 0, targetHours: 40 },
};

const mockWeeklyHours = {
    u1: [ { day: 'Mon', logged: 8, target: 8 }, { day: 'Tue', logged: 7, target: 8 }, { day: 'Wed', logged: 9, target: 8 }, { day: 'Thu', logged: 8, target: 8 }, { day: 'Fri', logged: 6, target: 8 } ],
    u2: [ { day: 'Mon', logged: 8, target: 8 }, { day: 'Tue', logged: 8, target: 8 }, { day: 'Wed', logged: 8, target: 8 }, { day: 'Thu', logged: 8, target: 8 }, { day: 'Fri', logged: 8, target: 8 } ],
    u3: [ { day: 'Mon', logged: 7, target: 7 }, { day: 'Tue', logged: 7, target: 7 }, { day: 'Wed', logged: 6, target: 7 }, { day: 'Thu', logged: 7, target: 7 }, { day: 'Fri', logged: 8, target: 7 } ],
    u4: [ { day: 'Mon', logged: 9, target: 8 }, { day: 'Tue', logged: 9, target: 8 }, { day: 'Wed', logged: 9, target: 8 }, { day: 'Thu', logged: 9, target: 8 }, { day: 'Fri', logged: 5, target: 8 } ],
}


export default function MyDashboard() {
  const currentUser = useMemo(() => {
    return users.find(u => u.accountId === MOCK_CURRENT_USER_ID);
  }, []);

  const userIssues = useMemo(() => {
    return issues.filter(i => i.fields.assignee?.accountId === MOCK_CURRENT_USER_ID);
  }, []);
  
  const userKpis = useMemo(() => {
    const completedIssues = userIssues.filter(i => i.fields.status.name === 'Done').length;
    const totalHoursLogged = userIssues.reduce((acc, i) => acc + (i.fields.timespent || 0), 0) / 3600;
    const hrData = mockHrData[MOCK_CURRENT_USER_ID as keyof typeof mockHrData] || { vacationDays: 0, sickDaysTaken: 0, targetHours: 40 };
    return {
        completedIssues,
        totalHoursLogged,
        ...hrData
    }
  }, [userIssues]);

  const recentCompletedWork = useMemo(() => {
     return userIssues
        .filter(i => i.fields.status.name === 'Done' && i.fields.resolutiondate)
        .sort((a, b) => new Date(b.fields.resolutiondate!).getTime() - new Date(a.fields.resolutiondate!).getTime())
        .slice(0, 5);
  }, [userIssues]);
  
  const weeklyHoursData = useMemo(() => {
      return mockWeeklyHours[MOCK_CURRENT_USER_ID as keyof typeof mockWeeklyHours] || [];
  }, []);

  if (!currentUser) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Error</CardTitle>
            </CardHeader>
            <CardContent>
                <p>Could not find user data. Please ensure you are logged in.</p>
            </CardContent>
        </Card>
    )
  }

  return (
    <div className="flex flex-col gap-4">
       <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
                <AvatarImage src={currentUser.avatarUrls['48x48']} alt={currentUser.displayName} data-ai-hint="avatar" />
                <AvatarFallback>{currentUser.displayName.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
                <h1 className="text-2xl font-bold">Welcome back, {currentUser.displayName}!</h1>
                <p className="text-muted-foreground">Here's your personal dashboard for this week.</p>
            </div>
        </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard title="Completed Tasks" value={userKpis.completedIssues} icon={CheckCircle} description="Total tasks you've completed." />
        <MetricCard title="Total Hours Logged" value={`${userKpis.totalHoursLogged.toFixed(1)}h`} icon={Hourglass} description="Across all assigned issues." />
        <MetricCard title="Vacation Days Left" value={userKpis.vacationDays} icon={CalendarOff} description="Annual entitlement remaining." />
        <MetricCard title="Sick Days Taken" value={userKpis.sickDaysTaken} icon={Briefcase} description="This calendar year." />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Weekly Hours</CardTitle>
          <CardDescription>Your logged hours compared to your target for this week.</CardDescription>
        </CardHeader>
        <CardContent>
            <ResponsiveContainer width="100%" height={300}>
            <BarChart data={weeklyHoursData}>
                <XAxis dataKey="day" stroke="hsl(var(--foreground))" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="hsl(var(--foreground))" fontSize={12} tickLine={false} axisLine={false} label={{ value: 'Hours', angle: -90, position: 'insideLeft' }}/>
                <Tooltip cursor={{ fill: 'hsl(var(--muted))' }} contentStyle={{ background: "hsl(var(--background))", borderColor: "hsl(var(--border))" }} />
                <Legend />
                <Bar dataKey="target" name="Target Hours" fill="hsl(var(--muted))" radius={[4, 4, 0, 0]} />
                <Bar dataKey="logged" name="Logged Hours" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
            </BarChart>
            </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Your 5 most recently completed work items.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Key</TableHead>
                <TableHead>Summary</TableHead>
                <TableHead>Project</TableHead>
                <TableHead>Completed On</TableHead>
                <TableHead className="text-right">Hours Logged</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentCompletedWork.map(issue => (
                <TableRow key={issue.id}>
                  <TableCell>
                    <Badge variant="outline">{issue.key}</Badge>
                  </TableCell>
                  <TableCell className="font-medium">{issue.fields.summary}</TableCell>
                  <TableCell>{issue.fields.project.name}</TableCell>
                  <TableCell>{issue.fields.resolutiondate ? new Date(issue.fields.resolutiondate).toLocaleDateString() : 'N/A'}</TableCell>
                  <TableCell className="text-right">{(issue.fields.timespent || 0 / 3600).toFixed(2)}h</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
