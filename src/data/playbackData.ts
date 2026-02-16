
export interface PlaybackFrame {
  timestamp: number; // milliseconds from start
  entities: PlaybackEntity[];
}

export interface PlaybackEntity {
  id: string;
  type: 'waiter' | 'manager' | 'customer';
  x: number; // percentage 0-100
  y: number; // percentage 0-100
  label: string;
  status?: string;
}

// Generate a 60-second recording scenario
const generatePlaybackData = (): PlaybackFrame[] => {
  const frames: PlaybackFrame[] = [];
  const duration = 60000; // 60 seconds
  const interval = 100; // 100ms interval (10fps)

  // Initial positions
  const entities = {
    'W1': { x: 80, y: 20, type: 'waiter', label: 'W1' },
    'W2': { x: 20, y: 80, type: 'waiter', label: 'W2' },
    'M1': { x: 50, y: 50, type: 'manager', label: 'M1' },
    'C1': { x: 10, y: 10, type: 'customer', label: 'C1' },
    'C2': { x: 90, y: 90, type: 'customer', label: 'C2' }
  };

  // Waypoints for movement simulation
  const waypoints = {
    'W1': [{ x: 80, y: 20 }, { x: 50, y: 50 }, { x: 20, y: 80 }, { x: 80, y: 20 }],
    'W2': [{ x: 20, y: 80 }, { x: 50, y: 50 }, { x: 80, y: 20 }, { x: 20, y: 80 }],
    'M1': [{ x: 50, y: 50 }, { x: 50, y: 20 }, { x: 50, y: 80 }, { x: 50, y: 50 }],
    'C1': [{ x: 10, y: 10 }, { x: 30, y: 30 }, { x: 10, y: 50 }, { x: 10, y: 10 }],
    'C2': [{ x: 90, y: 90 }, { x: 70, y: 70 }, { x: 90, y: 50 }, { x: 90, y: 90 }]
  };

  for (let t = 0; t <= duration; t += interval) {
    const frameEntities: PlaybackEntity[] = [];

    Object.keys(entities).forEach(key => {
      const ent = entities[key as keyof typeof entities];
      const path = waypoints[key as keyof typeof waypoints];
      
      // Calculate position based on time (looping through waypoints)
      // Simple linear interpolation between waypoints
      const totalCycleTime = 20000; // 20 seconds per cycle
      const cycleProgress = (t % totalCycleTime) / totalCycleTime;
      const pathIndex = Math.floor(cycleProgress * path.length);
      const nextIndex = (pathIndex + 1) % path.length;
      const segmentProgress = (cycleProgress * path.length) % 1;

      const p1 = path[pathIndex];
      const p2 = path[nextIndex];

      const x = p1.x + (p2.x - p1.x) * segmentProgress;
      const y = p1.y + (p2.y - p1.y) * segmentProgress;

      frameEntities.push({
        id: key,
        type: ent.type as any,
        x,
        y,
        label: ent.label,
        status: 'active'
      });
    });

    frames.push({
      timestamp: t,
      entities: frameEntities
    });
  }

  return frames;
};

export const playbackData = generatePlaybackData();
