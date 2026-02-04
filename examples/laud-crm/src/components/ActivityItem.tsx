import React from 'react';
import type { Activity, Contact, Deal } from '../types';
import { ActivityTypeBadge } from './Badge';
import { formatRelativeDate } from '../types';
import { useCRMStore } from '../store';

interface ActivityItemProps {
  activity: Activity;
  contact?: Contact;
  deal?: Deal;
  showCheckbox?: boolean;
}

const typeIcons: Record<string, React.ReactNode> = {
  call: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
      />
    </svg>
  ),
  meeting: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
      />
    </svg>
  ),
  task: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
      />
    </svg>
  ),
  email: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
      />
    </svg>
  ),
  note: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
      />
    </svg>
  ),
};

const iconBgColors: Record<string, string> = {
  call: 'bg-blue-100 text-blue-600',
  meeting: 'bg-green-100 text-green-600',
  task: 'bg-yellow-100 text-yellow-600',
  email: 'bg-purple-100 text-purple-600',
  note: 'bg-slate-100 text-slate-600',
};

export function ActivityItem({
  activity,
  contact,
  deal,
  showCheckbox = true,
}: ActivityItemProps) {
  const toggleActivityComplete = useCRMStore((state) => state.toggleActivityComplete);

  const isOverdue =
    !activity.completed &&
    activity.dueDate &&
    new Date(activity.dueDate) < new Date();

  return (
    <div
      className={`flex gap-4 p-4 ${
        activity.completed ? 'opacity-60' : ''
      } hover:bg-slate-50 transition-colors`}
    >
      {/* Checkbox */}
      {showCheckbox && activity.dueDate && (
        <div className="pt-1">
          <button
            onClick={() => toggleActivityComplete(activity.id)}
            className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
              activity.completed
                ? 'bg-primary-500 border-primary-500 text-white'
                : 'border-slate-300 hover:border-primary-500'
            }`}
          >
            {activity.completed && (
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            )}
          </button>
        </div>
      )}

      {/* Icon */}
      <div className={`p-2 rounded-lg ${iconBgColors[activity.type]}`}>
        {typeIcons[activity.type]}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <h4
            className={`font-medium ${
              activity.completed ? 'line-through text-slate-500' : 'text-slate-900'
            }`}
          >
            {activity.title}
          </h4>
          <ActivityTypeBadge type={activity.type} />
        </div>

        {activity.description && (
          <p className="text-sm text-slate-500 mt-1">{activity.description}</p>
        )}

        <div className="flex items-center gap-4 mt-2 text-sm text-slate-500">
          {contact && <span>{contact.name}</span>}
          {deal && <span>{deal.title}</span>}
          {activity.dueDate && (
            <span className={isOverdue ? 'text-red-500 font-medium' : ''}>
              {isOverdue ? 'Overdue: ' : 'Due: '}
              {formatRelativeDate(activity.dueDate)}
            </span>
          )}
          {!activity.dueDate && (
            <span>{formatRelativeDate(activity.createdAt)}</span>
          )}
        </div>
      </div>
    </div>
  );
}

// Compact version for dashboard
export function ActivityItemCompact({ activity, contact }: ActivityItemProps) {
  return (
    <div className="flex items-center gap-3 py-2">
      <div className={`p-1.5 rounded ${iconBgColors[activity.type]}`}>
        {typeIcons[activity.type]}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-slate-900 truncate">{activity.title}</p>
        <p className="text-xs text-slate-500">
          {contact?.name}
          {activity.dueDate && ` • Due ${formatRelativeDate(activity.dueDate)}`}
        </p>
      </div>
    </div>
  );
}
