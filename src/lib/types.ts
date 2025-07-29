export interface User {
  accountId: string;
  displayName: string;
  avatarUrls: { '48x48': string };
}

export interface Project {
  id: string;
  key: string;
  name: string;
  projectTypeKey: 'software' | 'business';
  lead: User;
}

export interface IssueType {
  id: string;
  name: 'Story' | 'Bug' | 'Task' | 'Epic' | 'Sub-task';
  iconUrl: string;
}

export interface Status {
  id: string;
  name: 'To Do' | 'In Progress' | 'Done' | 'Backlog';
}

export interface Priority {
  id: string;
  name: 'High' | 'Medium' | 'Low';
}

export interface Sprint {
  id: number;
  name: string;
  startDate: string;
  endDate: string;
  completeDate?: string;
  state: 'active' | 'closed' | 'future';
}

export interface ChangelogItem {
  field: string;
  fromString: string | null;
  toString: string | null;
}

export interface ChangelogHistory {
  id: string;
  author: User;
  created: string;
  items: ChangelogItem[];
}

export interface Issue {
  id: string;
  key: string;
  fields: {
    summary: string;
    project: Project;
    issuetype: IssueType;
    status: Status;
    priority: Priority;
    creator: User;
    reporter: User;
    assignee: User | null;
    created: string;
    updated: string;
    resolutiondate: string | null;
    'customfield_10004': number | null; // Story Points
    'customfield_10007': Sprint[] | null; // Sprint
    timeoriginalestimate: number | null; // in seconds
    timespent: number | null; // in seconds
  };
  changelog?: {
    histories: ChangelogHistory[];
  };
}
