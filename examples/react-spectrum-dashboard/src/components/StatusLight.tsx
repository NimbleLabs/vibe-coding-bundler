import React from 'react';

type Variant = 'positive' | 'notice' | 'negative' | 'neutral';

interface StatusLightProps {
  variant: Variant;
  children: React.ReactNode;
}

const variantColors: Record<Variant, string> = {
  positive: 'bg-emerald-500',
  notice: 'bg-amber-500',
  negative: 'bg-red-500',
  neutral: 'bg-gray-400',
};

export function StatusLight({ variant, children }: StatusLightProps) {
  return (
    <span className="inline-flex items-center gap-2 text-sm">
      <span className={`w-2 h-2 rounded-full ${variantColors[variant]}`} />
      <span className="text-gray-700">{children}</span>
    </span>
  );
}
