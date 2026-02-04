import React from 'react';
import { createBrowserRouter, createHashRouter } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Dashboard } from './pages/Dashboard';
import { Contacts } from './pages/Contacts';
import { ContactDetail } from './pages/ContactDetail';
import { Deals } from './pages/Deals';
import { Pipeline } from './pages/Pipeline';
import { Activities } from './pages/Activities';

// Use hash router for file:// protocol compatibility
export const router = createHashRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        index: true,
        element: <Dashboard />,
      },
      {
        path: 'contacts',
        element: <Contacts />,
      },
      {
        path: 'contacts/:id',
        element: <ContactDetail />,
      },
      {
        path: 'deals',
        element: <Deals />,
      },
      {
        path: 'deals/:id',
        element: <ContactDetail />, // Reuse contact detail layout for now
      },
      {
        path: 'pipeline',
        element: <Pipeline />,
      },
      {
        path: 'activities',
        element: <Activities />,
      },
    ],
  },
]);
