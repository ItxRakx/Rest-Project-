
import React, { useRef, useEffect } from 'react';
import { Play, Pause, FastForward, Rewind } from 'lucide-react';
import { usePlayback } from '../contexts/PlaybackContext';

export const VideoPlayer: React.FC = () => {
  const { 
    isPlaying, 
    currentTime, 
    duration, 
    play, 
    pause, 
    seek, 
    playbackSpeed, 
    setSpeed 
  } = usePlayback();

  const videoRef = useRef<HTMLVideoElement>(null);

  // Sync video element with context time
  useEffect(() => {
    if (videoRef.current) {
      if (Math.abs(videoRef.current.currentTime * 1000 - currentTime) > 200) {
        videoRef.current.currentTime = currentTime / 1000;
      }
      if (isPlaying && videoRef.current.paused) {
        videoRef.current.play().catch(e => console.log('Video play interrupted', e));
      } else if (!isPlaying && !videoRef.current.paused) {
        videoRef.current.pause();
      }
      videoRef.current.playbackRate = playbackSpeed;
    }
  }, [currentTime, isPlaying, playbackSpeed]);

  const formatTime = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    const millis = Math.floor((ms % 1000) / 10);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}:${millis.toString().padStart(2, '0')}`;
  };

  const handleTimelineClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = x / rect.width;
    seek(percentage * duration);
  };

  return (
    <div className="bg-black rounded-lg overflow-hidden shadow-lg border border-gray-800 flex flex-col h-full">
      {/* Video Area */}
      <div className="relative flex-1 bg-gray-900 flex items-center justify-center group">
        <video
          ref={videoRef}
          className="w-full h-full object-contain"
          src="https://media.w3.org/2010/05/sintel/trailer.mp4" // Placeholder video
          muted // Muted for autoplay policy
          loop
          playsInline
        />
        
        {/* Overlay Timestamp */}
        <div className="absolute top-4 right-4 bg-black/70 px-3 py-1 rounded font-mono text-green-500 text-lg border border-green-500/30">
          {formatTime(currentTime)}
        </div>
      </div>

      {/* Controls */}
      <div className="bg-gray-900 p-4 border-t border-gray-800">
        {/* Progress Bar */}
        <div 
          className="w-full h-2 bg-gray-700 rounded-full mb-4 cursor-pointer relative group"
          onClick={handleTimelineClick}
        >
          <div 
            className="absolute h-full bg-blue-500 rounded-full transition-all duration-100"
            style={{ width: `${(currentTime / duration) * 100}%` }}
          />
          <div 
            className="absolute h-4 w-4 bg-white rounded-full top-1/2 transform -translate-y-1/2 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
            style={{ left: `${(currentTime / duration) * 100}%`, marginLeft: '-8px' }}
          />
        </div>

        <div className="flex items-center justify-between text-gray-300">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => isPlaying ? pause() : play()}
              className="p-2 rounded-full bg-blue-600 hover:bg-blue-700 text-white transition-colors"
            >
              {isPlaying ? <Pause size={20} /> : <Play size={20} />}
            </button>
            
            <div className="flex items-center gap-2">
              <button onClick={() => seek(currentTime - 5000)} className="p-1.5 hover:bg-gray-800 rounded">
                <Rewind size={18} />
              </button>
              <button onClick={() => seek(currentTime + 5000)} className="p-1.5 hover:bg-gray-800 rounded">
                <FastForward size={18} />
              </button>
            </div>
          </div>

          <div className="flex items-center gap-4 text-sm font-medium">
            <span className="font-mono">{formatTime(currentTime)} / {formatTime(duration)}</span>
            
            <div className="flex items-center gap-2 bg-gray-800 rounded px-2 py-1">
              <button 
                onClick={() => setSpeed(Math.max(0.5, playbackSpeed - 0.5))}
                className="hover:text-white"
              >
                -
              </button>
              <span className="w-12 text-center">{playbackSpeed}x</span>
              <button 
                onClick={() => setSpeed(Math.min(4, playbackSpeed + 0.5))}
                className="hover:text-white"
              >
                +
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
