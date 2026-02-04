import React from 'react';
import { Link } from 'react-router-dom';
import { Header } from '../components/Header';
import { StatCard } from '../components/StatCard';
import { DealListItem } from '../components/DealCard';
import { ActivityItemCompact } from '../components/ActivityItem';
import { useCRMStore, useDashboardMetrics, usePendingActivities } from '../store';
import { formatCurrency } from '../types';

export function Dashboard() {
  const { contacts, deals } = useCRMStore();
  const metrics = useDashboardMetrics();
  const pendingActivities = usePendingActivities();

  // Get recent deals (not closed)
  const openDeals = deals
    .filter((d) => !['closed-won', 'closed-lost'].includes(d.stage))
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  // Get upcoming activities
  const upcomingActivities = pendingActivities.slice(0, 5);

  return (
    <div className="min-h-screen">
      <Header title="Dashboard" subtitle="Welcome back, John" />

      <div className="p-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Contacts"
            value={metrics.totalContacts}
            change={12}
            changeLabel="vs last month"
            color="blue"
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
            }
          />
          <StatCard
            title="Open Deals"
            value={metrics.openDeals}
            color="yellow"
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            }
          />
          <StatCard
            title="Pipeline Value"
            value={formatCurrency(metrics.pipelineValue)}
            change={8}
            changeLabel="vs last month"
            color="green"
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                />
              </svg>
            }
          />
          <StatCard
            title="Won This Month"
            value={formatCurrency(metrics.totalWonValue)}
            change={23}
            changeLabel="vs last month"
            color="purple"
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
                />
              </svg>
            }
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Deals */}
          <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
              <h2 className="font-semibold text-slate-900">Recent Deals</h2>
              <Link
                to="/deals"
                className="text-sm text-primary-500 hover:text-primary-600 font-medium"
              >
                View all
              </Link>
            </div>
            <div className="divide-y divide-slate-100">
              {openDeals.map((deal) => {
                const contact = contacts.find((c) => c.id === deal.contactId);
                return <DealListItem key={deal.id} deal={deal} contact={contact} />;
              })}
              {openDeals.length === 0 && (
                <p className="p-6 text-center text-slate-500">No open deals</p>
              )}
            </div>
          </div>

          {/* Upcoming Activities */}
          <div className="bg-white rounded-xl border border-slate-200">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
              <h2 className="font-semibold text-slate-900">Upcoming Tasks</h2>
              <Link
                to="/activities"
                className="text-sm text-primary-500 hover:text-primary-600 font-medium"
              >
                View all
              </Link>
            </div>
            <div className="p-4 space-y-2">
              {upcomingActivities.map((activity) => {
                const contact = contacts.find((c) => c.id === activity.contactId);
                return (
                  <ActivityItemCompact
                    key={activity.id}
                    activity={activity}
                    contact={contact}
                  />
                );
              })}
              {upcomingActivities.length === 0 && (
                <p className="py-4 text-center text-slate-500">No upcoming tasks</p>
              )}
            </div>
          </div>
        </div>

        {/* Quick Stats Row */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <h3 className="text-sm font-medium text-slate-500 mb-4">Lead Sources</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600">New Leads</span>
                <span className="text-sm font-semibold text-slate-900">{metrics.newLeads}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600">Active Contacts</span>
                <span className="text-sm font-semibold text-slate-900">{metrics.activeContacts}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600">Inactive</span>
                <span className="text-sm font-semibold text-slate-900">
                  {metrics.totalContacts - metrics.activeContacts - metrics.newLeads}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <h3 className="text-sm font-medium text-slate-500 mb-4">Tasks Overview</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600">Pending</span>
                <span className="text-sm font-semibold text-slate-900">{metrics.pendingTasks}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600">Overdue</span>
                <span className="text-sm font-semibold text-red-500">{metrics.overdueTasks}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600">Won Deals</span>
                <span className="text-sm font-semibold text-green-500">{metrics.wonDeals}</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <h3 className="text-sm font-medium text-slate-500 mb-4">Quick Actions</h3>
            <div className="space-y-2">
              <Link
                to="/contacts"
                className="flex items-center gap-2 p-2 rounded-lg hover:bg-slate-50 transition-colors"
              >
                <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                </svg>
                <span className="text-sm text-slate-600">Add Contact</span>
              </Link>
              <Link
                to="/deals"
                className="flex items-center gap-2 p-2 rounded-lg hover:bg-slate-50 transition-colors"
              >
                <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                <span className="text-sm text-slate-600">Create Deal</span>
              </Link>
              <Link
                to="/pipeline"
                className="flex items-center gap-2 p-2 rounded-lg hover:bg-slate-50 transition-colors"
              >
                <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
                </svg>
                <span className="text-sm text-slate-600">View Pipeline</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
