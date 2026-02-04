// =============================================================================
// Laud CRM - TypeScript Type Definitions
// =============================================================================

export type ContactStatus = 'active' | 'inactive' | 'lead';

export interface Contact {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  position: string;
  avatar?: string;
  status: ContactStatus;
  createdAt: string;
  notes?: string;
}

export type DealStage =
  | 'lead'
  | 'qualified'
  | 'proposal'
  | 'negotiation'
  | 'closed-won'
  | 'closed-lost';

export interface Deal {
  id: string;
  title: string;
  value: number;
  stage: DealStage;
  contactId: string;
  probability: number;
  expectedCloseDate: string;
  createdAt: string;
  notes?: string;
}

export type ActivityType = 'call' | 'meeting' | 'task' | 'email' | 'note';

export interface Activity {
  id: string;
  type: ActivityType;
  title: string;
  description?: string;
  contactId?: string;
  dealId?: string;
  dueDate?: string;
  completed: boolean;
  createdAt: string;
}

// UI Types
export interface NavItem {
  path: string;
  label: string;
  icon: string;
}

export interface StatCardData {
  title: string;
  value: string | number;
  change?: number;
  changeLabel?: string;
  icon: string;
}

// Store Types
export interface CRMStore {
  contacts: Contact[];
  deals: Deal[];
  activities: Activity[];
  searchQuery: string;

  // Actions
  setSearchQuery: (query: string) => void;
  addContact: (contact: Contact) => void;
  updateContact: (id: string, updates: Partial<Contact>) => void;
  deleteContact: (id: string) => void;
  addDeal: (deal: Deal) => void;
  updateDeal: (id: string, updates: Partial<Deal>) => void;
  deleteDeal: (id: string) => void;
  addActivity: (activity: Activity) => void;
  updateActivity: (id: string, updates: Partial<Activity>) => void;
  deleteActivity: (id: string) => void;
  toggleActivityComplete: (id: string) => void;
}

// Pipeline Types
export interface PipelineColumn {
  stage: DealStage;
  label: string;
  color: string;
}

export const PIPELINE_COLUMNS: PipelineColumn[] = [
  { stage: 'lead', label: 'Lead', color: 'bg-slate-500' },
  { stage: 'qualified', label: 'Qualified', color: 'bg-blue-500' },
  { stage: 'proposal', label: 'Proposal', color: 'bg-yellow-500' },
  { stage: 'negotiation', label: 'Negotiation', color: 'bg-orange-500' },
  { stage: 'closed-won', label: 'Closed Won', color: 'bg-green-500' },
  { stage: 'closed-lost', label: 'Closed Lost', color: 'bg-red-500' },
];

// Utility type for activity icons
export const ACTIVITY_ICONS: Record<ActivityType, string> = {
  call: 'phone',
  meeting: 'users',
  task: 'check-square',
  email: 'mail',
  note: 'file-text',
};

// Format helpers
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function formatRelativeDate(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
  return formatDate(dateString);
}
