import React from 'react';

type BadgeVariant = 'default' | 'success' | 'warning' | 'danger' | 'info';

interface BadgeProps {
  variant?: BadgeVariant;
  children: React.ReactNode;
  className?: string;
}

const variantClasses: Record<BadgeVariant, string> = {
  default: 'bg-slate-100 text-slate-700',
  success: 'bg-green-100 text-green-700',
  warning: 'bg-yellow-100 text-yellow-700',
  danger: 'bg-red-100 text-red-700',
  info: 'bg-blue-100 text-blue-700',
};

export function Badge({ variant = 'default', children, className = '' }: BadgeProps) {
  return (
    <span
      className={`
        inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
        ${variantClasses[variant]}
        ${className}
      `}
    >
      {children}
    </span>
  );
}

// Status-specific badge helpers
export function ContactStatusBadge({ status }: { status: string }) {
  const variant: BadgeVariant =
    status === 'active' ? 'success' : status === 'lead' ? 'info' : 'default';
  const label = status.charAt(0).toUpperCase() + status.slice(1);
  return <Badge variant={variant}>{label}</Badge>;
}

export function DealStageBadge({ stage }: { stage: string }) {
  const variants: Record<string, BadgeVariant> = {
    lead: 'default',
    qualified: 'info',
    proposal: 'warning',
    negotiation: 'warning',
    'closed-won': 'success',
    'closed-lost': 'danger',
  };
  const labels: Record<string, string> = {
    lead: 'Lead',
    qualified: 'Qualified',
    proposal: 'Proposal',
    negotiation: 'Negotiation',
    'closed-won': 'Won',
    'closed-lost': 'Lost',
  };
  return <Badge variant={variants[stage] || 'default'}>{labels[stage] || stage}</Badge>;
}

export function ActivityTypeBadge({ type }: { type: string }) {
  const variants: Record<string, BadgeVariant> = {
    call: 'info',
    meeting: 'success',
    task: 'warning',
    email: 'default',
    note: 'default',
  };
  const label = type.charAt(0).toUpperCase() + type.slice(1);
  return <Badge variant={variants[type] || 'default'}>{label}</Badge>;
}
