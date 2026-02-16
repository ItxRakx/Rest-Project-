import React, { useState, useEffect } from 'react';
import {
  AlertCircle,
  Users,
  ChefHat,
  Clock,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Bell,
  BellOff
} from 'lucide-react';
import { useRestaurant } from '../contexts/RestaurantContext';
import { getSeverityColor, getTimeAgo } from '../utils/formatting';

export const LeftSidebar: React.FC = () => {
  const { alerts, metrics, waiters, orders, setSelectedAlert, selectedWaiter, setSelectedWaiter } =
    useRestaurant();
  
  const [isCollapsed, setIsCollapsed] = useState(() => {
    const saved = localStorage.getItem('sidebarCollapsed');
    return saved ? JSON.parse(saved) : false;
  });

  const [showAlerts, setShowAlerts] = useState(() => {
    const saved = localStorage.getItem('sidebarShowAlerts');
    return saved ? JSON.parse(saved) : false;
  });

  const [expandedSections, setExpandedSections] = useState({
    alerts: true,
    occupancy: true,
    waiters: true,
    orders: true,
  });

  useEffect(() => {
    localStorage.setItem('sidebarCollapsed', JSON.stringify(isCollapsed));
  }, [isCollapsed]);

  useEffect(() => {
    localStorage.setItem('sidebarShowAlerts', JSON.stringify(showAlerts));
  }, [showAlerts]);

  const toggleSection = (section: keyof typeof expandedSections) => {
    if (isCollapsed) {
      setIsCollapsed(false);
      setExpandedSections(prev => ({ ...prev, [section]: true }));
    } else {
      setExpandedSections((prev) => ({
        ...prev,
        [section]: !prev[section],
      }));
    }
  };

  const unResolvedAlerts = alerts.filter((a) => !a.resolved);

  return (
    <div 
      className={`${isCollapsed ? 'w-12 px-2' : 'w-80 px-4'} bg-white border-r border-gray-200 h-full flex flex-col transition-all duration-300 ease-in-out relative flex-shrink-0`}
    >
      <div className="absolute -right-3 top-6 flex flex-col gap-2 z-10">
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="bg-white border border-gray-200 rounded-full p-1.5 shadow-md hover:bg-gray-50 text-gray-600 hover:text-blue-600 transition-colors"
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
        <button
          onClick={() => setShowAlerts(!showAlerts)}
          className={`bg-white border border-gray-200 rounded-full p-1.5 shadow-md hover:bg-gray-50 transition-colors ${showAlerts ? 'text-blue-600' : 'text-gray-400'}`}
          title={showAlerts ? "Hide Alert Badges" : "Show Alert Badges"}
        >
          {showAlerts ? <Bell size={16} /> : <BellOff size={16} />}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto overflow-x-hidden space-y-4 mt-2 py-4 custom-scrollbar">
        <SidebarItem 
          icon={AlertCircle} 
          label="Critical Alerts" 
          count={unResolvedAlerts.length}
          isActive={expandedSections.alerts}
          onClick={() => toggleSection('alerts')}
          isCollapsed={isCollapsed}
          showAlerts={showAlerts}
        >
            <div className="p-4 space-y-2 max-h-48 overflow-y-auto">
              {unResolvedAlerts.length === 0 ? (
                <p className="text-sm text-gray-500 text-center py-4">
                  No active alerts
                </p>
              ) : (
                unResolvedAlerts.map((alert) => (
                  <button
                    key={alert.id}
                    onClick={() => setSelectedAlert(alert)}
                    className={`w-full p-3 rounded-lg text-left text-xs border-l-4 bg-opacity-50 hover:bg-opacity-100 transition-colors ${
                      alert.severity === 'critical'
                        ? 'bg-red-50 border-red-500'
                        : alert.severity === 'warning'
                          ? 'bg-amber-50 border-amber-500'
                          : 'bg-blue-50 border-blue-500'
                    }`}
                  >
                    <div className={`font-semibold ${getSeverityColor(alert.severity)}`}>
                      {alert.message}
                    </div>
                    <div className="text-gray-600 mt-1">
                      {getTimeAgo(alert.timestamp)}
                    </div>
                  </button>
                ))
              )}
            </div>
        </SidebarItem>

        <SidebarItem 
          icon={Users} 
          label="Table Occupancy" 
          isActive={expandedSections.occupancy}
          onClick={() => toggleSection('occupancy')}
          isCollapsed={isCollapsed}
          showAlerts={showAlerts}
        >
            <div className="p-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-600">Total Capacity</span>
                <span className="font-bold text-gray-900">
                  {metrics.totalCapacity}
                </span>
              </div>
              <div className="flex justify-between items-center mb-4">
                <span className="text-sm text-gray-600">Current Guests</span>
                <span className="font-bold text-gray-900">
                  {metrics.currentOccupancy}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div
                  className="bg-blue-600 h-2.5 rounded-full transition-all duration-500"
                  style={{
                    width: `${(metrics.currentOccupancy / metrics.totalCapacity) * 100}%`,
                  }}
                ></div>
              </div>
              <div className="text-xs text-center text-gray-500 mt-1">
                {Math.round(
                  (metrics.currentOccupancy / metrics.totalCapacity) * 100
                )}
                % Occupied
              </div>
            </div>
        </SidebarItem>

        <SidebarItem 
          icon={Clock} 
          label="Waiter Performance" 
          isActive={expandedSections.waiters}
          onClick={() => toggleSection('waiters')}
          isCollapsed={isCollapsed}
          showAlerts={showAlerts}
        >
            <div className="p-4 space-y-3">
              {waiters.map((waiter) => (
                <div
                  key={waiter.id}
                  onClick={() => setSelectedWaiter(selectedWaiter?.id === waiter.id ? null : waiter)}
                  className={`flex items-center justify-between text-sm p-2 rounded cursor-pointer transition-colors ${selectedWaiter?.id === waiter.id ? 'bg-blue-50 border border-blue-200' : 'hover:bg-gray-50'}`}
                >
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-2 h-2 rounded-full ${
                        waiter.status === 'available'
                          ? 'bg-green-500'
                          : waiter.status === 'busy'
                            ? 'bg-yellow-500'
                            : 'bg-gray-400'
                      }`}
                    ></div>
                    <span className="text-gray-700">{waiter.name}</span>
                  </div>
                  <span className="font-mono text-gray-500">
                    {waiter.assignedTables.length} tables
                  </span>
                </div>
              ))}
            </div>
        </SidebarItem>

        <SidebarItem 
          icon={ChefHat} 
          label="Orders Overview" 
          isActive={expandedSections.orders}
          onClick={() => toggleSection('orders')}
          isCollapsed={isCollapsed}
          showAlerts={showAlerts}
        >
            <div className="p-4 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Pending</span>
                <span className="font-bold text-orange-600">
                  {orders.filter((o) => o.status === 'queued').length}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Preparing</span>
                <span className="font-bold text-blue-600">
                  {orders.filter((o) => o.status === 'preparing').length}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Ready</span>
                <span className="font-bold text-green-600">
                  {orders.filter((o) => o.status === 'ready').length}
                </span>
              </div>
            </div>
        </SidebarItem>
      </div>
    </div>
  );
};

interface SidebarItemProps {
  icon: any;
  label: string;
  count?: number;
  isActive: boolean;
  onClick: () => void;
  children?: React.ReactNode;
  isCollapsed: boolean;
  showAlerts: boolean;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ 
  icon: Icon, 
  label, 
  count, 
  isActive, 
  onClick,
  children,
  isCollapsed,
  showAlerts
}) => {
  if (isCollapsed) {
    return (
      <div className="relative group">
        <button
          onClick={onClick}
          className="w-full p-2 flex justify-center hover:bg-gray-100 rounded-lg transition-colors"
        >
          <Icon className={`w-6 h-6 ${count && count > 0 && showAlerts ? 'text-red-600' : 'text-gray-600'}`} />
          {count !== undefined && count > 0 && showAlerts && (
            <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
          )}
        </button>
        <div className="absolute left-full top-0 ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50 transition-opacity">
          {label} {count !== undefined && `(${count})`}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm transition-all duration-300">
      <button
        onClick={(e) => {
          e.stopPropagation(); // Stop bubbling just in case
          onClick();
        }}
        className="w-full px-4 py-3 flex items-center justify-between bg-gradient-to-r from-gray-50 to-white hover:from-gray-100 border-b border-gray-200 transition-colors"
      >
        <div className="flex items-center gap-2">
          <Icon className={`w-5 h-5 ${count && count > 0 && showAlerts ? 'text-red-600' : 'text-blue-600'}`} />
          <h3 className="font-semibold text-gray-900">{label}</h3>
          {count !== undefined && (
            <span className={`ml-2 px-2 py-0.5 text-xs font-bold rounded ${count > 0 && showAlerts ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-600'}`}>
              {count}
            </span>
          )}
        </div>
        <ChevronDown
          className={`w-4 h-4 text-gray-500 transition-transform duration-300 ${
            isActive ? 'rotate-180' : ''
          }`}
        />
      </button>
      
      <div className={`transition-all duration-300 ease-in-out overflow-hidden ${isActive ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
        {children}
      </div>
    </div>
  );
};
