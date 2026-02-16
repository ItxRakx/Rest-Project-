
import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import { playbackData, PlaybackFrame } from '../data/playbackData';

interface PlaybackContextType {
  isPlaybackView: boolean;
  setPlaybackView: (isView: boolean) => void;
  isPlaying: boolean;
  currentTime: number; // ms
  duration: number; // ms
  playbackSpeed: number;
  play: () => void;
  pause: () => void;
  seek: (time: number) => void;
  setSpeed: (speed: number) => void;
  setDuration: (duration: number) => void;
  currentFrame: PlaybackFrame | null;
}

const PlaybackContext = createContext<PlaybackContextType | undefined>(undefined);

export const PlaybackProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isPlaybackView, setPlaybackView] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [duration, setDuration] = useState(60000); // Default 60 seconds, will be updated by players
  const animationFrameRef = useRef<number>();
  const lastTimeRef = useRef<number>(0);

  const frameIndex = Math.floor(currentTime / 100);
  const currentFrame = playbackData[frameIndex] || playbackData[playbackData.length - 1] || playbackData[0];

  const updateLoop = useCallback((timestamp: number) => {
    if (!lastTimeRef.current) lastTimeRef.current = timestamp;
    const delta = timestamp - lastTimeRef.current;

    if (isPlaying) {
      setCurrentTime(prev => {
        const nextTime = prev + delta * playbackSpeed;
        if (nextTime >= duration) {
          return 0; // Loop back to start instead of pausing
        }
        return nextTime;
      });
    }

    lastTimeRef.current = timestamp;
    animationFrameRef.current = requestAnimationFrame(updateLoop);
  }, [isPlaying, playbackSpeed, duration]);

  useEffect(() => {
    if (isPlaying) {
      lastTimeRef.current = 0;
      animationFrameRef.current = requestAnimationFrame(updateLoop);
    } else {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    }
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isPlaying, updateLoop]);

  const play = () => setIsPlaying(true);
  const pause = () => setIsPlaying(false);
  const seek = (time: number) => {
    setCurrentTime(Math.min(Math.max(0, time), duration));
  };
  const setSpeed = (speed: number) => setPlaybackSpeed(speed);

  return (
    <PlaybackContext.Provider value={{
      isPlaybackView,
      setPlaybackView,
      isPlaying,
      currentTime,
      duration,
      playbackSpeed,
      play,
      pause,
      seek,
      setSpeed,
      setDuration,
      currentFrame
    }}>
      {children}
    </PlaybackContext.Provider>
  );
};

export const usePlayback = () => {
  const context = useContext(PlaybackContext);
  if (context === undefined) {
    throw new Error('usePlayback must be used within a PlaybackProvider');
  }
  return context;
};
