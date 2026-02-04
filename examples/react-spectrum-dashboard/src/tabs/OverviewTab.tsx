import React from 'react';
import { StatusLight } from '../components/StatusLight';
import { Meter } from '../components/Meter';
import { Badge } from '../components/Badge';
import { Table } from '../components/Table';
import { services, getRecentIncidents, getServiceCounts, resourceUsage } from '../data/mockData';

export function OverviewTab() {
  const counts = getServiceCounts();
  const recentIncidents = getRecentIncidents(5);
  const totalRequests = services.reduce((sum, s) => sum + s.requests, 0);

  const incidentColumns = [
    { key: 'title', label: 'Incident', width: '35%' },
    { key: 'service', label: 'Service', width: '20%' },
    { key: 'priority', label: 'Priority', width: '15%' },
    { key: 'status', label: 'Status', width: '15%' },
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

  const formatDate = (d: string) => new Date(d).toLocaleString('en-US', {
    month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
  });

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-5">
          <p className="text-sm text-gray-500">Total Services</p>
          <p className="text-3xl font-semibold text-gray-900 mt-1">{services.length}</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-5">
          <p className="text-sm text-gray-500">Active Requests/sec</p>
          <p className="text-3xl font-semibold text-gray-900 mt-1">{totalRequests.toLocaleString()}</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-5">
          <p className="text-sm text-gray-500">Open Incidents</p>
          <p className="text-3xl font-semibold text-gray-900 mt-1">
            {recentIncidents.filter(i => i.status !== 'resolved').length}
          </p>
        </div>
      </div>

      {/* Health & Resources */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Service Health */}
        <div className="bg-white rounded-lg border border-gray-200 p-5">
          <h3 className="text-sm font-semibold text-gray-900 mb-4">Service Health</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <StatusLight variant="positive">Healthy</StatusLight>
              <span className="text-sm font-medium">{counts.healthy} services</span>
            </div>
            <div className="flex justify-between items-center">
              <StatusLight variant="notice">Degraded</StatusLight>
              <span className="text-sm font-medium">{counts.degraded} services</span>
            </div>
            <div className="flex justify-between items-center">
              <StatusLight variant="negative">Down</StatusLight>
              <span className="text-sm font-medium">{counts.down} services</span>
            </div>
            <div className="flex justify-between items-center">
              <StatusLight variant="neutral">Maintenance</StatusLight>
              <span className="text-sm font-medium">{counts.maintenance} services</span>
            </div>
          </div>
        </div>

        {/* Resource Usage */}
        <div className="bg-white rounded-lg border border-gray-200 p-5">
          <h3 className="text-sm font-semibold text-gray-900 mb-4">Resource Usage</h3>
          <div className="space-y-4">
            <Meter label="CPU Usage" value={resourceUsage.cpu} size="L" />
            <Meter label="Memory Usage" value={resourceUsage.memory} size="L" />
            <Meter label="Bandwidth" value={resourceUsage.bandwidth} size="L" />
          </div>
        </div>
      </div>

      {/* Recent Incidents */}
      <div>
        <h3 className="text-sm font-semibold text-gray-900 mb-3">Recent Incidents</h3>
        <Table
          columns={incidentColumns}
          data={recentIncidents}
          renderCell={(item, key) => {
            if (key === 'priority') return <Badge variant={getPriorityVariant(item.priority)}>{item.priority}</Badge>;
            if (key === 'status') return <StatusLight variant={getStatusVariant(item.status)}>{item.status}</StatusLight>;
            if (key === 'time') return formatDate(item.createdAt);
            return item[key];
          }}
        />
      </div>
    </div>
  );
}
