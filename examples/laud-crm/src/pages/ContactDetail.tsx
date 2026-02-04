import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Header } from '../components/Header';
import { Button } from '../components/Button';
import { ContactStatusBadge, DealStageBadge } from '../components/Badge';
import { ActivityItem } from '../components/ActivityItem';
import { useCRMStore, useContactById, useDealsByContact, useActivitiesByContact } from '../store';
import { formatCurrency, formatDate } from '../types';

export function ContactDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const contact = useContactById(id || '');
  const deals = useDealsByContact(id || '');
  const activities = useActivitiesByContact(id || '');
  const allDeals = useCRMStore((state) => state.deals);

  if (!contact) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-slate-900">Contact not found</h2>
          <p className="mt-2 text-slate-500">The contact you're looking for doesn't exist.</p>
          <Link to="/contacts" className="mt-4 inline-block text-primary-500 hover:text-primary-600">
            Back to Contacts
          </Link>
        </div>
      </div>
    );
  }

  // Generate initials and color
  const initials = contact.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  const colors = [
    'bg-blue-500',
    'bg-green-500',
    'bg-purple-500',
    'bg-orange-500',
    'bg-pink-500',
    'bg-teal-500',
  ];
  const colorIndex = contact.name.charCodeAt(0) % colors.length;
  const bgColor = colors[colorIndex];

  return (
    <div className="min-h-screen">
      <Header
        title="Contact Details"
        actions={
          <div className="flex items-center gap-2">
            <Button variant="secondary" onClick={() => navigate(-1)}>
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back
            </Button>
            <Button variant="secondary">Edit</Button>
          </div>
        }
      />

      <div className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Contact Info */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl border border-slate-200 p-6">
              <div className="text-center">
                <div
                  className={`w-20 h-20 ${bgColor} rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto`}
                >
                  {initials}
                </div>
                <h2 className="mt-4 text-xl font-semibold text-slate-900">{contact.name}</h2>
                <p className="text-slate-500">{contact.position}</p>
                <p className="text-slate-500">{contact.company}</p>
                <div className="mt-3">
                  <ContactStatusBadge status={contact.status} />
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-slate-200 space-y-4">
                <div className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <a href={`mailto:${contact.email}`} className="text-sm text-primary-500 hover:text-primary-600">
                    {contact.email}
                  </a>
                </div>
                <div className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <a href={`tel:${contact.phone}`} className="text-sm text-slate-600">
                    {contact.phone}
                  </a>
                </div>
                <div className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span className="text-sm text-slate-600">Added {formatDate(contact.createdAt)}</span>
                </div>
              </div>

              {contact.notes && (
                <div className="mt-6 pt-6 border-t border-slate-200">
                  <h3 className="text-sm font-medium text-slate-900 mb-2">Notes</h3>
                  <p className="text-sm text-slate-600">{contact.notes}</p>
                </div>
              )}
            </div>
          </div>

          {/* Deals and Activities */}
          <div className="lg:col-span-2 space-y-6">
            {/* Deals */}
            <div className="bg-white rounded-xl border border-slate-200">
              <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
                <h3 className="font-semibold text-slate-900">Deals ({deals.length})</h3>
                <Button size="sm">Add Deal</Button>
              </div>
              {deals.length > 0 ? (
                <div className="divide-y divide-slate-100">
                  {deals.map((deal) => (
                    <div key={deal.id} className="p-4 hover:bg-slate-50 transition-colors">
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-medium text-slate-900">{deal.title}</h4>
                          <p className="text-sm text-slate-500 mt-1">
                            Expected close: {formatDate(deal.expectedCloseDate)}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-slate-900">{formatCurrency(deal.value)}</p>
                          <DealStageBadge stage={deal.stage} />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="p-6 text-center text-slate-500">No deals associated with this contact</p>
              )}
            </div>

            {/* Activities */}
            <div className="bg-white rounded-xl border border-slate-200">
              <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
                <h3 className="font-semibold text-slate-900">Activities ({activities.length})</h3>
                <Button size="sm">Add Activity</Button>
              </div>
              {activities.length > 0 ? (
                <div className="divide-y divide-slate-100">
                  {activities.map((activity) => {
                    const deal = activity.dealId
                      ? allDeals.find((d) => d.id === activity.dealId)
                      : undefined;
                    return (
                      <ActivityItem
                        key={activity.id}
                        activity={activity}
                        deal={deal}
                        showCheckbox={true}
                      />
                    );
                  })}
                </div>
              ) : (
                <p className="p-6 text-center text-slate-500">No activities for this contact</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
