export const formatTime = (date: Date): string => {
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
};

export const formatDate = (date: Date): string => {
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });
};

export const formatDateTime = (date: Date): string => {
  return `${formatDate(date)} ${formatTime(date)}`;
};

export const getTimeAgo = (date: Date): string => {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);

  if (seconds < 60) return `${seconds}s ago`;
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;

  return formatDate(date);
};

export const getElapsedTime = (startDate: Date, endDate?: Date): string => {
  const end = endDate || new Date();
  const diff = Math.floor((end.getTime() - startDate.getTime()) / 1000);

  const hours = Math.floor(diff / 3600);
  const minutes = Math.floor((diff % 3600) / 60);
  const seconds = diff % 60;

  if (hours > 0) return `${hours}h ${minutes}m`;
  if (minutes > 0) return `${minutes}m ${seconds}s`;
  return `${seconds}s`;
};

export const getStatusColor = (
  status: string
): 'text-green-600' | 'text-yellow-600' | 'text-blue-600' | 'text-red-600' | 'text-gray-600' => {
  switch (status) {
    case 'available':
      return 'text-green-600';
    case 'occupied':
      return 'text-yellow-600';
    case 'in-progress':
      return 'text-blue-600';
    case 'delayed':
      return 'text-red-600';
    default:
      return 'text-gray-600';
  }
};

export const getStatusBgColor = (
  status: string
): string => {
  switch (status) {
    case 'available':
      return 'bg-green-100';
    case 'occupied':
      return 'bg-yellow-100';
    case 'in-progress':
      return 'bg-blue-100';
    case 'delayed':
      return 'bg-red-100';
    default:
      return 'bg-gray-100';
  }
};

export const getSeverityColor = (
  severity: string
): 'text-red-600' | 'text-amber-600' | 'text-blue-600' | 'text-gray-600' => {
  switch (severity) {
    case 'critical':
      return 'text-red-600';
    case 'warning':
      return 'text-amber-600';
    case 'info':
      return 'text-blue-600';
    default:
      return 'text-gray-600';
  }
};

export const getSeverityBgColor = (severity: string): string => {
  switch (severity) {
    case 'critical':
      return 'bg-red-100';
    case 'warning':
      return 'bg-amber-100';
    case 'info':
      return 'bg-blue-100';
    default:
      return 'bg-gray-100';
  }
};

export const getTableStatusDisplay = (status: string): string => {
  switch (status) {
    case 'available':
      return 'Available';
    case 'occupied':
      return 'Occupied - Waiting';
    case 'in-progress':
      return 'Order In Progress';
    case 'delayed':
      return 'Delayed';
    default:
      return 'Unknown';
  }
};
