import React from 'react';
import {
  Eye,
  Users,
  CheckCircle,
  FileText,
  Flame,
  Package,
  CheckCheck,
  AlertCircle,
} from 'lucide-react';
import { TimelineEvent } from '../types';
import { formatDateTime } from '../utils/formatting';

interface TimelineViewProps {
  events: TimelineEvent[];
}

const getEventIcon = (type: string) => {
  switch (type) {
    case 'customer_detected':
      return <Eye className="w-5 h-5" />;
    case 'seated':
      return <Users className="w-5 h-5" />;
    case 'waiter_arrived':
      return <CheckCircle className="w-5 h-5" />;
    case 'order_placed':
      return <FileText className="w-5 h-5" />;
    case 'preparing':
      return <Flame className="w-5 h-5" />;
    case 'ready':
      return <Package className="w-5 h-5" />;
    case 'served':
      return <CheckCheck className="w-5 h-5" />;
    default:
      return <AlertCircle className="w-5 h-5" />;
  }
};

const getEventColor = (type: string) => {
  switch (type) {
    case 'customer_detected':
      return 'bg-blue-100 text-blue-700';
    case 'seated':
      return 'bg-green-100 text-green-700';
    case 'waiter_arrived':
      return 'bg-purple-100 text-purple-700';
    case 'order_placed':
      return 'bg-orange-100 text-orange-700';
    case 'preparing':
      return 'bg-red-100 text-red-700';
    case 'ready':
      return 'bg-amber-100 text-amber-700';
    case 'served':
      return 'bg-green-100 text-green-700';
    default:
      return 'bg-gray-100 text-gray-700';
  }
};

const getEventLabel = (type: string) => {
  switch (type) {
    case 'customer_detected':
      return 'Customer Detected';
    case 'seated':
      return 'Seated';
    case 'waiter_arrived':
      return 'Waiter Arrived';
    case 'order_placed':
      return 'Order Placed';
    case 'preparing':
      return 'Preparing';
    case 'ready':
      return 'Ready at Pass';
    case 'served':
      return 'Served';
    default:
      return 'Unknown Event';
  }
};

const TimelineView: React.FC<TimelineViewProps> = ({ events }) => {
  return (
    <div className="space-y-4">
      {events.map((event, index) => (
        <div key={event.id} className="relative">
          <div className="flex gap-4">
            <div className="flex flex-col items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center ${getEventColor(event.type)} font-semibold`}
              >
                {getEventIcon(event.type)}
              </div>
              {index < events.length - 1 && (
                <div className="w-1 h-12 bg-gradient-to-b from-gray-300 to-gray-200 my-1"></div>
              )}
            </div>

            <div className="flex-1 pt-1">
              <div className="font-semibold text-gray-900">
                {getEventLabel(event.type)}
              </div>
              <div className="text-xs text-gray-600 mt-0.5">
                {formatDateTime(event.timestamp)}
              </div>
              {event.description && (
                <div className="text-sm text-gray-700 mt-1">
                  {event.description}
                </div>
              )}
              {event.durationFromPrevious && (
                <div className="text-xs text-blue-600 font-medium mt-1">
                  +{event.durationFromPrevious}m from previous
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TimelineView;
