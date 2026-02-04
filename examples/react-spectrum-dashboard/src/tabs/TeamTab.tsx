import React from 'react';
import { StatusLight } from '../components/StatusLight';
import { Badge } from '../components/Badge';
import { Table } from '../components/Table';
import { teamMembers } from '../data/mockData';

export function TeamTab() {
  const onlineCount = teamMembers.filter(m => m.status === 'online').length;
  const awayCount = teamMembers.filter(m => m.status === 'away').length;
  const offlineCount = teamMembers.filter(m => m.status === 'offline').length;

  const columns = [
    { key: 'name', label: 'Name', width: '25%' },
    { key: 'email', label: 'Email', width: '30%' },
    { key: 'role', label: 'Role', width: '20%' },
    { key: 'status', label: 'Status', width: '25%' },
  ];

  const getRoleVariant = (r: string) => {
    if (r === 'admin') return 'positive';
    if (r === 'engineer') return 'info';
    return 'neutral';
  };

  const getStatusVariant = (s: string) => {
    if (s === 'online') return 'positive';
    if (s === 'away') return 'notice';
    return 'neutral';
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
          <div>
            <h2 className="font-semibold text-gray-900">Team Members</h2>
            <p className="text-sm text-gray-500">{teamMembers.length} members total</p>
          </div>
        </div>
        <button className="px-4 py-2 bg-blue-500 text-white text-sm font-medium rounded-md hover:bg-blue-600 transition-colors">
          Add Member
        </button>
      </div>

      {/* Status Summary */}
      <div className="flex gap-6">
        <StatusLight variant="positive">{onlineCount} online</StatusLight>
        <StatusLight variant="notice">{awayCount} away</StatusLight>
        <StatusLight variant="neutral">{offlineCount} offline</StatusLight>
      </div>

      {/* Table */}
      <Table
        columns={columns}
        data={teamMembers}
        renderCell={(item, key) => {
          if (key === 'name') {
            return (
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-xs font-medium text-gray-600">
                  {getInitials(item.name)}
                </div>
                <span className="font-medium">{item.name}</span>
              </div>
            );
          }
          if (key === 'email') return <span className="text-gray-500">{item.email}</span>;
          if (key === 'role') return <Badge variant={getRoleVariant(item.role)}>{item.role}</Badge>;
          if (key === 'status') return <StatusLight variant={getStatusVariant(item.status)}>{item.status}</StatusLight>;
          return item[key];
        }}
      />
    </div>
  );
}
