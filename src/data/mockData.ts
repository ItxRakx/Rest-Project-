import {
  Table,
  Waiter,
  Camera,
  Order,
  Alert,
  TimelineEvent,
} from '../types';

export const generateTables = (): Table[] => {
  const positions = [
    { x: 10, y: 10 },
    { x: 35, y: 10 },
    { x: 60, y: 10 },
    { x: 85, y: 10 },
    { x: 10, y: 35 },
    { x: 35, y: 35 },
    { x: 60, y: 35 },
    { x: 85, y: 35 },
    { x: 10, y: 60 },
    { x: 35, y: 60 },
    { x: 60, y: 60 },
    { x: 85, y: 60 },
    { x: 22, y: 85 },
    { x: 50, y: 85 },
    { x: 78, y: 85 },
  ];

  const statuses = ['available', 'occupied', 'in-progress', 'delayed'] as const;

  return positions.map((pos, i) => ({
    id: i + 1,
    number: `T${String(i + 1).padStart(2, '0')}`,
    status: statuses[Math.floor(Math.random() * statuses.length)],
    x: pos.x,
    y: pos.y,
    customerId: `CUST${String(i).padStart(3, '0')}`,
    waiterId: i % 3 === 0 ? undefined : `W${String((i % 3) + 1)}`,
    seatedTime: new Date(Date.now() - Math.random() * 3600000),
    orderId: `ORD${String(i).padStart(4, '0')}`,
    occupancyTime: Math.floor(Math.random() * 120),
  }));
};

export const generateWaiters = (): Waiter[] => [
  {
    id: 'W1',
    name: 'Maria Garcia',
    status: 'busy',
    assignedTables: [1, 4, 7, 10],
    currentTask: 'Taking order at Table 4',
    averageResponseTime: 45,
    delayedTables: 0,
  },
  {
    id: 'W2',
    name: 'James Chen',
    status: 'busy',
    assignedTables: [2, 5, 8, 11],
    currentTask: 'Serving drinks',
    averageResponseTime: 52,
    delayedTables: 1,
  },
  {
    id: 'W3',
    name: 'Sofia Rodriguez',
    status: 'available',
    assignedTables: [3, 6, 9, 12],
    currentTask: undefined,
    averageResponseTime: 38,
    delayedTables: 0,
  },
];

export const generateCameras = (): Camera[] => [
  {
    id: 'CAM1',
    name: 'Front Entrance',
    zone: 'Entrance & Waiting Area',
    status: 'live',
    x: 20,
    y: 85,
    fov: {
      angle: 90,
      range: 30,
      direction: 315 // Pointing towards center-ish
    },
    zoneBounds: {
      x: 0,
      y: 60,
      width: 40,
      height: 40
    },
    insights: [
      {
        id: 'INS1',
        type: 'customer_detected',
        timestamp: new Date(Date.now() - 120000),
        description: '3 customers detected entering',
        severity: 'low',
      },
    ],
  },
  {
    id: 'CAM2',
    name: 'Main Dining',
    zone: 'Main Dining Area',
    status: 'live',
    x: 50,
    y: 50,
    fov: {
      angle: 360,
      range: 25,
      direction: 0
    },
    zoneBounds: {
      x: 30,
      y: 30,
      width: 40,
      height: 40
    },
    insights: [
      {
        id: 'INS2',
        type: 'crowd_density',
        timestamp: new Date(Date.now() - 300000),
        description: 'High crowd density detected',
        severity: 'medium',
      },
    ],
  },
  {
    id: 'CAM3',
    name: 'Kitchen View',
    zone: 'Kitchen Pass',
    status: 'live',
    x: 80,
    y: 20,
    fov: { angle: 110, range: 35, direction: 135 },
    zoneBounds: { x: 60, y: 0, width: 40, height: 40 },
    insights: [],
  },
  {
    id: 'CAM4',
    name: 'Bar Station',
    zone: 'Bar & Beverage',
    status: 'recorded',
    x: 20,
    y: 20,
    fov: { angle: 100, range: 25, direction: 45 },
    zoneBounds: { x: 0, y: 0, width: 40, height: 40 },
    insights: [],
  },
  {
    id: 'CAM5',
    name: 'Patio Area',
    zone: 'Outdoor Seating',
    status: 'offline',
    x: 80,
    y: 80,
    fov: { angle: 120, range: 30, direction: 225 },
    zoneBounds: { x: 60, y: 60, width: 40, height: 40 },
    insights: [],
  },
  {
    id: 'CAM6',
    name: 'Checkout Counter',
    zone: 'Payment Area',
    status: 'live',
    x: 60,
    y: 10,
    fov: { angle: 60, range: 20, direction: 180 },
    zoneBounds: { x: 50, y: 0, width: 20, height: 20 },
    insights: [],
  },
];

export const generateAlerts = (): Alert[] => [
  {
    id: 'ALT1',
    type: 'waiter_delay',
    severity: 'critical',
    message: 'Waiter response time exceeded threshold at Table 8',
    timestamp: new Date(Date.now() - 300000),
    resourceId: '8',
    resourceType: 'table',
    resolved: false,
  },
  {
    id: 'ALT2',
    type: 'late_order',
    severity: 'warning',
    message: 'Order for Table 5 is 8 minutes behind estimated delivery',
    timestamp: new Date(Date.now() - 480000),
    resourceId: 'ORD0005',
    resourceType: 'order',
    resolved: false,
  },
  {
    id: 'ALT3',
    type: 'idle_table',
    severity: 'info',
    message: 'Table 12 has been unoccupied for 45 minutes',
    timestamp: new Date(Date.now() - 900000),
    resourceId: '12',
    resourceType: 'table',
    resolved: true,
  },
  {
    id: 'ALT4',
    type: 'camera_offline',
    severity: 'warning',
    message: 'Patio Area camera (CAM5) went offline',
    timestamp: new Date(Date.now() - 600000),
    resourceId: 'CAM5',
    resourceType: 'camera',
    resolved: false,
  },
];

export const generateOrders = (): Order[] => [
  {
    id: 'ORD0001',
    tableId: 1,
    status: 'ready',
    items: [
      { id: '1', name: 'Grilled Salmon', quantity: 2 },
      { id: '2', name: 'Caesar Salad', quantity: 2 },
    ],
    placedTime: new Date(Date.now() - 1800000),
    estimatedReadyTime: new Date(Date.now() - 600000),
    actualReadyTime: new Date(Date.now() - 300000),
    isDelayed: false,
  },
  {
    id: 'ORD0002',
    tableId: 2,
    status: 'preparing',
    items: [
      { id: '3', name: 'Ribeye Steak', quantity: 1, specialRequests: 'Medium rare' },
      { id: '4', name: 'Truffle Fries', quantity: 1 },
    ],
    placedTime: new Date(Date.now() - 1200000),
    estimatedReadyTime: new Date(Date.now() + 600000),
    isDelayed: false,
  },
  {
    id: 'ORD0003',
    tableId: 4,
    status: 'delayed',
    items: [
      { id: '5', name: 'Lobster Tail', quantity: 1 },
      { id: '6', name: 'Roasted Vegetables', quantity: 2 },
    ],
    placedTime: new Date(Date.now() - 2400000),
    estimatedReadyTime: new Date(Date.now() - 300000),
    isDelayed: true,
  },
  {
    id: 'ORD0004',
    tableId: 5,
    status: 'queued',
    items: [
      { id: '7', name: 'Burger Deluxe', quantity: 1 },
      { id: '8', name: 'Sweet Potato Fries', quantity: 1 },
    ],
    placedTime: new Date(Date.now() - 600000),
    estimatedReadyTime: new Date(Date.now() + 900000),
    isDelayed: false,
  },
];

export const generateTimeline = (): TimelineEvent[] => [
  {
    id: 'TL1',
    type: 'customer_detected',
    timestamp: new Date(Date.now() - 3600000),
    description: 'Customers detected at entrance',
    durationFromPrevious: 0,
  },
  {
    id: 'TL2',
    type: 'seated',
    timestamp: new Date(Date.now() - 3480000),
    description: 'Party of 2 seated at Table 04',
    durationFromPrevious: 2,
  },
  {
    id: 'TL3',
    type: 'waiter_arrived',
    timestamp: new Date(Date.now() - 3360000),
    description: 'Waiter Maria arrived with menus',
    durationFromPrevious: 2,
  },
  {
    id: 'TL4',
    type: 'order_placed',
    timestamp: new Date(Date.now() - 2820000),
    description: 'Order placed: Salmon, Salad',
    durationFromPrevious: 9,
  },
  {
    id: 'TL5',
    type: 'preparing',
    timestamp: new Date(Date.now() - 2400000),
    description: 'Kitchen started preparation',
    durationFromPrevious: 7,
  },
  {
    id: 'TL6',
    type: 'ready',
    timestamp: new Date(Date.now() - 600000),
    description: 'Order ready at pass',
    durationFromPrevious: 30,
  },
  {
    id: 'TL7',
    type: 'served',
    timestamp: new Date(Date.now() - 300000),
    description: 'Order delivered to table',
    durationFromPrevious: 5,
  },
];

export const calculateMetrics = (
  tables: Table[],
  orders: Order[],
  waiters: Waiter[]
) => {
  const occupied = tables.filter((t) => t.status !== 'available').length;
  const delayedOrders = orders.filter((o) => o.isDelayed).length;
  const averageOccupancy =
    tables
      .filter((t) => t.occupancyTime)
      .reduce((sum, t) => sum + (t.occupancyTime || 0), 0) / tables.length;

  return {
    totalTables: tables.length,
    occupiedTables: occupied,
    availableTables: tables.length - occupied,
    averageOccupancyTime: Math.round(averageOccupancy),
    averageServiceTime: 42,
    averageWaitTime: 8,
    slaCompliance: 94,
    activeWaiters: waiters.filter((w) => w.status !== 'offline').length,
    ordersInQueue: orders.filter((o) => o.status === 'queued').length,
    ordersDelayed: delayedOrders,
    totalCapacity: tables.length * 4,
    currentOccupancy: occupied * 3, // Mock average of 3 people per table
  };
};
