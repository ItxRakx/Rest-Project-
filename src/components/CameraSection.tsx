import React, { useEffect, useState } from 'react';
import { Camera, ChevronDown, ChevronRight } from 'lucide-react';
import { DashboardVideoPlayer } from './DashboardVideoPlayer';
import { usePlayback } from '../contexts/PlaybackContext';

export const CameraSection: React.FC = () => {
  const { 
    isPlaying, 
    currentTime, 
    play, 
    pause, 
    seek, 
    setPlaybackView,
  } = usePlayback();

  const [isCameraGridExpanded, setIsCameraGridExpanded] = useState(false);
  const [isMainVideoExpanded, setIsMainVideoExpanded] = useState(true);
  const [selectedCameraSrc, setSelectedCameraSrc] = useState('https://media.w3.org/2010/05/sintel/trailer.mp4');

  const cameras = [
    { id: 1, src: '/cam-01.mp4' },
    { id: 2, src: '/cam-02.mp4' },
    { id: 3, src: '/cam-03.mp4' },
    { id: 4, src: '/cam-04.mp4' },
    { id: 5, src: '/cam-05.mp4' },
    { id: 6, src: '/cam-06.mp4' },
  ];

  useEffect(() => {
    // Set initial camera source to the first one if available
    if (cameras.length > 0 && selectedCameraSrc === 'https://media.w3.org/2010/05/sintel/trailer.mp4') {
      setSelectedCameraSrc(cameras[0].src);
    }
  }, []);

  // Set playback view to true when this component mounts
  useEffect(() => {
    setPlaybackView(true);
  }, [setPlaybackView]);

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden flex flex-col h-full">
      {/* Header matching FloorPlan for alignment */}
      <button 
        onClick={() => setIsMainVideoExpanded(!isMainVideoExpanded)}
        className="w-full px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white flex items-center justify-between flex-shrink-0 hover:bg-gray-50 transition-colors focus:outline-none group"
      >
        <div className="text-left">
          <h2 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">Surveillance</h2>
          <p className="text-sm text-gray-600 mt-1">Main Camera Feed</p>
        </div>
        {isMainVideoExpanded ? <ChevronDown className="text-gray-500 group-hover:text-blue-600" /> : <ChevronRight className="text-gray-500 group-hover:text-blue-600" />}
      </button>

      <div className="flex-1 flex flex-col bg-gray-50 overflow-hidden min-h-0">
        <div className={`w-full bg-black relative flex-shrink-0 transition-all duration-300 ease-in-out overflow-hidden ${isMainVideoExpanded ? 'h-[60vh] opacity-100' : 'h-0 opacity-0'}`}>
          <DashboardVideoPlayer 
            src={selectedCameraSrc}
            showControls={true}
            className="w-full h-full object-cover"
            isPlaying={isPlaying}
            currentTime={currentTime / 1000} // Convert ms to s
            onPlay={play}
            onPause={pause}
            onSeek={(t) => seek(t * 1000)} // Convert s to ms
          />
        </div>
        
        {/* Live Camera Feeds - Repositioned below video player */}
        <div className="p-4 flex-shrink-0 overflow-y-auto">
           <button 
             onClick={() => setIsCameraGridExpanded(!isCameraGridExpanded)}
             className="w-full flex items-center justify-between text-sm font-semibold text-gray-700 mb-3 hover:text-blue-600 transition-colors focus:outline-none"
           >
             <div className="flex items-center gap-2">
               {isCameraGridExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
               <div className="flex items-center gap-2">
                   <Camera size={16} />
                   Live Camera Feeds
                 </div>
             </div>
             <span className="text-xs font-normal text-gray-500">
               {isCameraGridExpanded ? 'Collapse' : 'Expand'}
             </span>
           </button>
           
           <div className={`grid grid-cols-3 gap-3 transition-all duration-300 ease-in-out overflow-hidden ${isCameraGridExpanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
             {cameras.map((cam, i) => (
               <div 
                 key={cam.id} 
                 onClick={() => setSelectedCameraSrc(cam.src)}
                 className={`aspect-video bg-gray-900 rounded-lg flex items-center justify-center relative overflow-hidden group border shadow-sm cursor-pointer transition-all ${
                   selectedCameraSrc === cam.src ? 'border-blue-500 ring-2 ring-blue-500/20' : 'border-gray-700 hover:border-gray-500'
                 }`}
               >
                 <DashboardVideoPlayer 
                   src={cam.src}
                   showControls={false}
                   autoPlay={true}
                   loop={true}
                   muted={true}
                   preload="metadata"
                   objectFit="cover"
                   className={`w-full h-full transition-opacity ${
                     selectedCameraSrc === cam.src ? 'opacity-100' : 'opacity-60 group-hover:opacity-100'
                   }`}
                 />
                 <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-[2px] px-1.5 py-0.5 rounded text-[10px] text-white font-mono border border-white/10 z-10">
                   CAM-{String(cam.id).padStart(2, '0')}
                 </div>
                 <div className="absolute bottom-2 right-2 w-2 h-2 rounded-full bg-green-500 animate-pulse z-10"></div>
               </div>
             ))}
           </div>
        </div>
      </div>
    </div>
  );
};