import { useState, useEffect } from 'react';
import { Users, FileText, Clock, CheckCircle, AlertTriangle, TrendingUp } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { complaintService } from '../services/complaintService';
import ComplaintCard from '../components/ComplaintCard';
import ComplaintFilters from '../components/ComplaintFilters';
import { Complaint, ComplaintFilters as FilterType } from '../types/complaint';

export default function AdminDashboard() {
  const { state } = useAuth();
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [filteredComplaints, setFilteredComplaints] = useState<Complaint[]>([]);
  const [filters, setFilters] = useState<FilterType>({});
  const [isLoading, setIsLoading] = useState(true);

  // Mock data - replace with API calls
  useEffect(() => {
    const loadComplaints = async () => {
      setIsLoading(true);
      
      try {
        const allComplaints = await complaintService.getAllComplaints();
        setComplaints(allComplaints);
      } catch (error) {
        console.error('Failed to load complaints:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadComplaints();
  }, []);

  // Filter complaints
  useEffect(() => {
    let filtered = complaints;

    if (filters.search) {
      filtered = filtered.filter(complaint =>
        complaint.title.toLowerCase().includes(filters.search!.toLowerCase()) ||
        complaint.description.toLowerCase().includes(filters.search!.toLowerCase()) ||
        complaint.studentName.toLowerCase().includes(filters.search!.toLowerCase())
      );
    }

    if (filters.category) {
      filtered = filtered.filter(complaint => complaint.category === filters.category);
    }

    if (filters.priority) {
      filtered = filtered.filter(complaint => complaint.priority === filters.priority);
    }

    if (filters.status) {
      filtered = filtered.filter(complaint => complaint.status === filters.status);
    }

    setFilteredComplaints(filtered);
  }, [complaints, filters]);

  const handleStatusChange = async (id: string, newStatus: string, notes?: string) => {
    try {
      const updatedComplaint = await complaintService.updateComplaintStatus(
        id,
        newStatus as any,
        notes
      );
      
      setComplaints(prev => 
        prev.map(complaint => 
          complaint.id === id ? updatedComplaint : complaint
        )
      );
    } catch (error) {
      console.error('Failed to update complaint status:', error);
      alert('Failed to update complaint status. Please try again.');
    }
  };

  const stats = [
    {
      name: 'Total Complaints',
      value: complaints.length,
      icon: <FileText className="h-6 w-6" />,
      color: 'bg-blue-100 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400'
    },
    {
      name: 'Pending',
      value: complaints.filter(c => c.status === 'pending').length,
      icon: <Clock className="h-6 w-6" />,
      color: 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/20 dark:text-yellow-400'
    },
    {
      name: 'In Progress',
      value: complaints.filter(c => c.status === 'in-progress').length,
      icon: <AlertTriangle className="h-6 w-6" />,
      color: 'bg-orange-100 text-orange-600 dark:bg-orange-900/20 dark:text-orange-400'
    },
    {
      name: 'Resolved',
      value: complaints.filter(c => c.status === 'resolved').length,
      icon: <CheckCircle className="h-6 w-6" />,
      color: 'bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400'
    },
    {
      name: 'Active Students',
      value: new Set(complaints.map(c => c.studentId)).size,
      icon: <Users className="h-6 w-6" />,
      color: 'bg-purple-100 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400'
    },
    {
      name: 'Resolution Rate',
      value: `${Math.round((complaints.filter(c => c.status === 'resolved').length / Math.max(complaints.length, 1)) * 100)}%`,
      icon: <TrendingUp className="h-6 w-6" />,
      color: 'bg-indigo-100 text-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-400'
    }
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="px-4 py-6 sm:px-0">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Admin Dashboard</h1>
              <p className="mt-2 text-gray-600 dark:text-gray-400">
                Manage and resolve student complaints
              </p>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 mb-8">
          {stats.map((stat) => (
            <div
              key={stat.name}
              className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg transition-colors duration-200"
            >
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className={`p-2 rounded-lg ${stat.color}`}>
                      {stat.icon}
                    </div>
                  </div>
                  <div className="ml-3 w-0 flex-1">
                    <dl>
                      <dt className="text-xs font-medium text-gray-500 dark:text-gray-400 truncate">
                        {stat.name}
                      </dt>
                      <dd className="text-lg font-medium text-gray-900 dark:text-white">
                        {stat.value}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Filters */}
        <ComplaintFilters
          filters={filters}
          onFiltersChange={setFilters}
          showStatusFilter={true}
        />

        {/* Quick Status Filter Buttons */}
        <div className="mb-6 flex flex-wrap gap-2">
          <button
            onClick={() => setFilters({ status: 'pending' })}
            className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 hover:bg-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-400 dark:hover:bg-yellow-900/30 transition-colors duration-200"
          >
            Pending ({complaints.filter(c => c.status === 'pending').length})
          </button>
          <button
            onClick={() => setFilters({ status: 'in-progress' })}
            className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 hover:bg-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:hover:bg-blue-900/30 transition-colors duration-200"
          >
            In Progress ({complaints.filter(c => c.status === 'in-progress').length})
          </button>
          <button
            onClick={() => setFilters({ priority: 'urgent' })}
            className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium bg-red-100 text-red-800 hover:bg-red-200 dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/30 transition-colors duration-200"
          >
            Urgent ({complaints.filter(c => c.priority === 'urgent').length})
          </button>
          <button
            onClick={() => setFilters({})}
            className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 transition-colors duration-200"
          >
            All Complaints
          </button>
        </div>

        {/* Complaints List */}
        <div className="space-y-6">
          {filteredComplaints.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No complaints found</h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Try adjusting your search criteria to see more results.
              </p>
            </div>
          ) : (
            filteredComplaints.map((complaint) => (
              <ComplaintCard 
                key={complaint.id} 
                complaint={complaint} 
                onStatusChange={handleStatusChange}
                showActions={true}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}