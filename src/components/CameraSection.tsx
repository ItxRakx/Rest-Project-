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
    setDuration,
  } = usePlayback();

  const [isCameraGridExpanded, setIsCameraGridExpanded] = useState(false);
  const [isMainVideoExpanded, setIsMainVideoExpanded] = useState(true);
  const [videoError, setVideoError] = useState<string | null>(null);
  const [selectedCameraSrc, setSelectedCameraSrc] = useState('/final video.mp4');

  // Define the 6 camera feed sources
  const cameraFeeds = [
    { id: 1, name: 'CAM-01', src: '/cam-01.mp4' },
    { id: 2, name: 'CAM-02', src: '/cam-02.mp4' },
    { id: 3, name: 'CAM-03', src: '/cam-03.mp4' },
    { id: 4, name: 'CAM-04', src: '/cam-04.mp4' },
    { id: 5, name: 'CAM-05', src: '/cam-05.mp4' },
    { id: 6, name: 'CAM-06', src: '/cam-06.mp4' },
  ];

  // Set playback view to true when this component mounts
  useEffect(() => {
    setPlaybackView(true);
  }, [setPlaybackView]);

  const handleVideoError = (error: string) => {
    console.error('Surveillance Video Error:', error);
    setVideoError(error);
  };

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
            className="w-full h-full"
            objectFit="cover"
            isPlaying={isPlaying}
            currentTime={currentTime / 1000} // Convert ms to s
            onPlay={play}
            onPause={pause}
            onSeek={(t) => seek(t * 1000)} // Convert s to ms
            onDurationChange={(d) => setDuration(d * 1000)} // Update global duration
            onError={handleVideoError}
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
           
           <div className={`grid grid-cols-3 gap-3 transition-all duration-300 ease-in-out overflow-hidden ${isCameraGridExpanded ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}>
             {cameraFeeds.map((cam) => (
               <div 
                 key={cam.id} 
                 onClick={() => setSelectedCameraSrc(cam.src)}
                 className={`aspect-video bg-gray-900 rounded-lg flex items-center justify-center relative overflow-hidden group border transition-all duration-200 cursor-pointer shadow-sm ${
                   selectedCameraSrc === cam.src 
                   ? 'border-blue-500 ring-2 ring-blue-500/20' 
                   : 'border-gray-700 hover:border-gray-500'
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
                   {cam.name}
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