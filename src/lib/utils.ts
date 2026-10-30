import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric',
  });
}

export function formatTime(dateStr: string) {
  return new Date(dateStr).toLocaleTimeString('en-IN', {
    hour: '2-digit', minute: '2-digit',
  });
}

export const STATUS_COLORS: Record<string, string> = {
  pending:     'bg-amber-100 text-amber-700 border-amber-200',
  'in-progress':'bg-blue-100 text-blue-700 border-blue-200',
  completed:   'bg-green-100 text-green-700 border-green-200',
  rejected:    'bg-red-100 text-red-700 border-red-200',
  draft:       'bg-slate-100 text-slate-600 border-slate-200',
};

export const CATEGORIES = [
  'General', 'Technical', 'Maintenance', 'Service', 'Emergency', 'Other',
];
