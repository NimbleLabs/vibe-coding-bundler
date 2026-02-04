// =============================================================================
// Laud CRM - Zustand Store
// =============================================================================

import { create } from 'zustand';
import type { Contact, Deal, Activity, CRMStore } from './types';
import { contacts, deals, activities } from './data/mockData';

export const useCRMStore = create<CRMStore>((set) => ({
  // Initial state from mock data
  contacts: contacts,
  deals: deals,
  activities: activities,
  searchQuery: '',

  // Search
  setSearchQuery: (query) => set({ searchQuery: query }),

  // Contact actions
  addContact: (contact) =>
    set((state) => ({ contacts: [...state.contacts, contact] })),

  updateContact: (id, updates) =>
    set((state) => ({
      contacts: state.contacts.map((c) =>
        c.id === id ? { ...c, ...updates } : c
      ),
    })),

  deleteContact: (id) =>
    set((state) => ({
      contacts: state.contacts.filter((c) => c.id !== id),
    })),

  // Deal actions
  addDeal: (deal) =>
    set((state) => ({ deals: [...state.deals, deal] })),

  updateDeal: (id, updates) =>
    set((state) => ({
      deals: state.deals.map((d) =>
        d.id === id ? { ...d, ...updates } : d
      ),
    })),

  deleteDeal: (id) =>
    set((state) => ({
      deals: state.deals.filter((d) => d.id !== id),
    })),

  // Activity actions
  addActivity: (activity) =>
    set((state) => ({ activities: [...state.activities, activity] })),

  updateActivity: (id, updates) =>
    set((state) => ({
      activities: state.activities.map((a) =>
        a.id === id ? { ...a, ...updates } : a
      ),
    })),

  deleteActivity: (id) =>
    set((state) => ({
      activities: state.activities.filter((a) => a.id !== id),
    })),

  toggleActivityComplete: (id) =>
    set((state) => ({
      activities: state.activities.map((a) =>
        a.id === id ? { ...a, completed: !a.completed } : a
      ),
    })),
}));

// Selectors for computed values
export const useContactById = (id: string) =>
  useCRMStore((state) => state.contacts.find((c) => c.id === id));

export const useDealById = (id: string) =>
  useCRMStore((state) => state.deals.find((d) => d.id === id));

export const useDealsByContact = (contactId: string) =>
  useCRMStore((state) => state.deals.filter((d) => d.contactId === contactId));

export const useActivitiesByContact = (contactId: string) =>
  useCRMStore((state) =>
    state.activities.filter((a) => a.contactId === contactId)
  );

export const useActivitiesByDeal = (dealId: string) =>
  useCRMStore((state) => state.activities.filter((a) => a.dealId === dealId));

export const useDealsByStage = (stage: string) =>
  useCRMStore((state) => state.deals.filter((d) => d.stage === stage));

export const usePendingActivities = () =>
  useCRMStore((state) =>
    state.activities
      .filter((a) => !a.completed && a.dueDate)
      .sort((a, b) => new Date(a.dueDate!).getTime() - new Date(b.dueDate!).getTime())
  );

// Dashboard metrics
export const useDashboardMetrics = () =>
  useCRMStore((state) => {
    const totalContacts = state.contacts.length;
    const activeContacts = state.contacts.filter((c) => c.status === 'active').length;
    const newLeads = state.contacts.filter((c) => c.status === 'lead').length;

    const totalDeals = state.deals.length;
    const openDeals = state.deals.filter(
      (d) => !['closed-won', 'closed-lost'].includes(d.stage)
    ).length;
    const wonDeals = state.deals.filter((d) => d.stage === 'closed-won');
    const totalWonValue = wonDeals.reduce((sum, d) => sum + d.value, 0);

    const pipelineValue = state.deals
      .filter((d) => !['closed-won', 'closed-lost'].includes(d.stage))
      .reduce((sum, d) => sum + d.value, 0);

    const pendingTasks = state.activities.filter(
      (a) => !a.completed && a.dueDate
    ).length;
    const overdueTasks = state.activities.filter((a) => {
      if (a.completed || !a.dueDate) return false;
      return new Date(a.dueDate) < new Date();
    }).length;

    return {
      totalContacts,
      activeContacts,
      newLeads,
      totalDeals,
      openDeals,
      wonDeals: wonDeals.length,
      totalWonValue,
      pipelineValue,
      pendingTasks,
      overdueTasks,
    };
  });
