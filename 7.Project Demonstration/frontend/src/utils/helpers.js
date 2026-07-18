export const getStatusClass = (status) => {
  const statusMap = {
    Pending: 'status-pending',
    Assigned: 'status-assigned',
    'In Progress': 'status-in-progress',
    Resolved: 'status-resolved',
    Closed: 'status-closed',
  };
  return statusMap[status] || 'status-pending';
};

export const getPriorityClass = (priority) => {
  const priorityMap = {
    Low: 'bg-gray-100 text-gray-700',
    Medium: 'bg-blue-100 text-blue-700',
    High: 'bg-orange-100 text-orange-700',
    Critical: 'bg-red-100 text-red-700',
  };
  return priorityMap[priority] || 'bg-gray-100 text-gray-700';
};

export const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const CATEGORIES = [
  'Infrastructure',
  'Utilities',
  'Sanitation',
  'Roads & Transport',
  'Public Safety',
  'Environment',
  'Other',
];

export const STATUSES = ['Pending', 'Assigned', 'In Progress', 'Resolved', 'Closed'];

export const PRIORITIES = ['Low', 'Medium', 'High', 'Critical'];
