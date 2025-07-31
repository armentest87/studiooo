
'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import {
  BarChart2,
  Settings,
  LayoutGrid,
  AreaChart,
  Target,
  Clock,
  Menu,
  Database,
  LogOut,
  User as UserIcon,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from '@/components/ui/sheet';
import { JiraIcon } from '@/components/dashboard/icons';
import { cn } from '@/lib/utils';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"


const navigationItems = [
  { href: '/data-fetcher', icon: Database, label: 'Data Fetcher' },
  { href: '/my-dashboard', icon: UserIcon, label: 'My Dashboard' },
  { href: '/helicopter-view', icon: LayoutGrid, label: 'Helicopter View' },
  { href: '/overview', icon: BarChart2, label: 'Overview' },
  { href: '/cumulative-flow', icon: AreaChart, label: 'Cumulative Flow' },
  { href: '/sprint-analysis', icon: Target, label: 'Sprint Analysis' },
  { href: '/timework-report', icon: Clock, label: 'Timework Report' },
];

function SidebarNav() {
  const pathname = usePathname();
  return (
    <nav className="flex flex-col gap-2 px-4">
      {navigationItems.map((item) => {
        const isActive = pathname === item.href;
        return (
          <Link href={item.href} key={item.href}>
            <Button
              variant={isActive ? 'secondary' : 'ghost'}
              className="w-full justify-start gap-2"
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Button>
          </Link>
        );
      })}
    </nav>
  );
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  useEffect(() => {
    const creds = localStorage.getItem('jira_credentials');
    if (!creds) {
      router.push('/login');
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('jira_credentials');
    router.push('/login');
  }

  return (
    <TooltipProvider>
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      <div className="hidden border-r bg-background md:block">
        <div className="flex h-full max-h-screen flex-col gap-2">
          <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
            <Link href="/" className="flex items-center gap-2 font-semibold">
              <JiraIcon className="h-6 w-6 text-primary" />
              <span className="">Jira Insights Lite</span>
            </Link>
          </div>
          <div className="flex-1 overflow-auto py-2">
            <SidebarNav />
          </div>
           <div className="mt-auto p-4 border-t">
              <Tooltip>
                <TooltipTrigger asChild>
                   <Button variant="ghost" className="w-full justify-start gap-2" onClick={handleLogout}>
                      <LogOut className="h-4 w-4" />
                      Logout
                    </Button>
                </TooltipTrigger>
                <TooltipContent side="right">
                  <p>Disconnect from Jira</p>
                </TooltipContent>
              </Tooltip>
           </div>
        </div>
      </div>
      <div className="flex flex-col">
        <header className="flex h-14 items-center gap-4 border-b bg-background px-4 lg:h-[60px] lg:px-6 md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="shrink-0">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="flex flex-col p-0">
              <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
                <Link href="/" className="flex items-center gap-2 font-semibold">
                  <JiraIcon className="h-6 w-6 text-primary" />
                  <span className="">Jira Insights Lite</span>
                </Link>
              </div>
              <div className="flex-1 overflow-auto py-2">
                <SidebarNav />
              </div>
              <div className="mt-auto p-4 border-t">
                 <Button variant="ghost" className="w-full justify-start gap-2" onClick={handleLogout}>
                    <LogOut className="h-4 w-4" />
                    Logout
                  </Button>
              </div>
            </SheetContent>
          </Sheet>
          <div className="w-full flex-1">
             <h1 className="font-semibold text-lg">Jira Insights Lite</h1>
          </div>
        </header>
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6 bg-muted/20">
          {children}
        </main>
      </div>
    </div>
    </TooltipProvider>
  );
}
