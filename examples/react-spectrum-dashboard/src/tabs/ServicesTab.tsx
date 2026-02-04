import React, { useState, useMemo } from 'react';
import { StatusLight } from '../components/StatusLight';
import { Meter } from '../components/Meter';
import { Badge } from '../components/Badge';
import { Table } from '../components/Table';
import { services } from '../data/mockData';

export function ServicesTab() {
  const [search, setSearch] = useState('');
  const [envFilter, setEnvFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredServices = useMemo(() => {
    return services.filter(s => {
      if (search && !s.name.toLowerCase().includes(search.toLowerCase())) return false;
      if (envFilter !== 'all' && s.environment !== envFilter) return false;
      if (statusFilter !== 'all' && s.status !== statusFilter) return false;
      return true;
    });
  }, [search, envFilter, statusFilter]);

  const columns = [
    { key: 'name', label: 'Name', width: '20%' },
    { key: 'environment', label: 'Environment', width: '12%' },
    { key: 'status', label: 'Status', width: '12%' },
    { key: 'cpu', label: 'CPU', width: '18%' },
    { key: 'memory', label: 'Memory', width: '18%' },
    { key: 'requests', label: 'Requests/s', width: '12%' },
    { key: 'uptime', label: 'Uptime', width: '8%' },
  ];

  const getEnvVariant = (e: string) => {
    if (e === 'production') return 'positive';
    if (e === 'staging') return 'info';
    return 'neutral';
  };

  const getStatusVariant = (s: string) => {
    if (s === 'healthy') return 'positive';
    if (s === 'degraded') return 'notice';
    if (s === 'down') return 'negative';
    return 'neutral';
  };

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <input
          type="text"
          placeholder="Search services..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
        />
        <select
          value={envFilter}
          onChange={(e) => setEnvFilter(e.target.value)}
          className="px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">All Environments</option>
          <option value="production">Production</option>
          <option value="staging">Staging</option>
          <option value="development">Development</option>
        </select>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">All Statuses</option>
          <option value="healthy">Healthy</option>
          <option value="degraded">Degraded</option>
          <option value="down">Down</option>
          <option value="maintenance">Maintenance</option>
        </select>
      </div>

      {/* Table */}
      <Table
        columns={columns}
        data={filteredServices}
        renderCell={(item, key) => {
          if (key === 'name') return <span className="font-medium">{item.name}</span>;
          if (key === 'environment') return <Badge variant={getEnvVariant(item.environment)}>{item.environment}</Badge>;
          if (key === 'status') return <StatusLight variant={getStatusVariant(item.status)}>{item.status}</StatusLight>;
          if (key === 'cpu') return <Meter value={item.cpu} size="S" />;
          if (key === 'memory') return <Meter value={item.memory} size="S" />;
          if (key === 'requests') return item.requests.toLocaleString();
          return item[key];
        }}
      />

      <p className="text-sm text-gray-500">
        Showing {filteredServices.length} of {services.length} services
      </p>
    </div>
  );
}
