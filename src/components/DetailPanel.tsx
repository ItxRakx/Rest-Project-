import React from 'react';
import { 
  X, 
  User, 
  Users, 
  ChefHat, 
  Clock, 
  Eye, 
  CheckCircle, 
  FileText, 
  Flame, 
  Package, 
  CheckCheck, 
  Trash2 
} from 'lucide-react';
import { useRestaurant } from '../contexts/RestaurantContext';
import { formatDateTime, getTableStatusDisplay } from '../utils/formatting';
import TimelineView from './TimelineView';

export const DetailPanel: React.FC = () => {
  const { selectedTable, setSelectedTable, waiters, orders, timeline, updateTableStatus, addTimelineEvent } =
    useRestaurant();

  if (!selectedTable) return null;

  const handleStatusUpdate = (type: string) => {
    if (!selectedTable) return;

    let newStatus = selectedTable.status;
    let description = '';

    switch (type) {
      case 'customer_detected':
        description = `Customers detected at Table ${selectedTable.number}`;
        break;
      case 'seated':
        newStatus = 'occupied';
        description = `Party seated at Table ${selectedTable.number}`;
        break;
      case 'waiter_arrived':
        newStatus = 'in-progress';
        description = `Waiter arrived at Table ${selectedTable.number}`;
        break;
      case 'order_placed':
        description = `Order placed for Table ${selectedTable.number}`;
        break;
      case 'preparing':
        description = `Order for Table ${selectedTable.number} is preparing`;
        break;
      case 'ready':
        description = `Order for Table ${selectedTable.number} is ready`;
        break;
      case 'served':
        description = `Order served at Table ${selectedTable.number}`;
        break;
      case 'available':
        newStatus = 'available';
        description = `Table ${selectedTable.number} cleared`;
        break;
    }

    if (newStatus !== selectedTable.status) {
      updateTableStatus(selectedTable.id, newStatus);
    }

    if (type !== 'available') {
       addTimelineEvent({
         type: type as any,
         description,
         durationFromPrevious: 0
       });
    }
  };

  console.log('DetailPanel: Found selected table', selectedTable);
  const assignedWaiter = waiters.find((w) => w.id === selectedTable.waiterId);
  const tableOrder = orders.find((o) => o.id === selectedTable.orderId);

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 z-[9999] flex items-center justify-end"
      onClick={() => setSelectedTable(null)}
    >
      <div
        className="bg-white w-full max-w-xl h-full shadow-2xl flex flex-col animate-slide-in-right overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between bg-gradient-to-r from-blue-50 to-white">
          <h2 className="text-lg font-bold text-gray-900">
            Table {selectedTable.number} Details
          </h2>
          <button
            onClick={() => setSelectedTable(null)}
            className="p-1 hover:bg-gray-100 rounded transition-colors"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-xs text-blue-700 font-semibold uppercase tracking-wider">
                  Status
                </div>
                <div className="text-sm font-bold text-blue-900 mt-1">
                  {getTableStatusDisplay(selectedTable.status)}
                </div>
              </div>
              <div>
                <div className="text-xs text-blue-700 font-semibold uppercase tracking-wider">
                  Occupancy Time
                </div>
                <div className="text-sm font-bold text-blue-900 mt-1">
                  {selectedTable.occupancyTime}m
                </div>
              </div>
              <div>
                <div className="text-xs text-blue-700 font-semibold uppercase tracking-wider">
                  Customer ID
                </div>
                <div className="text-sm font-mono text-blue-900 mt-1">
                  {selectedTable.customerId}
                </div>
              </div>
              <div>
                <div className="text-xs text-blue-700 font-semibold uppercase tracking-wider">
                  Seated Time
                </div>
                <div className="text-xs text-blue-900 mt-1">
                  {selectedTable.seatedTime
                    ? formatDateTime(selectedTable.seatedTime)
                    : 'N/A'}
                </div>
              </div>
            </div>
          </div>

          {assignedWaiter && (
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-3">
                <User className="w-5 h-5 text-purple-600" />
                <h3 className="font-semibold text-gray-900">Assigned Waiter</h3>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Name</span>
                  <span className="font-medium text-gray-900">
                    {assignedWaiter.name}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Status</span>
                  <span className="font-medium text-gray-900 capitalize">
                    {assignedWaiter.status}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tables Assigned</span>
                  <span className="font-medium text-gray-900">
                    {assignedWaiter.assignedTables.length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Avg Response Time</span>
                  <span className="font-medium text-gray-900">
                    {assignedWaiter.averageResponseTime}s
                  </span>
                </div>
              </div>
            </div>
          )}

          {tableOrder && (
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-3">
                <ChefHat className="w-5 h-5 text-orange-600" />
                <h3 className="font-semibold text-gray-900">Order Status</h3>
                {tableOrder.isDelayed && (
                  <span className="ml-auto px-2 py-1 bg-red-100 text-red-700 text-xs font-semibold rounded">
                    Delayed
                  </span>
                )}
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Order ID</span>
                  <span className="text-sm font-mono font-medium text-gray-900">
                    {tableOrder.id}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Status</span>
                  <span className="text-sm font-medium text-gray-900 capitalize">
                    {tableOrder.status.replace('-', ' ')}
                  </span>
                </div>
                <div className="border-t border-gray-200 pt-2">
                  <h4 className="text-xs font-semibold text-gray-700 uppercase mb-2">
                    Items
                  </h4>
                  <div className="space-y-1">
                    {tableOrder.items.map((item) => (
                      <div key={item.id} className="text-sm text-gray-700">
                        <span className="font-medium">{item.name}</span>
                        <span className="text-gray-500"> x{item.quantity}</span>
                        {item.specialRequests && (
                          <div className="text-xs text-gray-600 italic">
                            {item.specialRequests}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Quick Actions */}
          <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
            <h3 className="font-semibold text-gray-900 mb-3 text-sm">Quick Actions</h3>
            <div className="grid grid-cols-4 gap-2">
              <button 
                onClick={() => handleStatusUpdate('customer_detected')}
                className="flex flex-col items-center gap-1 p-2 rounded hover:bg-white hover:shadow-sm transition-all text-xs text-gray-600 hover:text-blue-600"
                title="Customer Detected"
              >
                <Eye className="w-5 h-5" />
                <span>Detected</span>
              </button>
              <button 
                onClick={() => handleStatusUpdate('seated')}
                className="flex flex-col items-center gap-1 p-2 rounded hover:bg-white hover:shadow-sm transition-all text-xs text-gray-600 hover:text-green-600"
                title="Seated"
              >
                <Users className="w-5 h-5" />
                <span>Seated</span>
              </button>
              <button 
                onClick={() => handleStatusUpdate('waiter_arrived')}
                className="flex flex-col items-center gap-1 p-2 rounded hover:bg-white hover:shadow-sm transition-all text-xs text-gray-600 hover:text-purple-600"
                title="Waiter Arrived"
              >
                <CheckCircle className="w-5 h-5" />
                <span>Arrived</span>
              </button>
              <button 
                onClick={() => handleStatusUpdate('order_placed')}
                className="flex flex-col items-center gap-1 p-2 rounded hover:bg-white hover:shadow-sm transition-all text-xs text-gray-600 hover:text-orange-600"
                title="Order Placed"
              >
                <FileText className="w-5 h-5" />
                <span>Ordered</span>
              </button>
              <button 
                onClick={() => handleStatusUpdate('preparing')}
                className="flex flex-col items-center gap-1 p-2 rounded hover:bg-white hover:shadow-sm transition-all text-xs text-gray-600 hover:text-red-600"
                title="Preparing"
              >
                <Flame className="w-5 h-5" />
                <span>Cooking</span>
              </button>
              <button 
                onClick={() => handleStatusUpdate('ready')}
                className="flex flex-col items-center gap-1 p-2 rounded hover:bg-white hover:shadow-sm transition-all text-xs text-gray-600 hover:text-amber-600"
                title="Food Ready"
              >
                <Package className="w-5 h-5" />
                <span>Ready</span>
              </button>
              <button 
                onClick={() => handleStatusUpdate('served')}
                className="flex flex-col items-center gap-1 p-2 rounded hover:bg-white hover:shadow-sm transition-all text-xs text-gray-600 hover:text-green-600"
                title="Served"
              >
                <CheckCheck className="w-5 h-5" />
                <span>Served</span>
              </button>
              <button 
                onClick={() => handleStatusUpdate('available')}
                className="flex flex-col items-center gap-1 p-2 rounded hover:bg-white hover:shadow-sm transition-all text-xs text-gray-600 hover:text-gray-900"
                title="Clear Table"
              >
                <Trash2 className="w-5 h-5" />
                <span>Clear</span>
              </button>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Clock className="w-5 h-5 text-blue-600" />
              Service Timeline
            </h3>
            <TimelineView events={timeline} />
          </div>
        </div>

        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex gap-3">
          <button className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors text-sm">
            Notify Waiter
          </button>
          <button className="flex-1 px-4 py-2 bg-amber-100 text-amber-700 rounded-lg font-medium hover:bg-amber-200 transition-colors text-sm">
            Priority
          </button>
        </div>
      </div>
    </div>
  );
};
