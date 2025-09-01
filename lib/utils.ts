import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Format date to 'Jan 20, 2025' style
export function formatDate(dateString?: string | null): string {
  if (!dateString) return '-';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return '-';
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function formatBSDate(dateString?: string | null): string {
  if (!dateString) return '-';
  const nepaliMonths = [
    "Baisakh", "Jestha", "Ashad", "Shrawan", "Bhadra", "Ashwin",
    "Kartik", "Mangsir", "Poush", "Magh", "Falgun", "Chaitra"
  ];
  const [year, month, day] = dateString.split('-').map(Number);
  if (!year || !month || !day) return '-';
  return `${nepaliMonths[month - 1]} ${day}, ${year}`;
}