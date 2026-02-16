import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { CameraSection } from '../CameraSection';

// Mock contexts
const mockUsePlayback = vi.fn();
vi.mock('../../contexts/PlaybackContext', () => ({
  usePlayback: () => mockUsePlayback(),
}));

// Mock DashboardVideoPlayer
vi.mock('../DashboardVideoPlayer', () => ({
  DashboardVideoPlayer: ({ src, className, onError, showControls }: any) => (
    <div 
      data-testid="video-player" 
      data-src={src} 
      className={className}
      data-controls={showControls ? "true" : "false"}
    >
      <button onClick={() => onError && onError("Test Error")}>Trigger Error</button>
    </div>
  )
}));

describe('CameraSection Video Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    
    // Default mock implementation
    mockUsePlayback.mockReturnValue({
      isPlaying: false,
      currentTime: 0,
      play: vi.fn(),
      pause: vi.fn(),
      seek: vi.fn(),
      setPlaybackView: vi.fn(),
    });
  });

  it('renders the surveillance video in the main camera feed area', () => {
    render(<CameraSection />);
    
    const player = screen.getByTestId('video-player');
    
    expect(player).toBeInTheDocument();
    expect(player).toHaveAttribute('data-src', '/final video.mp4');
    expect(player).toHaveClass('w-full h-full');
  });

  it('enables controls for the surveillance video', () => {
    render(<CameraSection />);
    
    const player = screen.getByTestId('video-player');
    expect(player).toHaveAttribute('data-controls', 'true');
  });

  it('handles video loading errors gracefully', () => {
    render(<CameraSection />);
    
    // Spy on console.error
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    
    const player = screen.getByTestId('video-player');
    const errorBtn = player.querySelector('button');
    fireEvent.click(errorBtn!);

    // Since CameraSection just logs the error and sets state (which doesn't change UI structure for now),
    // we just verify it doesn't crash. 
    // Ideally CameraSection should show an error UI like FloorPlan does, 
    // but the current implementation just logs it.
    expect(consoleSpy).toHaveBeenCalledWith('Surveillance Video Error:', 'Test Error');
    
    consoleSpy.mockRestore();
  });
  
  it('toggles visibility when header is clicked', () => {
    render(<CameraSection />);
    
    const header = screen.getByRole('button', { name: /Surveillance Main Camera Feed/i });
    const videoContainer = screen.getByTestId('video-player').parentElement;
    
    // Initial state: expanded
    expect(videoContainer).toHaveClass('h-[60vh]');
    
    // Click to collapse
    fireEvent.click(header);
    expect(videoContainer).toHaveClass('h-0');
    
    // Click to expand
    fireEvent.click(header);
    expect(videoContainer).toHaveClass('h-[60vh]');
  });
});
