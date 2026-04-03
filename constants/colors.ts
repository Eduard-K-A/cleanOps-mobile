// CleanOps color palette — matches the web app theme
export const Colors = {
  // Brand blues
  blue50:  '#E3F2FD',
  blue100: '#BBDEFB',
  blue200: '#90CAF9',
  blue400: '#42A5F5',
  blue600: '#1E88E5',
  blue700: '#1976D2',
  blue800: '#1565C0',

  // Backgrounds
  bg:       '#F8FAFC',
  surface:  '#FFFFFF',
  surface2: '#F1F5F9',

  // Text
  text1: '#0F172A',
  text2: '#475569',
  text3: '#94A3B8',

  // Borders
  divider: '#E2E8F0',

  // Status
  success: '#10B981',
  warning: '#F59E0B',
  error:   '#EF4444',
};

export const STATUS_COLORS: Record<string, { bg: string; text: string; label: string }> = {
  OPEN:           { bg: '#EFF6FF', text: '#3B82F6', label: 'Open' },
  IN_PROGRESS:    { bg: '#FFFBEB', text: '#F59E0B', label: 'In Progress' },
  PENDING_REVIEW: { bg: '#FDF2F8', text: '#EC4899', label: 'Pending Review' },
  COMPLETED:      { bg: '#ECFDF5', text: '#10B981', label: 'Completed' },
  CANCELLED:      { bg: '#FEF2F2', text: '#EF4444', label: 'Cancelled' },
};
