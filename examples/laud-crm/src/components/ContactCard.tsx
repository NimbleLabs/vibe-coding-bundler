import React from 'react';
import { Link } from 'react-router-dom';
import type { Contact } from '../types';
import { ContactStatusBadge } from './Badge';

interface ContactCardProps {
  contact: Contact;
}

export function ContactCard({ contact }: ContactCardProps) {
  // Generate initials from name
  const initials = contact.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  // Generate a consistent color based on the name
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
    <Link
      to={`/contacts/${contact.id}`}
      className="block bg-white rounded-xl border border-slate-200 p-4 hover:border-primary-300 hover:shadow-md transition-all"
    >
      <div className="flex items-start gap-4">
        {/* Avatar */}
        <div
          className={`w-12 h-12 ${bgColor} rounded-full flex items-center justify-center text-white font-semibold`}
        >
          {initials}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-slate-900 truncate">{contact.name}</h3>
            <ContactStatusBadge status={contact.status} />
          </div>
          <p className="text-sm text-slate-600 truncate">{contact.position}</p>
          <p className="text-sm text-slate-500 truncate">{contact.company}</p>
        </div>
      </div>

      {/* Contact Info */}
      <div className="mt-4 pt-4 border-t border-slate-100 grid grid-cols-2 gap-2">
        <div className="flex items-center gap-2 text-sm text-slate-500">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
            />
          </svg>
          <span className="truncate">{contact.email}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-slate-500">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
            />
          </svg>
          <span className="truncate">{contact.phone}</span>
        </div>
      </div>
    </Link>
  );
}

// Compact version for lists
export function ContactListItem({ contact }: ContactCardProps) {
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
    <Link
      to={`/contacts/${contact.id}`}
      className="flex items-center gap-4 p-4 hover:bg-slate-50 transition-colors"
    >
      <div
        className={`w-10 h-10 ${bgColor} rounded-full flex items-center justify-center text-white text-sm font-semibold`}
      >
        {initials}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="font-medium text-slate-900">{contact.name}</span>
          <ContactStatusBadge status={contact.status} />
        </div>
        <p className="text-sm text-slate-500 truncate">
          {contact.position} at {contact.company}
        </p>
      </div>
      <svg
        className="w-5 h-5 text-slate-400"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 5l7 7-7 7"
        />
      </svg>
    </Link>
  );
}
