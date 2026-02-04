import React from 'react';

interface MeterProps {
  label?: string;
  value: number;
  size?: 'S' | 'M' | 'L';
  showValueLabel?: boolean;
}

export function Meter({ label, value, size = 'M', showValueLabel = true }: MeterProps) {
  const getColor = (v: number) => {
    if (v >= 80) return 'bg-red-500';
    if (v >= 60) return 'bg-amber-500';
    return 'bg-emerald-500';
  };

  const heights: Record<string, string> = {
    S: 'h-1.5',
    M: 'h-2',
    L: 'h-3',
  };

  return (
    <div className="w-full">
      {(label || showValueLabel) && (
        <div className="flex justify-between text-xs text-gray-600 mb-1">
          {label && <span>{label}</span>}
          {showValueLabel && <span>{value}%</span>}
        </div>
      )}
      <div className={`w-full bg-gray-200 rounded-full overflow-hidden ${heights[size]}`}>
        <div
          className={`${heights[size]} rounded-full transition-all ${getColor(value)}`}
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}
