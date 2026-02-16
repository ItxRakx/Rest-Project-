import React, { useRef, useState, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, AlertCircle, Loader2, Maximize } from 'lucide-react';

interface DashboardVideoPlayerProps {
  src?: string;
  className?: string;
  videoClassName?: string;
  poster?: string;
  showControls?: boolean;
  autoPlay?: boolean;
  loop?: boolean;
  muted?: boolean;
  preload?: 'auto' | 'metadata' | 'none';
  objectFit?: 'contain' | 'cover' | 'fill' | 'none' | 'scale-down';
  onError?: (error: string) => void;
  // Sync props
  isPlaying?: boolean;
  currentTime?: number;
  onPlay?: () => void;
  onPause?: () => void;
  onSeek?: (time: number) => void;
  onDurationChange?: (duration: number) => void;
}

export const DashboardVideoPlayer: React.FC<DashboardVideoPlayerProps> = ({
  src,
  className = '',
  videoClassName = '',
  poster,
  showControls = true,
  autoPlay = false,
  loop = false,
  muted = false,
  preload = 'auto',
  objectFit = 'contain',
  onError,
  isPlaying: propsIsPlaying,
  currentTime: propsCurrentTime,
  onPlay,
  onPause,
  onSeek,
  onDurationChange
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);

  // Sync state with props
  useEffect(() => {
    if (typeof propsIsPlaying !== 'undefined') {
      setIsPlaying(propsIsPlaying);
    }
  }, [propsIsPlaying]);

  useEffect(() => {
    if (typeof propsCurrentTime !== 'undefined' && videoRef.current) {
      const diff = Math.abs(videoRef.current.currentTime - propsCurrentTime);
      if (diff > 0.5) {
        videoRef.current.currentTime = propsCurrentTime;
        setCurrentTime(propsCurrentTime);
      }
    }
  }, [propsCurrentTime]);
  const [isMuted, setIsMuted] = useState(muted);
  const [isLoading, setIsLoading] = useState(!autoPlay);
  const [error, setError] = useState<string | null>(null);
  const [isBuffering, setIsBuffering] = useState(false);
  const lastSrcRef = useRef(src);
  const loadingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.defaultMuted = muted;
    }
  }, []);

  // Performance Optimization: Pre-warm the video source with better state management
  useEffect(() => {
    const video = videoRef.current;
    if (video && src && src !== lastSrcRef.current) {
      const startTime = performance.now();
      console.log(`[VideoPlayer] Source switching from ${lastSrcRef.current} to: ${src}`);
      
      // Clear any existing timeout
      if (loadingTimeoutRef.current) {
        clearTimeout(loadingTimeoutRef.current);
      }

      // Stop previous video download to free up bandwidth
      video.pause();
      video.removeAttribute('src');
      video.load();
      
      lastSrcRef.current = src;
      // Don't show loading spinner if it's already pre-warming or auto-playing
      if (!autoPlay) {
        setIsLoading(true);
      }
      setIsBuffering(true);
      
      // Set a safety timeout to prevent infinite loading
      loadingTimeoutRef.current = setTimeout(() => {
        if (isLoading || isBuffering) {
          console.warn(`[VideoPlayer] Loading timeout for ${src} - forcing ready state`);
          setIsLoading(false);
          setIsBuffering(false);
        }
      }, 10000); // 10 second safety timeout
      
      // Re-assign src and load new video
      video.src = src;
      // Use faster loading strategy
      video.load();
      
      // Optimization: Try to play immediately if browser allows, instead of waiting for full canplay
      if (isPlaying || autoPlay) {
        const playPromise = video.play();
        if (playPromise !== undefined) {
          playPromise.catch(() => {
            // If immediate play fails, we fall back to the canplay listener
            console.log(`[VideoPlayer] Initial play prevented for ${src}, waiting for buffer...`);
          });
        }
      }
      
      const onCanPlay = () => {
        const duration = performance.now() - startTime;
        console.log(`[VideoPlayer] Ready to play ${src} (Loaded in ${duration.toFixed(2)}ms)`);
        
        if (loadingTimeoutRef.current) {
          clearTimeout(loadingTimeoutRef.current);
        }

        setIsLoading(false);
        setIsBuffering(false);
        
        if (isPlaying || autoPlay) {
          // Check if already playing from the immediate attempt above
          if (video.paused) {
            video.play().catch(e => {
              if (e.name !== 'AbortError') {
                console.warn('[VideoPlayer] Play failed after switch:', e);
              }
            });
          }
        }
      };

      video.addEventListener('canplay', onCanPlay, { once: true });
      return () => {
        video.removeEventListener('canplay', onCanPlay);
        if (loadingTimeoutRef.current) {
          clearTimeout(loadingTimeoutRef.current);
        }
      };
    }
  }, [src, isPlaying, autoPlay]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => {
      setCurrentTime(video.currentTime);
      // Only trigger seek if the difference is significant to avoid loops
      // We don't bubble up every time update, usually handled by parent context if driven by it
    };
    const handleLoadedMetadata = () => {
      setDuration(video.duration);
      if (onDurationChange) onDurationChange(video.duration);
      setIsLoading(false);
    };
    const handleEnded = () => {
      setIsPlaying(false);
      if (onPause) onPause();
    };
    const handleError = () => {
      let errMessage = 'Error loading video';
      if (video.error) {
        switch (video.error.code) {
          case MediaError.MEDIA_ERR_ABORTED:
            errMessage = 'The video playback was aborted.';
            break;
          case MediaError.MEDIA_ERR_NETWORK:
            errMessage = 'A network error caused the video download to fail.';
            break;
          case MediaError.MEDIA_ERR_DECODE:
            errMessage = 'The video playback was aborted due to a corruption problem or because the video used features your browser did not support.';
            break;
          case MediaError.MEDIA_ERR_SRC_NOT_SUPPORTED:
            errMessage = 'The video could not be loaded, either because the server or network failed or because the format is not supported.';
            break;
          default:
            errMessage = video.error.message || 'An unknown error occurred.';
            break;
        }
      }
      console.error('Video Error:', video.error, errMessage);
      setError(errMessage);
      setIsLoading(false);
      if (onError) onError(errMessage);
    };
    const handleWaiting = () => setIsLoading(true);
    const handleCanPlay = () => setIsLoading(false);
    const handleStalled = () => {
      console.warn('Video stalled, attempting to recover...');
      if (videoRef.current && isPlaying) {
        videoRef.current.load();
        videoRef.current.play().catch(e => console.warn('Recovery play failed:', e));
      }
    };

    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('loadedmetadata', handleLoadedMetadata);
    video.addEventListener('ended', handleEnded);
    video.addEventListener('error', handleError);
    video.addEventListener('waiting', handleWaiting);
    video.addEventListener('canplay', handleCanPlay);
    video.addEventListener('stalled', handleStalled);

    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      video.removeEventListener('ended', handleEnded);
      video.removeEventListener('error', handleError);
      video.removeEventListener('waiting', handleWaiting);
      video.removeEventListener('canplay', handleCanPlay);
      video.removeEventListener('stalled', handleStalled);
    };
  }, [onError, isPlaying]);

  useEffect(() => {
    if (videoRef.current && !isLoading && !isBuffering) {
      if (isPlaying) {
        videoRef.current.play().catch(e => {
          if (e.name !== 'AbortError') {
            console.warn('[VideoPlayer] Playback failed:', e);
            setIsPlaying(false);
          }
        });
      } else {
        videoRef.current.pause();
      }
    }
  }, [isPlaying, isLoading, isBuffering]);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.volume = volume;
      videoRef.current.muted = isMuted;
    }
  }, [volume, isMuted]);

  const togglePlay = () => {
    const newIsPlaying = !isPlaying;
    setIsPlaying(newIsPlaying);
    if (newIsPlaying && onPlay) onPlay();
    if (!newIsPlaying && onPause) onPause();
  };
  
  const toggleMute = () => setIsMuted(!isMuted);

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    if (videoRef.current) {
      videoRef.current.currentTime = time;
      setCurrentTime(time);
      if (onSeek) onSeek(time);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const vol = parseFloat(e.target.value);
    setVolume(vol);
    if (vol > 0 && isMuted) setIsMuted(false);
    if (vol === 0) setIsMuted(true);
  };

  const toggleFullscreen = () => {
    if (videoRef.current) {
      if (!document.fullscreenElement) {
        videoRef.current.parentElement?.requestFullscreen().catch(err => {
          console.error(`Error attempting to enable fullscreen: ${err.message} (${err.name})`);
        });
      } else {
        document.exitFullscreen();
      }
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className={`relative bg-black rounded-lg overflow-hidden group ${className}`}>
      {error ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-900 text-gray-400 p-4 text-center">
          <AlertCircle className="w-12 h-12 mb-2 text-red-500" />
          <p className="font-medium text-white">Video Unavailable</p>
          <p className="text-sm mt-1">{error}</p>
        </div>
      ) : (
        <>
          <video
            ref={videoRef}
            src={src}
            poster={poster}
            className={`w-full h-full object-${objectFit} ${videoClassName}`}
            playsInline
            loop={loop}
            muted={muted}
            autoPlay={autoPlay}
            preload={preload}
            aria-label="Video Player"
          />

          {(isLoading || isBuffering) && !autoPlay && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/20 pointer-events-none">
              <Loader2 className="w-10 h-10 text-white animate-spin" />
            </div>
          )}

          {/* Custom Controls Overlay */}
          {showControls && (
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 transition-opacity duration-300 opacity-0 group-hover:opacity-100 focus-within:opacity-100">
              <div className="flex flex-col gap-2">
                {/* Progress Bar */}
                <input
                  type="range"
                  min="0"
                  max={duration || 100}
                  value={currentTime}
                  onChange={handleSeek}
                  className="w-full h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-blue-500 [&::-webkit-slider-thumb]:rounded-full hover:[&::-webkit-slider-thumb]:bg-blue-400"
                  aria-label="Seek"
                />

                <div className="flex items-center justify-between text-white">
                  <div className="flex items-center gap-4">
                    <button
                      onClick={togglePlay}
                      className="p-1 hover:text-blue-400 transition-colors"
                      aria-label={isPlaying ? "Pause" : "Play"}
                    >
                      {isPlaying ? <Pause size={20} /> : <Play size={20} />}
                    </button>

                    <div className="flex items-center gap-2 group/vol">
                      <button
                        onClick={toggleMute}
                        className="p-1 hover:text-blue-400 transition-colors"
                        aria-label={isMuted ? "Unmute" : "Mute"}
                      >
                        {isMuted || volume === 0 ? <VolumeX size={20} /> : <Volume2 size={20} />}
                      </button>
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.1"
                        value={isMuted ? 0 : volume}
                        onChange={handleVolumeChange}
                        className="w-20 h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:rounded-full hover:[&::-webkit-slider-thumb]:bg-gray-200"
                        aria-label="Volume"
                      />
                    </div>

                    <span className="text-xs font-mono text-gray-300">
                      {formatTime(currentTime)} / {formatTime(duration)}
                    </span>
                  </div>
                  
                  <button 
                    onClick={toggleFullscreen}
                    className="p-1 hover:text-blue-400 transition-colors"
                    aria-label="Fullscreen"
                  >
                    <Maximize size={20} />
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};
