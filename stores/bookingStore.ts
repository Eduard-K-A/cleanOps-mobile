// Mobile equivalent of the web's stores/bookingStore
// Uses React state instead of Zustand (simpler, no extra dependency)
import type { JobUrgency } from '@/types';

export const SIZES = [
  'Small (1–2 rooms)',
  'Medium (3–4 rooms)',
  'Large (5+ rooms)',
];

export const TASKS = [
  'Dusting',
  'Vacuuming',
  'Mopping',
  'Bathrooms',
  'Kitchen',
  'Windows',
];

export const URGENCIES: { value: JobUrgency; label: string; desc: string }[] = [
  { value: 'LOW',    label: 'Low',    desc: 'Flexible schedule, −10%' },
  { value: 'NORMAL', label: 'Normal', desc: 'Standard timing' },
  { value: 'HIGH',   label: 'High',   desc: 'ASAP priority, +30%' },
];

const SIZE_BASE: Record<string, number> = {
  'Small (1–2 rooms)':  6500,
  'Medium (3–4 rooms)': 10000,
  'Large (5+ rooms)':   15000,
};

export function computePrice(size: string, urgency: JobUrgency, tasks: string[]): number {
  const base = SIZE_BASE[size] ?? 6500;
  const mult = urgency === 'HIGH' ? 1.3 : urgency === 'LOW' ? 0.9 : 1;
  const taskMultiplier = 1 + 0.12 * tasks.length;
  return Math.round(base * mult * taskMultiplier);
}
