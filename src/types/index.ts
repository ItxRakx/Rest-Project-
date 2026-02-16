export type TableStatus = 'available' | 'occupied' | 'in-progress' | 'delayed';
export type CameraStatus = 'live' | 'recorded' | 'offline';
export type OrderStatus = 'queued' | 'preparing' | 'ready' | 'delivered' | 'delayed';
export type AlertSeverity = 'critical' | 'warning' | 'info';

export interface Table {
  id: number;
  number: string;
  status: TableStatus;
  customerId?: string;
  waiterId?: string;
  seatedTime?: Date;
  orderId?: string;
  x: number;
  y: number;
  occupancyTime?: number;
}

export interface Order {
  id: string;
  tableId: number;
  status: OrderStatus;
  items: OrderItem[];
  placedTime: Date;
  estimatedReadyTime?: Date;
  actualReadyTime?: Date;
  deliveredTime?: Date;
  isDelayed: boolean;
}

export interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  specialRequests?: string;
}

export interface Waiter {
  id: string;
  name: string;
  status: 'available' | 'busy' | 'break' | 'offline';
  assignedTables: number[];
  currentTask?: string;
  averageResponseTime: number;
  delayedTables: number;
}

export interface Camera {
  id: string;
  name: string;
  zone: string;
  status: CameraStatus;
  insights?: CameraInsight[];
  x: number;
  y: number;
  fov?: {
    angle: number;
    range: number;
    direction: number;
  };
  zoneBounds?: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
}

export interface CameraInsight {
  id: string;
  type: 'customer_detected' | 'table_assigned' | 'movement_tracking' | 'crowd_density';
  timestamp: Date;
  description: string;
  severity: 'low' | 'medium' | 'high';
}

export interface Alert {
  id: string;
  type: 'waiter_delay' | 'late_order' | 'idle_table' | 'camera_offline' | 'critical_event';
  severity: AlertSeverity;
  message: string;
  timestamp: Date;
  resourceId?: string;
  resourceType?: 'table' | 'waiter' | 'order' | 'camera';
  resolved: boolean;
}

export interface TimelineEvent {
  id: string;
  type: 'customer_detected' | 'seated' | 'waiter_arrived' | 'order_placed' | 'preparing' | 'ready' | 'served';
  timestamp: Date;
  description: string;
  durationFromPrevious?: number;
}

export interface RestaurantMetrics {
  totalTables: number;
  occupiedTables: number;
  availableTables: number;
  averageOccupancyTime: number;
  averageServiceTime: number;
  averageWaitTime: number;
  slaCompliance: number;
  activeWaiters: number;
  ordersInQueue: number;
  ordersDelayed: number;
  totalCapacity: number;
  currentOccupancy: number;
}

export interface SpatialObject {
  id: string | number;
  x: number;
  y: number;
  type: 'human' | 'object' | 'other' | 'manager' | 'customer' | 'waiter';
  label?: string;
}
