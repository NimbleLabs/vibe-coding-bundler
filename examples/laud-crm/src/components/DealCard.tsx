import React from 'react';
import { Link } from 'react-router-dom';
import type { Deal, Contact } from '../types';
import { DealStageBadge } from './Badge';
import { formatCurrency, formatDate } from '../types';

interface DealCardProps {
  deal: Deal;
  contact?: Contact;
}

export function DealCard({ deal, contact }: DealCardProps) {
  return (
    <Link
      to={`/deals/${deal.id}`}
      className="block bg-white rounded-xl border border-slate-200 p-4 hover:border-primary-300 hover:shadow-md transition-all"
    >
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-slate-900 truncate">{deal.title}</h3>
          </div>
          {contact && (
            <p className="text-sm text-slate-500 mt-1">{contact.company}</p>
          )}
        </div>
        <DealStageBadge stage={deal.stage} />
      </div>

      <div className="mt-4 flex items-center justify-between">
        <div>
          <p className="text-2xl font-bold text-slate-900">{formatCurrency(deal.value)}</p>
          <p className="text-sm text-slate-500">Expected close: {formatDate(deal.expectedCloseDate)}</p>
        </div>
        <div className="text-right">
          <div className="flex items-center gap-1">
            <div className="w-16 h-2 bg-slate-200 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full ${
                  deal.probability >= 75
                    ? 'bg-green-500'
                    : deal.probability >= 50
                    ? 'bg-yellow-500'
                    : 'bg-slate-400'
                }`}
                style={{ width: `${deal.probability}%` }}
              />
            </div>
            <span className="text-sm font-medium text-slate-600">{deal.probability}%</span>
          </div>
          <p className="text-xs text-slate-400 mt-1">Probability</p>
        </div>
      </div>
    </Link>
  );
}

// Pipeline card (compact for kanban view)
export function PipelineDealCard({ deal, contact }: DealCardProps) {
  return (
    <div className="bg-white rounded-lg border border-slate-200 p-3 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
      <h4 className="font-medium text-slate-900 text-sm truncate">{deal.title}</h4>
      {contact && (
        <p className="text-xs text-slate-500 mt-1 truncate">{contact.company}</p>
      )}
      <div className="mt-3 flex items-center justify-between">
        <span className="text-sm font-semibold text-slate-900">
          {formatCurrency(deal.value)}
        </span>
        <span className="text-xs text-slate-500">{deal.probability}%</span>
      </div>
    </div>
  );
}

// List item version
export function DealListItem({ deal, contact }: DealCardProps) {
  return (
    <Link
      to={`/deals/${deal.id}`}
      className="flex items-center gap-4 p-4 hover:bg-slate-50 transition-colors"
    >
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="font-medium text-slate-900">{deal.title}</span>
          <DealStageBadge stage={deal.stage} />
        </div>
        <p className="text-sm text-slate-500">
          {contact?.company} &middot; Close date: {formatDate(deal.expectedCloseDate)}
        </p>
      </div>
      <div className="text-right">
        <p className="font-semibold text-slate-900">{formatCurrency(deal.value)}</p>
        <p className="text-sm text-slate-500">{deal.probability}% probability</p>
      </div>
      <svg
        className="w-5 h-5 text-slate-400"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 5l7 7-7 7"
        />
      </svg>
    </Link>
  );
}
