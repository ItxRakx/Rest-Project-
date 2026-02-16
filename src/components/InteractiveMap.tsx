import React, { useState, useRef, useEffect } from 'react';
import { Camera, X, Move, Video, User, Settings } from 'lucide-react';
import { useRestaurant } from '../contexts/RestaurantContext';
import { Camera as CameraType, SpatialObject } from '../types';
import { CalibrationModal } from './CalibrationModal';

interface DraggableWindowProps {
  camera: CameraType;
  spatialData: SpatialObject[];
  onClose: () => void;
}

const DraggableVideoWindow: React.FC<DraggableWindowProps> = ({ camera, spatialData, onClose }) => {
  const [position, setPosition] = useState({ x: 50, y: 50 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef({ x: 0, y: 0 });

  // Filter objects within this camera's view
  const detectedObjects = spatialData.filter(obj => {
      if (!camera.zoneBounds) return false;
      const { x, y, width, height } = camera.zoneBounds;
      return obj.x >= x && obj.x <= x + width && obj.y >= y && obj.y <= y + height;
  });

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    dragStart.current = {
      x: e.clientX - position.x,
      y: e.clientY - position.y
    };
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        setPosition({
          x: e.clientX - dragStart.current.x,
          y: e.clientY - dragStart.current.y
        });
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging]);

  return (
    <div
      style={{ left: position.x, top: position.y }}
      className="fixed z-50 w-80 bg-black rounded-lg shadow-2xl overflow-hidden border border-gray-700"
    >
      <div
        onMouseDown={handleMouseDown}
        className="bg-gray-800 px-3 py-2 flex items-center justify-between cursor-move select-none"
      >
        <div className="flex items-center gap-2 text-white text-sm font-medium">
          <Camera size={14} />
          {camera.name}
        </div>
        <button onClick={onClose} className="text-gray-400 hover:text-white">
          <X size={14} />
        </button>
      </div>
      <div className="aspect-video bg-gray-900 relative overflow-hidden group">
        {/* Simulated Feed Background */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-gray-700 via-gray-900 to-black opacity-80" />
        <div className="absolute inset-0 grid grid-cols-6 grid-rows-4 opacity-10">
            {Array.from({ length: 24 }).map((_, i) => (
                <div key={i} className="border border-gray-500"></div>
            ))}
        </div>

        {/* Simulated Object Overlays (Bounding Boxes) */}
        {detectedObjects.map(obj => {
             // Map global coordinates to local camera view (simple projection)
             // This is a rough simulation for demo purposes
             // Inverting Y for standard camera view often helps realism, but let's keep it simple
             const camX = camera.zoneBounds ? ((obj.x - camera.zoneBounds.x) / camera.zoneBounds.width) * 100 : 50;
             const camY = camera.zoneBounds ? ((obj.y - camera.zoneBounds.y) / camera.zoneBounds.height) * 100 : 50;
             
             return (
                 <div key={obj.id} className="absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-300 ease-linear"
                      style={{ left: `${camX}%`, top: `${camY}%` }}>
                     <div className="border border-green-500 w-8 h-16 bg-green-500/10 flex flex-col items-center justify-start relative">
                         <div className="absolute -top-4 left-0 bg-green-500 text-black text-[8px] font-bold px-1 whitespace-nowrap">
                             {obj.label || `ID:${obj.id}`}
                         </div>
                         <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-green-500" />
                         <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-green-500" />
                     </div>
                 </div>
             );
        })}

        <div className="absolute top-2 left-2 flex items-center gap-1.5 px-2 py-1 bg-black/50 rounded text-[10px] text-white">
            <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
            REC (DEMO)
        </div>
        <div className="absolute bottom-2 left-2 text-[10px] text-gray-500 font-mono">
            {camera.id} | FPS: 24
        </div>
        <div className="absolute bottom-2 right-2 text-[10px] text-green-500 font-mono">
            {detectedObjects.length > 0 ? `DETECTED: ${detectedObjects.length}` : 'SCANNING...'}
        </div>
      </div>
    </div>
  );
};

interface InteractiveMapProps {
  overrideSpatialData?: SpatialObject[];
}

export const InteractiveMap: React.FC<InteractiveMapProps> = ({ overrideSpatialData }) => {
  const { spatialData: contextSpatialData, cameras, selectedWaiter, tables } = useRestaurant();
  const spatialData = overrideSpatialData || contextSpatialData;
  const [selectedCamera, setSelectedCamera] = useState<CameraType | null>(null);

  // Filter only cameras that have coordinates
  const activeCameras = cameras.filter(c => c.x !== undefined && c.y !== undefined);

  return (
    <div className="relative w-full h-[600px] bg-white overflow-hidden border rounded-lg shadow-inner">
      {/* Floor Plan SVG */}
      <svg
        viewBox="0 0 100 100"
        className="w-full h-full absolute inset-0 pointer-events-none select-none"
      >
        {/* Background Grid (Hidden CV Layer) */}
        <defs>
            <pattern id="cv-grid" width="10" height="10" patternUnits="userSpaceOnUse">
                <path d="M 10 0 L 0 0 0 10" fill="none" stroke="rgba(0,0,0,0.03)" strokeWidth="0.5"/>
            </pattern>
        </defs>
        <rect width="100" height="100" fill="#f8fafc" />
        <rect width="100" height="100" fill="url(#cv-grid)" />

        {/* Zones (Visible when camera selected or debug) */}
        {activeCameras.map(cam => cam.zoneBounds && (
           <rect
             key={`zone-${cam.id}`}
             x={cam.zoneBounds.x} 
             y={cam.zoneBounds.y} 
             width={cam.zoneBounds.width} 
             height={cam.zoneBounds.height} 
             fill={selectedCamera?.id === cam.id ? "rgba(59, 130, 246, 0.05)" : "none"} 
             stroke={selectedCamera?.id === cam.id ? "#3b82f6" : "rgba(0,0,0,0.05)"} 
             strokeWidth="0.5"
             strokeDasharray="2 2"
           />
        ))}

        {/* Walls */}
        <path d="M 5 5 L 95 5 L 95 95 L 5 95 Z" fill="none" stroke="#334155" strokeWidth="2" />
        <path d="M 40 5 L 40 25" stroke="#334155" strokeWidth="2" /> {/* Partition 1 */}
        <path d="M 60 5 L 60 25" stroke="#334155" strokeWidth="2" /> {/* Partition 2 */}
        <path d="M 95 40 L 80 40" stroke="#334155" strokeWidth="2" /> {/* Kitchen Wall */}
        
        {/* Tables (Visual Representation) */}
        {tables.map(table => {
            const isAssigned = selectedWaiter?.assignedTables.includes(table.id);
            // In a real app, table objects would have x/y coordinates
            // Use table.x / table.y from mockData if available, else fallback to grid logic
            const tx = table.x || (30 + ((table.id - 1) % 3) * 20);
            const ty = table.y || (30 + (Math.floor((table.id - 1) / 3)) * 20);
            
            return (
                <g key={table.id}>
                    {isAssigned && (
                        <circle cx={tx} cy={ty} r="6" fill="rgba(59, 130, 246, 0.3)" className="animate-pulse" />
                    )}
                    <rect x={tx-3} y={ty-3} width="6" height="6" rx="1" fill="#e2e8f0" stroke={isAssigned ? "#3b82f6" : "#94a3b8"} strokeWidth={isAssigned ? 1.5 : 1} />
                    <circle cx={tx-4} cy={ty} r="1.5" fill="#cbd5e1" />
                    <circle cx={tx+4} cy={ty} r="1.5" fill="#cbd5e1" />
                    <circle cx={tx} cy={ty-4} r="1.5" fill="#cbd5e1" />
                    <circle cx={tx} cy={ty+4} r="1.5" fill="#cbd5e1" />
                </g>
            );
        })}

        {/* FOV Cones */}
        {activeCameras.map((cam) => {
           if (!cam.fov) return null;
           // Simple cone approximation
           const angleRad = (cam.fov.direction * Math.PI) / 180;
           const coneWidth = (cam.fov.angle * Math.PI) / 180; // approximate
           const endX1 = cam.x + Math.cos(angleRad - coneWidth/2) * cam.fov.range;
           const endY1 = cam.y + Math.sin(angleRad - coneWidth/2) * cam.fov.range;
           const endX2 = cam.x + Math.cos(angleRad + coneWidth/2) * cam.fov.range;
           const endY2 = cam.y + Math.sin(angleRad + coneWidth/2) * cam.fov.range;

           return (
             <path
               key={`fov-${cam.id}`}
               d={`M ${cam.x} ${cam.y} L ${endX1} ${endY1} A ${cam.fov.range} ${cam.fov.range} 0 0 1 ${endX2} ${endY2} Z`}
               fill={selectedCamera?.id === cam.id ? "rgba(59, 130, 246, 0.2)" : "rgba(59, 130, 246, 0.05)"}
               stroke="none"
             />
           );
        })}

        {/* CV Spatial Data (Moving Dots) */}
        {spatialData && spatialData.map((obj) => {
            let fillColor = '#ef4444'; // default red
            if (obj.type === 'waiter' || (obj.label && obj.label.startsWith('W'))) fillColor = '#3b82f6'; // blue
            else if (obj.type === 'manager' || (obj.label && obj.label.startsWith('M'))) fillColor = '#9333ea'; // purple
            else if (obj.type === 'customer' || (obj.label && obj.label.startsWith('C'))) fillColor = '#f97316'; // orange
            
            return (
            <g key={obj.id} className="transition-all duration-300 ease-linear" transform={`translate(${obj.x}, ${obj.y})`}>
                <circle
                    r="2"
                    fill={fillColor}
                />
                <text y="-3" fontSize="3" textAnchor="middle" fill="#4b5563" fontWeight="bold">
                    {obj.label || obj.id}
                </text>
                {/* Highlight ring if detected by selected camera */}
                {selectedCamera?.zoneBounds && 
                 obj.x >= selectedCamera.zoneBounds.x && 
                 obj.x <= selectedCamera.zoneBounds.x + selectedCamera.zoneBounds.width &&
                 obj.y >= selectedCamera.zoneBounds.y &&
                 obj.y <= selectedCamera.zoneBounds.y + selectedCamera.zoneBounds.height && (
                    <circle r="4" fill="none" stroke="#22c55e" strokeWidth="0.5" className="animate-ping" />
                )}
            </g>
            );
        })}
      </svg>

      {/* Interactive Elements Layer */}
      <div className="absolute inset-0 pointer-events-none">
        {activeCameras.map((cam) => (
            <button
                key={cam.id}
                onClick={() => setSelectedCamera(cam)}
                className={`absolute transform -translate-x-1/2 -translate-y-1/2 p-1.5 rounded-full shadow transition-transform z-10 pointer-events-auto ${selectedCamera?.id === cam.id ? 'bg-blue-600 text-white scale-110' : 'bg-white text-gray-700 hover:scale-110'}`}
                style={{ left: `${cam.x}%`, top: `${cam.y}%` }}
            >
                <Camera size={16} />
            </button>
        ))}
      </div>

      {selectedCamera && (
        <DraggableVideoWindow
            camera={selectedCamera}
            spatialData={spatialData}
            onClose={() => setSelectedCamera(null)}
        />
      )}
      
      {/* Legend / Status */}
      <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur px-3 py-2 rounded-lg border border-gray-200 text-xs shadow-sm">
          <div className="font-semibold text-gray-800 mb-1">Synchronization Status</div>
          <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
              <span className="text-gray-600">CV Tracking Active (Demo)</span>
          </div>
          <div className="text-[10px] text-gray-400 mt-1">
              Objects: {spatialData.length} | Latency: 12ms
          </div>
      </div>
    </div>
  );
};
