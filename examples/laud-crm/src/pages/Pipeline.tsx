import React from 'react';
import { Header } from '../components/Header';
import { PipelineDealCard } from '../components/DealCard';
import { useCRMStore } from '../store';
import { PIPELINE_COLUMNS, formatCurrency } from '../types';

export function Pipeline() {
  const { deals, contacts } = useCRMStore();

  // Calculate totals per column
  const columnData = PIPELINE_COLUMNS.map((column) => {
    const columnDeals = deals.filter((d) => d.stage === column.stage);
    const total = columnDeals.reduce((sum, d) => sum + d.value, 0);
    return {
      ...column,
      deals: columnDeals,
      total,
      count: columnDeals.length,
    };
  });

  return (
    <div className="min-h-screen flex flex-col">
      <Header title="Pipeline" subtitle="Drag and drop deals between stages" />

      <div className="flex-1 p-6 overflow-x-auto">
        <div className="flex gap-4 min-w-max h-full">
          {columnData.map((column) => (
            <div
              key={column.stage}
              className="w-72 flex flex-col bg-slate-100 rounded-xl"
            >
              {/* Column Header */}
              <div className="p-4 border-b border-slate-200">
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${column.color}`} />
                  <h3 className="font-semibold text-slate-900">{column.label}</h3>
                  <span className="ml-auto text-sm text-slate-500">{column.count}</span>
                </div>
                <p className="text-sm text-slate-500 mt-1">{formatCurrency(column.total)}</p>
              </div>

              {/* Column Content */}
              <div className="flex-1 p-3 space-y-3 overflow-y-auto">
                {column.deals.map((deal) => {
                  const contact = contacts.find((c) => c.id === deal.contactId);
                  return (
                    <PipelineDealCard key={deal.id} deal={deal} contact={contact} />
                  );
                })}

                {column.deals.length === 0 && (
                  <div className="text-center py-8 text-sm text-slate-400">
                    No deals in this stage
                  </div>
                )}
              </div>

              {/* Add Deal Button */}
              <div className="p-3 border-t border-slate-200">
                <button className="w-full py-2 text-sm text-slate-500 hover:text-slate-700 hover:bg-slate-200 rounded-lg transition-colors flex items-center justify-center gap-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Add Deal
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Summary Footer */}
      <div className="bg-white border-t border-slate-200 p-4">
        <div className="flex items-center justify-between max-w-4xl mx-auto">
          <div className="flex items-center gap-8">
            <div>
              <p className="text-sm text-slate-500">Total Pipeline</p>
              <p className="text-lg font-semibold text-slate-900">
                {formatCurrency(
                  deals
                    .filter((d) => !['closed-won', 'closed-lost'].includes(d.stage))
                    .reduce((sum, d) => sum + d.value, 0)
                )}
              </p>
            </div>
            <div>
              <p className="text-sm text-slate-500">Weighted Pipeline</p>
              <p className="text-lg font-semibold text-slate-900">
                {formatCurrency(
                  deals
                    .filter((d) => !['closed-won', 'closed-lost'].includes(d.stage))
                    .reduce((sum, d) => sum + d.value * (d.probability / 100), 0)
                )}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-500" />
              <span className="text-sm text-slate-600">
                Won: {formatCurrency(columnData.find((c) => c.stage === 'closed-won')?.total || 0)}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500" />
              <span className="text-sm text-slate-600">
                Lost: {formatCurrency(columnData.find((c) => c.stage === 'closed-lost')?.total || 0)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
