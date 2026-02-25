import { RestaurantProvider } from './contexts/RestaurantContext';
import { PlaybackProvider } from './contexts/PlaybackContext';
import { TopBar } from './components/TopBar';
import { LeftSidebar } from './components/LeftSidebar';
import { FloorPlan } from './components/FloorPlan';
import { CameraSection } from './components/CameraSection';
import { DetailPanel } from './components/DetailPanel';
import { Routes, Route } from 'react-router-dom';
import AccountSettings from './pages/AccountSettings';

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

// No changes required here; branding is handled by TopBar
