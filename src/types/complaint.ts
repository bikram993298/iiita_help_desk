export interface Complaint {
  id: string;
  title: string;
  description: string;
  category: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'pending' | 'in-progress' | 'resolved' | 'rejected';
  studentId: string;
  studentName: string;
  createdAt: string;
  updatedAt: string;
  adminNotes?: string;
}

export interface ComplaintFilters {
  status?: string;
  category?: string;
  priority?: string;
  search?: string;
}

export const COMPLAINT_CATEGORIES = [
  'Academic',
  'Infrastructure',
  'Hostel',
  'Internet/WiFi',
  'Food Services',
  'Library',
  'Security',
  'Transport',
  'Other'
];

export const PRIORITY_LEVELS = [
  { value: 'low', label: 'Low', color: 'bg-green-100 text-green-800' },
  { value: 'medium', label: 'Medium', color: 'bg-yellow-100 text-yellow-800' },
  { value: 'high', label: 'High', color: 'bg-orange-100 text-orange-800' },
  { value: 'urgent', label: 'Urgent', color: 'bg-red-100 text-red-800' }
];

export const STATUS_OPTIONS = [
  { value: 'pending', label: 'Pending', color: 'bg-gray-100 text-gray-800' },
  { value: 'in-progress', label: 'In Progress', color: 'bg-blue-100 text-blue-800' },
  { value: 'resolved', label: 'Resolved', color: 'bg-green-100 text-green-800' },
  { value: 'rejected', label: 'Rejected', color: 'bg-red-100 text-red-800' }
];