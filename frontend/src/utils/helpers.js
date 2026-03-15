import { format, isPast, isToday, isTomorrow, differenceInDays } from 'date-fns';

export const PRIORITY_CONFIG = {
  LOW:    { label: 'Low',    className: 'priority-low',    color: '#56d364' },
  MEDIUM: { label: 'Medium', className: 'priority-medium', color: '#e3b341' },
  HIGH:   { label: 'High',   className: 'priority-high',   color: '#f85149' },
  URGENT: { label: 'Urgent', className: 'priority-urgent', color: '#bc8cff' },
};

export const LABEL_COLORS = [
  { id: 'green',  color: '#238636', text: '#56d364', label: 'Green'  },
  { id: 'blue',   color: '#1f6feb', text: '#79c0ff', label: 'Blue'   },
  { id: 'yellow', color: '#9e6a03', text: '#e3b341', label: 'Yellow' },
  { id: 'red',    color: '#da3633', text: '#ffa198', label: 'Red'    },
  { id: 'purple', color: '#6e40c9', text: '#bc8cff', label: 'Purple' },
  { id: 'orange', color: '#bd561d', text: '#ffa657', label: 'Orange' },
  { id: 'teal',   color: '#1b7c83', text: '#3dc9b0', label: 'Teal'   },
  { id: 'pink',   color: '#a2334f', text: '#ff9bc3', label: 'Pink'   },
];

export const COVER_COLORS = [
  '#1f6feb', '#238636', '#da3633', '#9e6a03',
  '#6e40c9', '#1b7c83', '#bd561d', '#a2334f',
  '#0d1117', '#161b22', '#21262d', '#30363d',
];

export const BOARD_BACKGROUNDS = [
  '#0052CC', '#00875A', '#FF5630', '#FF8B00',
  '#6554C0', '#00B8D9', '#36B37E', '#403294',
];

export function formatDueDate(date) {
  if (!date) return null;
  const d = new Date(date);
  if (isToday(d))    return { label: 'Today',    urgent: true  };
  if (isTomorrow(d)) return { label: 'Tomorrow', urgent: false };
  if (isPast(d))     return { label: format(d, 'MMM d'), overdue: true };
  const diff = differenceInDays(d, new Date());
  if (diff <= 7)     return { label: format(d, 'MMM d'), soon: true };
  return { label: format(d, 'MMM d, yyyy'), urgent: false };
}

export function getChecklistProgress(checklist) {
  if (!checklist?.length) return null;
  const done = checklist.filter(i => i.completed).length;
  return { done, total: checklist.length, percent: Math.round((done / checklist.length) * 100) };
}

export function truncate(str, len = 80) {
  return str?.length > len ? str.slice(0, len) + '…' : str;
}

export function randomId() {
  return Math.random().toString(36).slice(2);
}
