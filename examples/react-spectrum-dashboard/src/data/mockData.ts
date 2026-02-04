export interface Service {
  id: string;
  name: string;
  environment: 'production' | 'staging' | 'development';
  status: 'healthy' | 'degraded' | 'down' | 'maintenance';
  cpu: number;
  memory: number;
  requests: number;
  uptime: string;
}

export interface Incident {
  id: string;
  title: string;
  service: string;
  priority: 'critical' | 'high' | 'medium' | 'low';
  status: 'open' | 'acknowledged' | 'resolved';
  createdAt: string;
  assignee: string;
}

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'engineer' | 'viewer';
  status: 'online' | 'away' | 'offline';
  avatar?: string;
}

export interface ResourceUsage {
  cpu: number;
  memory: number;
  bandwidth: number;
}

export const services: Service[] = [
  {
    id: 'svc-001',
    name: 'API Gateway',
    environment: 'production',
    status: 'healthy',
    cpu: 45,
    memory: 62,
    requests: 12500,
    uptime: '99.99%',
  },
  {
    id: 'svc-002',
    name: 'User Service',
    environment: 'production',
    status: 'healthy',
    cpu: 32,
    memory: 48,
    requests: 8900,
    uptime: '99.95%',
  },
  {
    id: 'svc-003',
    name: 'Payment Processor',
    environment: 'production',
    status: 'degraded',
    cpu: 78,
    memory: 85,
    requests: 3200,
    uptime: '99.50%',
  },
  {
    id: 'svc-004',
    name: 'Notification Service',
    environment: 'production',
    status: 'healthy',
    cpu: 22,
    memory: 35,
    requests: 15600,
    uptime: '99.98%',
  },
  {
    id: 'svc-005',
    name: 'Analytics Engine',
    environment: 'staging',
    status: 'healthy',
    cpu: 55,
    memory: 70,
    requests: 2100,
    uptime: '99.90%',
  },
  {
    id: 'svc-006',
    name: 'Search Service',
    environment: 'staging',
    status: 'down',
    cpu: 0,
    memory: 0,
    requests: 0,
    uptime: '95.20%',
  },
  {
    id: 'svc-007',
    name: 'Image Processor',
    environment: 'development',
    status: 'healthy',
    cpu: 40,
    memory: 55,
    requests: 450,
    uptime: '98.50%',
  },
  {
    id: 'svc-008',
    name: 'ML Pipeline',
    environment: 'development',
    status: 'maintenance',
    cpu: 10,
    memory: 20,
    requests: 0,
    uptime: '97.00%',
  },
  {
    id: 'svc-009',
    name: 'Cache Layer',
    environment: 'production',
    status: 'healthy',
    cpu: 28,
    memory: 92,
    requests: 45000,
    uptime: '99.99%',
  },
  {
    id: 'svc-010',
    name: 'Email Service',
    environment: 'production',
    status: 'healthy',
    cpu: 15,
    memory: 30,
    requests: 5600,
    uptime: '99.97%',
  },
];

export const incidents: Incident[] = [
  {
    id: 'inc-001',
    title: 'High latency on Payment Processor',
    service: 'Payment Processor',
    priority: 'critical',
    status: 'open',
    createdAt: '2024-01-15T10:30:00Z',
    assignee: 'Sarah Chen',
  },
  {
    id: 'inc-002',
    title: 'Search Service unavailable',
    service: 'Search Service',
    priority: 'critical',
    status: 'acknowledged',
    createdAt: '2024-01-15T09:15:00Z',
    assignee: 'Mike Johnson',
  },
  {
    id: 'inc-003',
    title: 'Memory spike in Cache Layer',
    service: 'Cache Layer',
    priority: 'high',
    status: 'open',
    createdAt: '2024-01-15T08:45:00Z',
    assignee: 'Alex Rivera',
  },
  {
    id: 'inc-004',
    title: 'Scheduled maintenance for ML Pipeline',
    service: 'ML Pipeline',
    priority: 'low',
    status: 'acknowledged',
    createdAt: '2024-01-14T22:00:00Z',
    assignee: 'Emma Wilson',
  },
  {
    id: 'inc-005',
    title: 'API rate limiting threshold reached',
    service: 'API Gateway',
    priority: 'medium',
    status: 'resolved',
    createdAt: '2024-01-14T16:20:00Z',
    assignee: 'Sarah Chen',
  },
  {
    id: 'inc-006',
    title: 'Database connection pool exhausted',
    service: 'User Service',
    priority: 'high',
    status: 'resolved',
    createdAt: '2024-01-14T11:00:00Z',
    assignee: 'Mike Johnson',
  },
];

export const teamMembers: TeamMember[] = [
  {
    id: 'usr-001',
    name: 'Sarah Chen',
    email: 'sarah.chen@cloudmetrics.io',
    role: 'admin',
    status: 'online',
  },
  {
    id: 'usr-002',
    name: 'Mike Johnson',
    email: 'mike.j@cloudmetrics.io',
    role: 'engineer',
    status: 'online',
  },
  {
    id: 'usr-003',
    name: 'Alex Rivera',
    email: 'alex.r@cloudmetrics.io',
    role: 'engineer',
    status: 'away',
  },
  {
    id: 'usr-004',
    name: 'Emma Wilson',
    email: 'emma.w@cloudmetrics.io',
    role: 'engineer',
    status: 'offline',
  },
  {
    id: 'usr-005',
    name: 'Jordan Lee',
    email: 'jordan.l@cloudmetrics.io',
    role: 'viewer',
    status: 'online',
  },
];

export const resourceUsage: ResourceUsage = {
  cpu: 42,
  memory: 67,
  bandwidth: 58,
};

export function getServiceCounts() {
  return {
    healthy: services.filter(s => s.status === 'healthy').length,
    degraded: services.filter(s => s.status === 'degraded').length,
    down: services.filter(s => s.status === 'down').length,
    maintenance: services.filter(s => s.status === 'maintenance').length,
  };
}

export function getOpenIncidents() {
  return incidents.filter(i => i.status !== 'resolved');
}

export function getRecentIncidents(limit: number = 5) {
  return [...incidents]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, limit);
}
