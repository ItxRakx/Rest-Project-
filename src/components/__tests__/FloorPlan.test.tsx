import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { FloorPlan } from '../FloorPlan';

// Mock child components
vi.mock('../OperationalGrid', () => ({
  OperationalGrid: () => <div data-testid="operational-grid">Grid View</div>
}));

// Mock the DashboardVideoPlayer
vi.mock('../DashboardVideoPlayer', () => ({
  DashboardVideoPlayer: ({ src, className, onError, poster }: any) => (
    <div 
      data-testid="video-player" 
      data-src={src} 
      className={className}
      data-poster={poster}
    >
      <button onClick={() => onError && onError("Test Error")}>Trigger Error</button>
    </div>
  )
}));

// Mock the hooks directly
const mockUseRestaurant = vi.fn();
const mockUsePlayback = vi.fn();

vi.mock('../../contexts/RestaurantContext', () => ({
  useRestaurant: () => mockUseRestaurant(),
}));

vi.mock('../../contexts/PlaybackContext', () => ({
  usePlayback: () => mockUsePlayback(),
}));

describe('FloorPlan Video Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    
    // Default mock implementations
    mockUseRestaurant.mockReturnValue({
      isFloorPlanExpanded: true,
      setIsFloorPlanExpanded: vi.fn(),
      tables: [],
    });

    mockUsePlayback.mockReturnValue({
      isPlaybackView: true,
      isPlaying: false,
      currentTime: 0,
    });

    // Mock requestFullscreen for all elements in jsdom
    Element.prototype.requestFullscreen = vi.fn().mockResolvedValue(undefined);
    Document.prototype.exitFullscreen = vi.fn().mockResolvedValue(undefined);
  });

  it('renders the floor plan video as the main background', () => {
    render(<FloorPlan />);
    
    // Switch to map view
    const mapButton = screen.getByText('Map');
    fireEvent.click(mapButton);
    
    const players = screen.getAllByTestId('video-player');
    const mainPlayer = players.find(p => p.getAttribute('data-src') === '/simulation video.mov');
    
    expect(mainPlayer).toBeInTheDocument();
    expect(mainPlayer).toHaveClass('w-full h-full');
  });

  it('handles video loading errors by showing fallback UI', () => {
    render(<FloorPlan />);
    
    // Switch to map view
    const mapButton = screen.getByText('Map');
    fireEvent.click(mapButton);
    
    const players = screen.getAllByTestId('video-player');
    const mainPlayer = players.find(p => p.getAttribute('data-src') === '/simulation video.mov');
    
    const errorBtn = mainPlayer?.querySelector('button');
    fireEvent.click(errorBtn!);

    expect(screen.getByText('Floor Plan Visualization Unavailable')).toBeInTheDocument();
    expect(screen.queryByTestId('video-player')).not.toBeInTheDocument();
  });

  it('supports click-to-fullscreen interaction on main player', () => {
    render(<FloorPlan />);
    
    // Switch to map view
    const mapButton = screen.getByText('Map');
    fireEvent.click(mapButton);

    const players = screen.getAllByTestId('video-player');
    const mainPlayer = players.find(p => p.getAttribute('data-src') === '/simulation video.mov');
    const container = mainPlayer?.parentElement;

    const requestFullscreenMock = vi.fn().mockResolvedValue(undefined);
    // jsdom doesn't implement requestFullscreen on elements by default, but we mocked it on Element.prototype in beforeEach.
    // However, to spy on the specific element call:
    container!.requestFullscreen = requestFullscreenMock;

    fireEvent.click(container!);
    expect(requestFullscreenMock).toHaveBeenCalled();
  });
});
