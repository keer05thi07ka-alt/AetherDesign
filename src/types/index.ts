export type WorkspaceRole = 'business' | 'creator';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: WorkspaceRole;
  company?: string;
  title?: string;
  bio?: string;
}

export interface BrandKit {
  id: string;
  name: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  typography: string;
  tone: string;
  logoUrl: string;
  guidelines: string;
  updatedAt: string;
}

export interface Campaign {
  id: string;
  name: string;
  description: string;
  audience: string;
  industry: string;
  platform: string;
  assignedCreator: {
    name: string;
    avatar: string;
    role: string;
  };
  deadline: string;
  status: 'Active' | 'Under Review' | 'Completed' | 'Draft';
  progress: number;
  assetsCount: number;
  createdAt: string;
}

export interface GeneratedAsset {
  id: string;
  title: string;
  prompt: string;
  platform: string;
  audience: string;
  style: string;
  imageUrl: string;
  createdAt: string;
  isFavorite: boolean;
  category: string;
  dimensions: string;
  aspectRatio: string;
  tags: string[];
}

export interface Template {
  id: string;
  title: string;
  category: 'Social Media' | 'Banner' | 'Poster' | 'Logo' | 'Presentation' | 'Business' | 'Marketing';
  imageUrl: string;
  downloads: string;
  rating: number;
  tags: string[];
  isTrending?: boolean;
}

export interface ApprovalItem {
  id: string;
  title: string;
  campaignName: string;
  creatorName: string;
  creatorAvatar: string;
  submissionDate: string;
  imageUrl: string;
  status: 'pending' | 'approved' | 'rejected';
  comments: {
    id: string;
    author: string;
    text: string;
    time: string;
    avatar: string;
  }[];
}

export interface ActivityItem {
  id: string;
  user: string;
  action: string;
  target: string;
  time: string;
  iconType: 'campaign' | 'asset' | 'approval' | 'brand';
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  time: string;
  unread: boolean;
  type: 'info' | 'success' | 'warning';
}
