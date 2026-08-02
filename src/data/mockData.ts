import type { BrandKit, Campaign, GeneratedAsset, Template, ApprovalItem, ActivityItem, NotificationItem } from '../types';

export const initialBrandKit: BrandKit = {
  id: 'bk-1',
  name: 'Default Brand Kit',
  primaryColor: '',
  secondaryColor: '',
  accentColor: '',
  typography: '',
  tone: '',
  logoUrl: '',
  guidelines: '',
  updatedAt: 'Never',
};

export const initialCampaigns: Campaign[] = [];

export const initialGeneratedAssets: GeneratedAsset[] = [];

export const mockTemplates: Template[] = [];

export const initialApprovals: ApprovalItem[] = [];

export const mockActivities: ActivityItem[] = [];

export const mockNotifications: NotificationItem[] = [];

export interface AnalyticsData {
  monthlyProjects: Array<{ month: string; Business: number; Creator: number }>;
  downloads: Array<{ day: string; downloads: number }>;
  aiUsage: Array<{ category: string; percentage: number }>;
  creatorProductivity: Array<{ name: string; assets: number; rating: number }>;
}

export const analyticsData: AnalyticsData = {
  monthlyProjects: [
    { month: 'Jan', Business: 0, Creator: 0 },
    { month: 'Feb', Business: 0, Creator: 0 },
    { month: 'Mar', Business: 0, Creator: 0 },
    { month: 'Apr', Business: 0, Creator: 0 },
    { month: 'May', Business: 0, Creator: 0 },
    { month: 'Jun', Business: 0, Creator: 0 },
    { month: 'Jul', Business: 0, Creator: 0 },
  ],
  downloads: [
    { day: 'Mon', downloads: 0 },
    { day: 'Tue', downloads: 0 },
    { day: 'Wed', downloads: 0 },
    { day: 'Thu', downloads: 0 },
    { day: 'Fri', downloads: 0 },
    { day: 'Sat', downloads: 0 },
    { day: 'Sun', downloads: 0 },
  ],
  aiUsage: [],
  creatorProductivity: [],
};
