import React, { useState, useMemo } from 'react';
import { StatusLight } from '../components/StatusLight';
import { Badge } from '../components/Badge';
import { Table } from '../components/Table';
import { incidents } from '../data/mockData';

export function AlertsTab() {
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');

  const filteredIncidents = useMemo(() => {
    return incidents.filter(i => {
      if (statusFilter !== 'all' && i.status !== statusFilter) return false;
      if (priorityFilter !== 'all' && i.priority !== priorityFilter) return false;
      return true;
    });
  }, [statusFilter, priorityFilter]);

  const openCount = incidents.filter(i => i.status === 'open').length;
  const ackCount = incidents.filter(i => i.status === 'acknowledged').length;
  const resolvedCount = incidents.filter(i => i.status === 'resolved').length;

  const columns = [
    { key: 'title', label: 'Incident', width: '30%' },
    { key: 'service', label: 'Service', width: '15%' },
    { key: 'priority', label: 'Priority', width: '12%' },
    { key: 'status', label: 'Status', width: '13%' },
    { key: 'assignee', label: 'Assignee', width: '15%' },
    { key: 'time', label: 'Time', width: '15%' },
  ];

  const getPriorityVariant = (p: string) => {
    if (p === 'critical' || p === 'high') return 'negative';
    if (p === 'medium') return 'notice';
    return 'neutral';
  };

  const getStatusVariant = (s: string) => {
    if (s === 'resolved') return 'positive';
    if (s === 'acknowledged') return 'notice';
    return 'negative';
  };

  const getTimeAgo = (d: string) => {
    const diff = Date.now() - new Date(d).getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);
    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    return `${Math.floor(diff / (1000 * 60))}m ago`;
  };

  return (
    <div className="space-y-4">
      {/* Summary Cards */}
      <div className="flex gap-3">
        <div className="bg-red-500 text-white rounded-lg px-4 py-3 min-w-[100px]">
          <p className="text-xs opacity-90">Open</p>
          <p className="text-2xl font-semibold">{openCount}</p>
        </div>
        <div className="bg-amber-500 text-white rounded-lg px-4 py-3 min-w-[100px]">
          <p className="text-xs opacity-90">Acknowledged</p>
          <p className="text-2xl font-semibold">{ackCount}</p>
        </div>
        <div className="bg-emerald-500 text-white rounded-lg px-4 py-3 min-w-[100px]">
          <p className="text-xs opacity-90">Resolved</p>
          <p className="text-2xl font-semibold">{resolvedCount}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">All Statuses</option>
          <option value="open">Open</option>
          <option value="acknowledged">Acknowledged</option>
          <option value="resolved">Resolved</option>
        </select>
        <select
          value={priorityFilter}
          onChange={(e) => setPriorityFilter(e.target.value)}
          className="px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">All Priorities</option>
          <option value="critical">Critical</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>
      </div>

      {/* Table */}
      <Table
        columns={columns}
        data={filteredIncidents}
        renderCell={(item, key) => {
          if (key === 'title') return <span className="font-medium">{item.title}</span>;
          if (key === 'priority') return <Badge variant={getPriorityVariant(item.priority)}>{item.priority}</Badge>;
          if (key === 'status') return <StatusLight variant={getStatusVariant(item.status)}>{item.status}</StatusLight>;
          if (key === 'time') return <span className="text-gray-500">{getTimeAgo(item.createdAt)}</span>;
          return item[key];
        }}
      />

      <p className="text-sm text-gray-500">
        Showing {filteredIncidents.length} of {incidents.length} incidents
      </p>
    </div>
  );
}
