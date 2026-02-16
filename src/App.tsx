import React, { Suspense, lazy } from 'react';
import { RestaurantProvider } from './contexts/RestaurantContext';
import { PlaybackProvider } from './contexts/PlaybackContext';
import { TopBar } from './components/TopBar';
import { LeftSidebar } from './components/LeftSidebar';
import { DetailPanel } from './components/DetailPanel';
import { Routes, Route } from 'react-router-dom';
import { Loader2 } from 'lucide-react';

// Lazy load components for performance
const FloorPlan = lazy(() => import('./components/FloorPlan').then(m => ({ default: m.FloorPlan })));
const CameraSection = lazy(() => import('./components/CameraSection').then(m => ({ default: m.CameraSection })));
const AccountSettings = lazy(() => import('./pages/AccountSettings'));

const LoadingFallback = () => (
  <div className="h-full w-full flex flex-col items-center justify-center bg-gray-50/50 min-h-[400px]">
    <Loader2 className="w-10 h-10 text-blue-500 animate-spin mb-4" />
    <p className="text-gray-500 font-medium">Loading Dashboard Components...</p>
  </div>
);

function App() {
  return (
    <RestaurantProvider>
      <PlaybackProvider>
        <div className="min-h-screen bg-gray-100 flex flex-col">
          <TopBar />

          <div className="flex-1 flex overflow-hidden">
            <LeftSidebar />

            <div className="flex-1 overflow-y-auto bg-gray-50/50">
              <div className="p-6 h-full max-w-[1920px] mx-auto">
                <Suspense fallback={<LoadingFallback />}>
                  <Routes>
                    <Route
                      path="/"
                      element={
                        <div className="h-full">
                          <div className="flex flex-col xl:flex-row gap-6 h-full">
                            <div className="flex-1 w-full min-w-0 h-full">
                              <FloorPlan />
                            </div>
                            <div className="flex-1 w-full min-w-0 h-full">
                              <CameraSection />
                            </div>
                          </div>
                        </div>
                      }
                    />

                    <Route path="/account-settings" element={<AccountSettings />} />
                  </Routes>
                </Suspense>
              </div>
            </div>
          </div>

          <DetailPanel />
        </div>
      </PlaybackProvider>
    </RestaurantProvider>
  );
}

export default App;
