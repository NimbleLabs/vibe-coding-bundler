import React, { useState, useMemo } from 'react';
import { Header } from '../components/Header';
import { Button } from '../components/Button';
import { ActivityItem } from '../components/ActivityItem';
import { useCRMStore } from '../store';
import type { ActivityType } from '../types';

type FilterType = 'all' | ActivityType;
type FilterStatus = 'all' | 'pending' | 'completed' | 'overdue';

export function Activities() {
  const { activities, contacts, deals, searchQuery } = useCRMStore();
  const [filterType, setFilterType] = useState<FilterType>('all');
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all');

  const now = new Date();

  const filteredActivities = useMemo(() => {
    return activities
      .filter((activity) => {
        // Filter by type
        if (filterType !== 'all' && activity.type !== filterType) {
          return false;
        }

        // Filter by status
        if (filterStatus === 'pending' && activity.completed) return false;
        if (filterStatus === 'completed' && !activity.completed) return false;
        if (filterStatus === 'overdue') {
          if (activity.completed) return false;
          if (!activity.dueDate) return false;
          if (new Date(activity.dueDate) >= now) return false;
        }

        // Filter by search query
        if (searchQuery) {
          const query = searchQuery.toLowerCase();
          const contact = contacts.find((c) => c.id === activity.contactId);
          const deal = deals.find((d) => d.id === activity.dealId);
          return (
            activity.title.toLowerCase().includes(query) ||
            activity.description?.toLowerCase().includes(query) ||
            contact?.name.toLowerCase().includes(query) ||
            deal?.title.toLowerCase().includes(query)
          );
        }

        return true;
      })
      .sort((a, b) => {
        // Sort by due date (upcoming first), then by created date
        if (a.dueDate && b.dueDate) {
          return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
        }
        if (a.dueDate) return -1;
        if (b.dueDate) return 1;
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
  }, [activities, contacts, deals, filterType, filterStatus, searchQuery]);

  const types: { key: FilterType; label: string }[] = [
    { key: 'all', label: 'All' },
    { key: 'call', label: 'Calls' },
    { key: 'meeting', label: 'Meetings' },
    { key: 'task', label: 'Tasks' },
    { key: 'email', label: 'Emails' },
    { key: 'note', label: 'Notes' },
  ];

  const statusFilters: { key: FilterStatus; label: string }[] = [
    { key: 'all', label: 'All' },
    { key: 'pending', label: 'Pending' },
    { key: 'completed', label: 'Completed' },
    { key: 'overdue', label: 'Overdue' },
  ];

  const counts = useMemo(() => {
    const pending = activities.filter((a) => !a.completed && a.dueDate).length;
    const completed = activities.filter((a) => a.completed).length;
    const overdue = activities.filter(
      (a) => !a.completed && a.dueDate && new Date(a.dueDate) < now
    ).length;
    return { all: activities.length, pending, completed, overdue };
  }, [activities]);

  return (
    <div className="min-h-screen">
      <Header
        title="Activities"
        subtitle={`${filteredActivities.length} activities`}
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
            Add Activity
          </Button>
        }
      />

      <div className="p-6">
        {/* Filters */}
        <div className="flex flex-wrap items-center gap-4 mb-6">
          {/* Status Filter */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-slate-500">Status:</span>
            {statusFilters.map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setFilterStatus(key)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  filterStatus === key
                    ? 'bg-primary-500 text-white'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                }`}
              >
                {label}
                {key !== 'all' && (
                  <span className="ml-1.5 text-xs opacity-75">({counts[key]})</span>
                )}
              </button>
            ))}
          </div>

          {/* Type Filter */}
          <div className="flex items-center gap-2 ml-auto">
            <span className="text-sm text-slate-500">Type:</span>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as FilterType)}
              className="px-3 py-1.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              {types.map(({ key, label }) => (
                <option key={key} value={key}>
                  {label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Activities List */}
        {filteredActivities.length > 0 ? (
          <div className="bg-white rounded-xl border border-slate-200 divide-y divide-slate-100">
            {filteredActivities.map((activity) => {
              const contact = contacts.find((c) => c.id === activity.contactId);
              const deal = deals.find((d) => d.id === activity.dealId);
              return (
                <ActivityItem
                  key={activity.id}
                  activity={activity}
                  contact={contact}
                  deal={deal}
                />
              );
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
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
              />
            </svg>
            <h3 className="mt-4 text-lg font-medium text-slate-900">No activities found</h3>
            <p className="mt-2 text-slate-500">
              {searchQuery
                ? 'Try adjusting your search or filter criteria'
                : 'Get started by adding your first activity'}
            </p>
          </div>
        )}

        {/* Summary Stats */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg border border-slate-200 p-4">
            <p className="text-sm text-slate-500">Total Activities</p>
            <p className="text-2xl font-semibold text-slate-900">{activities.length}</p>
          </div>
          <div className="bg-white rounded-lg border border-slate-200 p-4">
            <p className="text-sm text-slate-500">Pending Tasks</p>
            <p className="text-2xl font-semibold text-yellow-600">{counts.pending}</p>
          </div>
          <div className="bg-white rounded-lg border border-slate-200 p-4">
            <p className="text-sm text-slate-500">Overdue</p>
            <p className="text-2xl font-semibold text-red-600">{counts.overdue}</p>
          </div>
          <div className="bg-white rounded-lg border border-slate-200 p-4">
            <p className="text-sm text-slate-500">Completed</p>
            <p className="text-2xl font-semibold text-green-600">{counts.completed}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
