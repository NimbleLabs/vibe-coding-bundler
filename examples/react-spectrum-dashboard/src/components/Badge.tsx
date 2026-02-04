import React from 'react';

type Variant = 'positive' | 'info' | 'negative' | 'neutral' | 'notice';

interface BadgeProps {
  variant: Variant;
  children: React.ReactNode;
}

const variantStyles: Record<Variant, string> = {
  positive: 'bg-emerald-100 text-emerald-700',
  info: 'bg-blue-100 text-blue-700',
  negative: 'bg-red-100 text-red-700',
  neutral: 'bg-gray-100 text-gray-700',
  notice: 'bg-amber-100 text-amber-700',
};

export function Badge({ variant, children }: BadgeProps) {
  return (
    <span className={`inline-flex px-2 py-0.5 text-xs font-medium rounded-full ${variantStyles[variant]}`}>
      {children}
    </span>
  );
}
