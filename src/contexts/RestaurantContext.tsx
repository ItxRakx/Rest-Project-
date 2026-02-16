import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Table,
  Waiter,
  Camera,
  Alert,
  Order,
  RestaurantMetrics,
  TimelineEvent,
  SpatialObject,
} from '../types';
import {
  generateTables,
  generateWaiters,
  generateCameras,
  generateAlerts,
  generateOrders,
  generateTimeline,
  calculateMetrics,
} from '../data/mockData';

interface RestaurantContextType {
  tables: Table[];
  waiters: Waiter[];
  cameras: Camera[];
  alerts: Alert[];
  orders: Order[];
  timeline: TimelineEvent[];
  metrics: RestaurantMetrics;
  selectedTable: Table | null;
  selectedCamera: Camera | null;
  selectedAlert: Alert | null;
  selectedWaiter: Waiter | null;
  setSelectedTable: (table: Table | null) => void;
  setSelectedCamera: (camera: Camera | null) => void;
  setSelectedAlert: (alert: Alert | null) => void;
  setSelectedWaiter: (waiter: Waiter | null) => void;
  liveMode: boolean;
  setLiveMode: (mode: boolean) => void;
  updateTableStatus: (tableId: number, status: Table['status']) => void;
  addTimelineEvent: (event: Omit<TimelineEvent, 'id' | 'timestamp'>) => void;
  spatialData: SpatialObject[];
  updateSpatialData: (objects: SpatialObject[]) => void;
  homographyMatrix: number[][] | null;
  setHomographyMatrix: (matrix: number[][]) => void;
}

const RestaurantContext = createContext<RestaurantContextType | undefined>(
  undefined
);

export const RestaurantProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [tables, setTables] = useState<Table[]>([]);
  const [waiters, setWaiters] = useState<Waiter[]>([]);
  const [cameras, setCameras] = useState<Camera[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [timeline, setTimeline] = useState<TimelineEvent[]>([]);
  const [selectedTable, setSelectedTable] = useState<Table | null>(null);
  const [selectedCamera, setSelectedCamera] = useState<Camera | null>(null);
  const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null);
  const [selectedWaiter, setSelectedWaiter] = useState<Waiter | null>(null);
  const [liveMode, setLiveMode] = useState(true);
  const [spatialData, setSpatialData] = useState<SpatialObject[]>([]);
  const [homographyMatrix, setHomographyMatrix] = useState<number[][] | null>(null);
  
  const [metrics, setMetrics] = useState<RestaurantMetrics>({
    totalTables: 0,
    occupiedTables: 0,
    availableTables: 0,
    averageOccupancyTime: 0,
    averageServiceTime: 0,
    averageWaitTime: 0,
    slaCompliance: 0,
    activeWaiters: 0,
    ordersInQueue: 0,
    ordersDelayed: 0,
    totalCapacity: 0,
    currentOccupancy: 0,
  });

  useEffect(() => {
    const initialTables = generateTables();
    setTables(initialTables);
    setWaiters(generateWaiters());
    setCameras(generateCameras());
    setAlerts(generateAlerts());
    setOrders(generateOrders());
    setTimeline(generateTimeline());
    setSelectedCamera(generateCameras()[0]);
  }, []);

  useEffect(() => {
    const newMetrics = calculateMetrics(tables, orders, waiters);
    setMetrics(newMetrics);
  }, [tables, orders, waiters]);

  // Alert Integration: Check for delayed tables with no movement
  useEffect(() => {
    if (!liveMode) return;
    
    // Simulate checking spatial data against delayed tables
    // In a real app, we would check if any spatial object is near the table coordinates
    const delayedTables = tables.filter(t => t.status === 'delayed');
    
    delayedTables.forEach(table => {
      // Mock logic: randomly decide if there's no movement near a delayed table
      if (Math.random() > 0.8) {
        const existingAlert = alerts.find(a => a.resourceId === table.id.toString() && a.type === 'critical_event');
        if (!existingAlert) {
           const newAlert: Alert = {
             id: `alert-cv-${Date.now()}-${table.id}`,
             type: 'critical_event',
             severity: 'critical',
             message: `No movement detected at Delayed Table ${table.number}`,
             timestamp: new Date(),
             resourceId: table.id.toString(),
             resourceType: 'table',
             resolved: false
           };
           setAlerts(prev => [newAlert, ...prev]);
        }
      }
    });

  }, [tables, spatialData, liveMode]); // Dependency on spatialData ensures we check when data updates

  useEffect(() => {
    if (!liveMode) return;

    // Define mock paths for waiters (Keyframes)
    const WAITER_PATHS = {
      'W1': [ // Kitchen (Top Right) to Table 4 (35, 35)
        { x: 80, y: 20 }, { x: 75, y: 22 }, { x: 70, y: 25 }, { x: 60, y: 30 }, { x: 50, y: 32 }, { x: 40, y: 35 }, { x: 35, y: 35 },
        { x: 35, y: 35 }, { x: 35, y: 35 }, // Stay
        { x: 40, y: 35 }, { x: 50, y: 32 }, { x: 60, y: 30 }, { x: 70, y: 25 }, { x: 80, y: 20 }
      ],
      'W2': [ // Kitchen to Table 10 (35, 60) - Bottom Left ish
        { x: 80, y: 20 }, { x: 80, y: 30 }, { x: 80, y: 40 }, { x: 70, y: 50 }, { x: 60, y: 60 }, { x: 50, y: 60 }, { x: 35, y: 60 },
        { x: 35, y: 60 }, { x: 35, y: 60 },
        { x: 50, y: 60 }, { x: 60, y: 60 }, { x: 70, y: 50 }, { x: 80, y: 40 }, { x: 80, y: 30 }, { x: 80, y: 20 }
      ]
    };

    let step = 0;
    const totalSteps = 200; // Resolution of the loop

    // Simulate spatial data stream with path interpolation
    const spatialInterval = setInterval(() => {
      step = (step + 1) % totalSteps;
      
      const newSpatialData: SpatialObject[] = [];
      
      // Helper to get position based on step
      const getPos = (path: {x:number, y:number}[], offset: number = 0) => {
          const pathIndex = Math.floor(((step + offset) % totalSteps) / totalSteps * path.length);
          return path[pathIndex % path.length];
      };

      const w1Pos = getPos(WAITER_PATHS['W1']);
      newSpatialData.push({ id: 'W1-Obj', x: w1Pos.x, y: w1Pos.y, type: 'human', label: 'W1' });

      const w2Pos = getPos(WAITER_PATHS['W2'], 50); // Offset W2
      newSpatialData.push({ id: 'W2-Obj', x: w2Pos.x, y: w2Pos.y, type: 'human', label: 'W2' });

      // Add some static customers
      newSpatialData.push({ id: 'C1', x: 20, y: 85, type: 'human', label: 'Customer' });

      setSpatialData(newSpatialData);
    }, 100);

    const interval = setInterval(() => {
      setTables((prevTables) =>
        prevTables.map((table) => {
          const rand = Math.random();
          if (rand > 0.95 && table.status === 'available') {
            return { ...table, status: 'occupied' };
          }
          if (rand > 0.98 && table.status === 'occupied') {
            return { ...table, status: 'in-progress' };
          }
          return table;
        })
      );
    }, 5000);

    return () => {
      clearInterval(interval);
      clearInterval(spatialInterval);
    };
  }, [liveMode]);

  const updateTableStatus = (tableId: number, status: Table['status']) => {
    setTables((prevTables) =>
      prevTables.map((table) =>
        table.id === tableId ? { ...table, status } : table
      )
    );
  };

  const addTimelineEvent = (event: Omit<TimelineEvent, 'id' | 'timestamp'>) => {
    const newEvent: TimelineEvent = {
      ...event,
      id: `evt-${Date.now()}`,
      timestamp: new Date(),
    };
    setTimeline((prev) => [newEvent, ...prev]);
  };

  return (
    <RestaurantContext.Provider
      value={{
        tables,
        waiters,
        cameras,
        alerts,
        orders,
        timeline,
        metrics,
        selectedTable,
        selectedCamera,
        selectedAlert,
        selectedWaiter,
        setSelectedTable,
        setSelectedCamera,
        setSelectedAlert,
        setSelectedWaiter,
        liveMode,
        setLiveMode,
        updateTableStatus,
        addTimelineEvent,
        spatialData,
        updateSpatialData: setSpatialData,
        homographyMatrix,
        setHomographyMatrix,
      }}
    >
      {children}
    </RestaurantContext.Provider>
  );
};

export const useRestaurant = () => {
  const context = useContext(RestaurantContext);
  if (!context) {
    throw new Error('useRestaurant must be used within RestaurantProvider');
  }
  return context;
};
