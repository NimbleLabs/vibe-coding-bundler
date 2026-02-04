import React, { useState, useMemo } from 'react';
import { Header } from '../components/Header';
import { Button } from '../components/Button';
import { DealCard } from '../components/DealCard';
import { useCRMStore } from '../store';
import type { DealStage } from '../types';

type FilterStage = 'all' | DealStage;

export function Deals() {
  const { deals, contacts, searchQuery } = useCRMStore();
  const [filterStage, setFilterStage] = useState<FilterStage>('all');

  const filteredDeals = useMemo(() => {
    return deals.filter((deal) => {
      // Filter by stage
      if (filterStage !== 'all' && deal.stage !== filterStage) {
        return false;
      }

      // Filter by search query
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const contact = contacts.find((c) => c.id === deal.contactId);
        return (
          deal.title.toLowerCase().includes(query) ||
          contact?.company.toLowerCase().includes(query) ||
          contact?.name.toLowerCase().includes(query)
        );
      }

      return true;
    });
  }, [deals, contacts, filterStage, searchQuery]);

  const stages: { key: FilterStage; label: string }[] = [
    { key: 'all', label: 'All' },
    { key: 'lead', label: 'Lead' },
    { key: 'qualified', label: 'Qualified' },
    { key: 'proposal', label: 'Proposal' },
    { key: 'negotiation', label: 'Negotiation' },
    { key: 'closed-won', label: 'Won' },
    { key: 'closed-lost', label: 'Lost' },
  ];

  const stageCounts = useMemo(() => {
    const counts: Record<string, number> = { all: deals.length };
    stages.slice(1).forEach(({ key }) => {
      counts[key] = deals.filter((d) => d.stage === key).length;
    });
    return counts;
  }, [deals]);

  return (
    <div className="min-h-screen">
      <Header
        title="Deals"
        subtitle={`${filteredDeals.length} deals`}
        actions={
          <Button>
            <svg
              className="w-4 h-4 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
            Add Deal
          </Button>
        }
      />

      <div className="p-6">
        {/* Stage Filters */}
        <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2">
          {stages.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setFilterStage(key)}
              className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                filterStage === key
                  ? 'bg-primary-500 text-white'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              {label}
              <span className="ml-2 text-xs opacity-75">({stageCounts[key]})</span>
            </button>
          ))}
        </div>

        {/* Deals Grid */}
        {filteredDeals.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredDeals.map((deal) => {
              const contact = contacts.find((c) => c.id === deal.contactId);
              return <DealCard key={deal.id} deal={deal} contact={contact} />;
            })}
          </div>
        ) : (
          <div className="text-center py-12">
            <svg
              className="mx-auto h-12 w-12 text-slate-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <h3 className="mt-4 text-lg font-medium text-slate-900">No deals found</h3>
            <p className="mt-2 text-slate-500">
              {searchQuery
                ? 'Try adjusting your search or filter criteria'
                : 'Get started by adding your first deal'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
