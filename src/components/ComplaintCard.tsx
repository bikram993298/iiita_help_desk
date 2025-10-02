import { Calendar, User, AlertCircle, CheckCircle, Clock, XCircle } from 'lucide-react';
import { Complaint, PRIORITY_LEVELS, STATUS_OPTIONS } from '../types/complaint';

interface ComplaintCardProps {
  complaint: Complaint;
  onStatusChange?: (id: string, status: string, notes?: string) => void;
  showActions?: boolean;
}

export default function ComplaintCard({ complaint, onStatusChange, showActions = false }: ComplaintCardProps) {
  const priorityConfig = PRIORITY_LEVELS.find(p => p.value === complaint.priority);
  const statusConfig = STATUS_OPTIONS.find(s => s.value === complaint.status);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="h-4 w-4" />;
      case 'in-progress': return <AlertCircle className="h-4 w-4" />;
      case 'resolved': return <CheckCircle className="h-4 w-4" />;
      case 'rejected': return <XCircle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const handleStatusChange = (newStatus: string) => {
    if (onStatusChange) {
      const notes = prompt('Add admin notes (optional):') || '';
      onStatusChange(complaint.id, newStatus, notes);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow duration-200">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            {complaint.title}
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-3">
            {complaint.description}
          </p>
        </div>
        <div className="flex flex-col items-end space-y-2 ml-4">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${priorityConfig?.color || 'bg-gray-100 text-gray-800'}`}>
            {priorityConfig?.label || complaint.priority}
          </span>
          <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${statusConfig?.color || 'bg-gray-100 text-gray-800'}`}>
            {getStatusIcon(complaint.status)}
            <span>{statusConfig?.label || complaint.status}</span>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-4">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1">
            <User className="h-4 w-4" />
            <span>{complaint.studentName}</span>
          </div>
          <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-xs">
            {complaint.category}
          </span>
        </div>
        <div className="flex items-center space-x-1">
          <Calendar className="h-4 w-4" />
          <span>{new Date(complaint.createdAt).toLocaleDateString()}</span>
        </div>
      </div>

      {complaint.adminNotes && (
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3 mb-4">
          <h4 className="text-sm font-medium text-blue-900 dark:text-blue-200 mb-1">Admin Notes:</h4>
          <p className="text-sm text-blue-800 dark:text-blue-300">{complaint.adminNotes}</p>
        </div>
      )}

      {showActions && (
        <div className="flex flex-wrap gap-2 mt-4">
          {STATUS_OPTIONS.map((status) => (
            <button
              key={status.value}
              onClick={() => handleStatusChange(status.value)}
              disabled={complaint.status === status.value}
              className={`px-3 py-1 rounded-md text-xs font-medium transition-colors duration-200 ${
                complaint.status === status.value
                  ? 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              {status.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}