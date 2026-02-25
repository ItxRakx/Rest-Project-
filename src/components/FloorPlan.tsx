import React, { useState, useEffect } from 'react';
import { useRestaurant } from '../contexts/RestaurantContext';
import { usePlayback } from '../contexts/PlaybackContext';
import { Maximize2, Minimize2, Grid, Map } from 'lucide-react';
import { OperationalGrid } from './OperationalGrid';
import { DashboardVideoPlayer } from './DashboardVideoPlayer';

export const FloorPlan: React.FC = () => {
  const { tables } = useRestaurant();
  const { isPlaybackView, isPlaying, currentTime } = usePlayback();
  
  const [isMinimized, setIsMinimized] = useState(() => {
    const saved = localStorage.getItem('floorPlanMinimized');
    return saved ? JSON.parse(saved) : false;
  });

  const [activeView, setActiveView] = useState<'grid' | 'map'>('grid');

  // Auto-switch to map view if playback mode is active
  useEffect(() => {
    if (isPlaybackView) {
      setActiveView('map');
    }
  }, [isPlaybackView]);

  useEffect(() => {
    localStorage.setItem('floorPlanMinimized', JSON.stringify(isMinimized));
  }, [isMinimized]);

  // Calculate stats for summary view
  const stats = {
    available: tables.filter(t => t.status === 'available').length,
    occupied: tables.filter(t => t.status === 'occupied').length,
    active: tables.filter(t => t.status === 'in-progress').length, // status is 'in-progress' not 'active'
    delayed: tables.filter(t => t.status === 'delayed').length,
  };

  return (
    <div className={`bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden transition-all duration-300 ${isMinimized ? 'h-auto' : 'h-full flex flex-col'}`}>
      <div className="px-4 py-3 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white flex items-center gap-4 flex-shrink-0">
        <div className="flex items-center gap-6">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Ground Floor</h2>
            <p className="text-sm text-gray-600 mt-0.5">
              {tables.length} Tables {isMinimized ? '• Summary View' : (activeView === 'grid' ? '• Operational Grid' : '')}
            </p>
          </div>
          
          <div className="flex gap-4 text-xs items-center">
             {!isMinimized && (
                 <div className="flex bg-gray-100 p-1 rounded-lg mr-4">
                     <button
                        onClick={() => setActiveView('grid')}
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-md transition-all ${
                            activeView === 'grid' 
                            ? 'bg-white text-blue-600 shadow-sm font-medium' 
                            : 'text-gray-500 hover:text-gray-700'
                        }`}
                     >
                        <Grid size={14} />
                        Grid
                     </button>
                     <button
                        onClick={() => setActiveView('map')}
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-md transition-all ${
                            activeView === 'map' 
                            ? 'bg-white text-blue-600 shadow-sm font-medium' 
                            : 'text-gray-500 hover:text-gray-700'
                        }`}
                     >
                        <Map size={14} />
                        Map
                     </button>
                 </div>
             )}

            {isMinimized ? (
               // Summary stats when minimized
               <div className="flex gap-4">
                 <div className="flex flex-col items-center">
                   <div className="w-3 h-3 rounded-full bg-green-500 mb-1"></div>
                   <span className="font-bold text-gray-700">{stats.available}</span>
                 </div>
                 <div className="flex flex-col items-center">
                   <div className="w-3 h-3 rounded-full bg-yellow-500 mb-1"></div>
                   <span className="font-bold text-gray-700">{stats.occupied}</span>
                 </div>
                 <div className="flex flex-col items-center">
                   <div className="w-3 h-3 rounded-full bg-blue-500 mb-1"></div>
                   <span className="font-bold text-gray-700">{stats.active}</span>
                 </div>
                 <div className="flex flex-col items-center">
                   <div className="w-3 h-3 rounded-full bg-red-500 mb-1"></div>
                   <span className="font-bold text-gray-700">{stats.delayed}</span>
                 </div>
               </div>
            ) : (
              // Legend when expanded
              <>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  <span className="text-gray-600">Available</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <span className="text-gray-600">Occupied</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                  <span className="text-gray-600">In Progress</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <span className="text-gray-600">Delayed</span>
                </div>
              </>
            )}
          </div>
        </div>
        
        <button
          onClick={() => setIsMinimized(!isMinimized)}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500 hover:text-blue-600"
          title={isMinimized ? "Expand Floor Plan" : "Minimize Floor Plan"}
        >
          {isMinimized ? <Maximize2 size={20} /> : <Minimize2 size={20} />}
        </button>
      </div>

      <div className={`transition-all duration-300 ease-in-out overflow-hidden ${isMinimized ? 'h-0 opacity-0' : 'flex-1 min-h-0 opacity-100'}`}>
         {activeView === 'grid' ? (
           <div className="h-full overflow-auto">
             <OperationalGrid />
           </div>
         ) : (
            <div className="h-[60vh] w-full bg-gray-100 relative flex-shrink-0">
               <DashboardVideoPlayer 
                  src="/simulation video mp4.mp4"
                  showControls={false}
                  autoPlay={true}
                  loop={true}
                  muted={true}
                  objectFit="cover"
                  className="w-full h-full"
                  isPlaying={isPlaying}
                  currentTime={currentTime / 1000}
               />
               <div className="absolute top-4 left-4 bg-white/80 backdrop-blur px-3 py-1 rounded text-xs font-semibold text-gray-700 pointer-events-none">
                  Floor Plan Feed
               </div>
            </div>
          )}
      </div>
    </div>
  );
};
