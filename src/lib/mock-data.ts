import type { User, Project, Issue, Sprint } from './types';
import { subDays, addDays, formatISO } from 'date-fns';

// Users
export const users: User[] = [
  { accountId: 'u1', displayName: 'Alice Johnson', avatarUrls: { '48x48': 'https://placehold.co/48x48' } },
  { accountId: 'u2', displayName: 'Bob Williams', avatarUrls: { '48x48': 'https://placehold.co/48x48' } },
  { accountId: 'u3', displayName: 'Charlie Brown', avatarUrls: { '48x48': 'https://placehold.co/48x48' } },
  { accountId: 'u4', displayName: 'Diana Prince', avatarUrls: { '48x48': 'https://placehold.co/48x48' } },
];

// Projects
export const projects: Project[] = [
  { id: 'p1', key: 'PHX', name: 'Project Phoenix', projectTypeKey: 'software', lead: users[0] },
  { id: 'p2', key: 'NOA', name: 'Operation Nova', projectTypeKey: 'software', lead: users[1] },
  { id: 'p3', key: 'BIZ', name: 'Business Onboarding', projectTypeKey: 'business', lead: users[0] },
  { id: 'p4', key: 'HR', name: 'HR System Upgrade', projectTypeKey: 'business', lead: users[3] },
];

// Sprints
export const sprints: Sprint[] = [
  { id: 1, name: 'PHX Sprint 1', startDate: formatISO(subDays(new Date(), 40)), endDate: formatISO(subDays(new Date(), 26)), completeDate: formatISO(subDays(new Date(), 26)), state: 'closed' },
  { id: 2, name: 'PHX Sprint 2', startDate: formatISO(subDays(new Date(), 25)), endDate: formatISO(subDays(new Date(), 11)), completeDate: formatISO(subDays(new Date(), 11)), state: 'closed' },
  { id: 3, name: 'PHX Sprint 3', startDate: formatISO(subDays(new Date(), 10)), endDate: formatISO(addDays(new Date(), 3)), state: 'active' },
  { id: 4, name: 'NOA Sprint 1', startDate: formatISO(subDays(new Date(), 20)), endDate: formatISO(subDays(new Date(), 6)), completeDate: formatISO(subDays(new Date(), 6)), state: 'closed' },
  { id: 5, name: 'NOA Sprint 2', startDate: formatISO(subDays(new Date(), 5)), endDate: formatISO(addDays(new Date(), 8)), state: 'active' },
];

// Issues
export const issues: Issue[] = [
  // Project Phoenix
  {
    id: '1', key: 'PHX-1',
    fields: {
      summary: 'Set up database schema',
      project: projects[0],
      issuetype: { id: 'it1', name: 'Story', iconUrl: '' },
      status: { id: 's3', name: 'Done' },
      priority: { id: 'pr1', name: 'High' },
      creator: users[0], reporter: users[0], assignee: users[1],
      created: formatISO(subDays(new Date(), 38)), updated: formatISO(subDays(new Date(), 35)), resolutiondate: formatISO(subDays(new Date(), 35)),
      'customfield_10004': 5,
      'customfield_10007': [sprints[0]],
      timeoriginalestimate: 28800, timespent: 30000,
    },
    changelog: { histories: [
      { id: 'ch1', author: users[1], created: formatISO(subDays(new Date(), 37)), items: [{ field: 'status', fromString: 'To Do', toString: 'In Progress' }] },
      { id: 'ch2', author: users[1], created: formatISO(subDays(new Date(), 35)), items: [{ field: 'status', fromString: 'In Progress', toString: 'Done' }] },
    ] },
  },
  {
    id: '2', key: 'PHX-2',
    fields: {
      summary: 'User authentication API endpoint',
      project: projects[0],
      issuetype: { id: 'it1', name: 'Story', iconUrl: '' },
      status: { id: 's3', name: 'Done' },
      priority: { id: 'pr1', name: 'High' },
      creator: users[0], reporter: users[0], assignee: users[2],
      created: formatISO(subDays(new Date(), 24)), updated: formatISO(subDays(new Date(), 15)), resolutiondate: formatISO(subDays(new Date(), 15)),
      'customfield_10004': 8,
      'customfield_10007': [sprints[1]],
      timeoriginalestimate: 57600, timespent: 60000,
    },
    changelog: { histories: [
      { id: 'ch3', author: users[2], created: formatISO(subDays(new Date(), 23)), items: [{ field: 'status', fromString: 'To Do', toString: 'In Progress' }] },
      { id: 'ch4', author: users[2], created: formatISO(subDays(new Date(), 15)), items: [{ field: 'status', fromString: 'In Progress', toString: 'Done' }] },
    ] },
  },
  {
    id: '3', key: 'PHX-3',
    fields: {
      summary: 'UI button has incorrect color',
      project: projects[0],
      issuetype: { id: 'it2', name: 'Bug', iconUrl: '' },
      status: { id: 's2', name: 'In Progress' },
      priority: { id: 'pr2', name: 'Medium' },
      creator: users[3], reporter: users[3], assignee: users[1],
      created: formatISO(subDays(new Date(), 8)), updated: formatISO(subDays(new Date(), 2)), resolutiondate: null,
      'customfield_10004': 3,
      'customfield_10007': [sprints[2]],
      timeoriginalestimate: 14400, timespent: 7200,
    },
    changelog: { histories: [
      { id: 'ch5', author: users[1], created: formatISO(subDays(new Date(), 7)), items: [{ field: 'status', fromString: 'To Do', toString: 'In Progress' }] },
    ] },
  },
   {
    id: '4', key: 'PHX-4',
    fields: {
      summary: 'Develop user profile page',
      project: projects[0],
      issuetype: { id: 'it1', name: 'Story', iconUrl: '' },
      status: { id: 's1', name: 'To Do' },
      priority: { id: 'pr2', name: 'Medium' },
      creator: users[0], reporter: users[0], assignee: users[2],
      created: formatISO(subDays(new Date(), 5)), updated: formatISO(subDays(new Date(), 5)), resolutiondate: null,
      'customfield_10004': 5,
      'customfield_10007': [sprints[2]],
      timeoriginalestimate: 28800, timespent: null,
    },
    changelog: { histories: [] },
  },
  // Project Nova
  {
    id: '5', key: 'NOA-1',
    fields: {
      summary: 'Integrate with third-party payment gateway',
      project: projects[1],
      issuetype: { id: 'it3', name: 'Task', iconUrl: '' },
      status: { id: 's3', name: 'Done' },
      priority: { id: 'pr1', name: 'High' },
      creator: users[1], reporter: users[1], assignee: users[3],
      created: formatISO(subDays(new Date(), 18)), updated: formatISO(subDays(new Date(), 8)), resolutiondate: formatISO(subDays(new Date(), 8)),
      'customfield_10004': 13,
      'customfield_10007': [sprints[3]],
      timeoriginalestimate: 86400, timespent: 90000,
    },
    changelog: { histories: [
      { id: 'ch6', author: users[3], created: formatISO(subDays(new Date(), 15)), items: [{ field: 'status', fromString: 'Backlog', toString: 'To Do' }] },
      { id: 'ch7', author: users[3], created: formatISO(subDays(new Date(), 14)), items: [{ field: 'status', fromString: 'To Do', toString: 'In Progress' }] },
      { id: 'ch8', author: users[3], created: formatISO(subDays(new Date(), 8)), items: [{ field: 'status', fromString: 'In Progress', toString: 'Done' }] },
    ] },
  },
   {
    id: '6', key: 'NOA-2',
    fields: {
      summary: 'Documentation for API endpoints',
      project: projects[1],
      issuetype: { id: 'it3', name: 'Task', iconUrl: '' },
      status: { id: 's2', name: 'In Progress' },
      priority: { id: 'pr3', name: 'Low' },
      creator: users[1], reporter: users[1], assignee: users[0],
      created: formatISO(subDays(new Date(), 4)), updated: formatISO(subDays(new Date(), 1)), resolutiondate: null,
      'customfield_10004': 5,
      'customfield_10007': [sprints[4]],
      timeoriginalestimate: 28800, timespent: 10800,
    },
    changelog: { histories: [
      { id: 'ch9', author: users[0], created: formatISO(subDays(new Date(), 3)), items: [{ field: 'status', fromString: 'To Do', toString: 'In Progress' }] },
    ] },
  },
  // Business Projects
  {
    id: '7', key: 'BIZ-1',
    fields: {
      summary: 'Draft Q3 marketing plan',
      project: projects[2],
      issuetype: { id: 'it3', name: 'Task', iconUrl: '' },
      status: { id: 's3', name: 'Done' },
      priority: { id: 'pr2', name: 'Medium' },
      creator: users[0], reporter: users[0], assignee: users[0],
      created: formatISO(subDays(new Date(), 20)), updated: formatISO(subDays(new Date(), 15)), resolutiondate: formatISO(subDays(new Date(), 15)),
      'customfield_10004': null,
      'customfield_10007': null,
      timeoriginalestimate: 43200, timespent: 43200,
    },
    changelog: { histories: [
        { id: 'ch10', author: users[0], created: formatISO(subDays(new Date(), 18)), items: [{ field: 'status', fromString: 'Backlog', toString: 'In Progress' }] },
        { id: 'ch11', author: users[0], created: formatISO(subDays(new Date(), 15)), items: [{ field: 'status', fromString: 'In Progress', toString: 'Done' }] },
    ] },
  },
  {
    id: '8', key: 'HR-1',
    fields: {
      summary: 'Interview candidates for engineering role',
      project: projects[3],
      issuetype: { id: 'it3', name: 'Task', iconUrl: '' },
      status: { id: 's1', name: 'To Do' },
      priority: { id: 'pr1', name: 'High' },
      creator: users[3], reporter: users[3], assignee: users[3],
      created: formatISO(subDays(new Date(), 2)), updated: formatISO(subDays(new Date(), 2)), resolutiondate: null,
      'customfield_10004': null,
      'customfield_10007': null,
      timeoriginalestimate: null, timespent: null,
    },
    changelog: { histories: [] },
  },
  {
    id: '9', key: 'PHX-5',
    fields: {
      summary: 'Refactor legacy code module',
      project: projects[0],
      issuetype: { id: 'it3', name: 'Task', iconUrl: '' },
      status: { id: 's4', name: 'Backlog' },
      priority: { id: 'pr3', name: 'Low' },
      creator: users[0], reporter: users[0], assignee: null,
      created: formatISO(subDays(new Date(), 50)), updated: formatISO(subDays(new Date(), 50)), resolutiondate: null,
      'customfield_10004': 8,
      'customfield_10007': null,
      timeoriginalestimate: null, timespent: null,
    },
    changelog: { histories: [] },
  },
  {
    id: '10', key: 'NOA-3',
    fields: {
      summary: 'Login page vulnerability',
      project: projects[1],
      issuetype: { id: 'it2', name: 'Bug', iconUrl: '' },
      status: { id: 's3', name: 'Done' },
      priority: { id: 'pr1', name: 'High' },
      creator: users[3], reporter: users[3], assignee: users[3],
      created: formatISO(subDays(new Date(), 28)), updated: formatISO(subDays(new Date(), 26)), resolutiondate: formatISO(subDays(new Date(), 26)),
      'customfield_10004': null,
      'customfield_10007': null,
      timeoriginalestimate: 14400, timespent: 12000,
    },
    changelog: { histories: [
        { id: 'ch12', author: users[3], created: formatISO(subDays(new Date(), 28)), items: [{ field: 'status', fromString: 'To Do', toString: 'In Progress' }] },
        { id: 'ch13', author: users[3], created: formatISO(subDays(new Date(), 26)), items: [{ field: 'status', fromString: 'In Progress', toString: 'Done' }] },
    ] },
  }
];
