import React, { useState, useMemo } from 'react';
import { Header } from '../components/Header';
import { Button } from '../components/Button';
import { ContactCard } from '../components/ContactCard';
import { useCRMStore } from '../store';

type FilterStatus = 'all' | 'active' | 'inactive' | 'lead';

export function Contacts() {
  const { contacts, searchQuery } = useCRMStore();
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all');

  const filteredContacts = useMemo(() => {
    return contacts.filter((contact) => {
      // Filter by status
      if (filterStatus !== 'all' && contact.status !== filterStatus) {
        return false;
      }

      // Filter by search query
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          contact.name.toLowerCase().includes(query) ||
          contact.email.toLowerCase().includes(query) ||
          contact.company.toLowerCase().includes(query) ||
          contact.position.toLowerCase().includes(query)
        );
      }

      return true;
    });
  }, [contacts, filterStatus, searchQuery]);

  const statusCounts = useMemo(() => {
    return {
      all: contacts.length,
      active: contacts.filter((c) => c.status === 'active').length,
      inactive: contacts.filter((c) => c.status === 'inactive').length,
      lead: contacts.filter((c) => c.status === 'lead').length,
    };
  }, [contacts]);

  return (
    <div className="min-h-screen">
      <Header
        title="Contacts"
        subtitle={`${filteredContacts.length} contacts`}
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
            Add Contact
          </Button>
        }
      />

      <div className="p-6">
        {/* Filters */}
        <div className="flex items-center gap-2 mb-6">
          {(['all', 'active', 'lead', 'inactive'] as FilterStatus[]).map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filterStatus === status
                  ? 'bg-primary-500 text-white'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
              <span className="ml-2 text-xs opacity-75">({statusCounts[status]})</span>
            </button>
          ))}
        </div>

        {/* Contacts Grid */}
        {filteredContacts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredContacts.map((contact) => (
              <ContactCard key={contact.id} contact={contact} />
            ))}
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
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
            <h3 className="mt-4 text-lg font-medium text-slate-900">No contacts found</h3>
            <p className="mt-2 text-slate-500">
              {searchQuery
                ? 'Try adjusting your search or filter criteria'
                : 'Get started by adding your first contact'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
