import React, { useState, useEffect, useRef } from 'react';
import { Clock, User, Settings, Zap, LogOut, Crosshair, Bell, Shield } from 'lucide-react';
import { useRestaurant } from '../contexts/RestaurantContext';
import { formatDate, formatTime } from '../utils/formatting';
import DekhoLogo from './DekhoLogo';
import { useNavigate } from 'react-router-dom';

export const TopBar: React.FC = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const { metrics, liveMode, setLiveMode, setHomographyMatrix } = useRestaurant();
  
  const [showSettings, setShowSettings] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showCalibration, setShowCalibration] = useState(false);
  
  const settingsRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const interval = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
        if (settingsRef.current && !settingsRef.current.contains(event.target as Node)) {
            setShowSettings(false);
        }
        if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
            setShowProfile(false);
        }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleCalibrationSave = () => {
      // Mock saving matrix
      setHomographyMatrix([[1,0,0],[0,1,0],[0,0,1]]);
      setShowCalibration(false);
      setShowSettings(false);
      alert("Calibration data saved (Mock)");
  };

  const navigate = useNavigate();
  return (
    <>
    <div className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-gray-200 shadow-sm transition-all duration-300">
      <div className="px-6 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-8">
            {/* Brand */}
            <div className="flex items-center gap-3 group cursor-pointer">
              <div className="h-7 flex items-center justify-center transform group-hover:scale-105 transition-all duration-300">
                <DekhoLogo height={28} />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900 tracking-tight leading-none">
                  Dekho Tech
                </h1>
                <p className="text-[10px] text-gray-500 font-bold tracking-widest uppercase mt-0.5">Operations Dashboard</p>
              </div>
            </div>

            {/* Time Widget */}
            <div className="hidden md:flex items-center gap-3 pl-8 border-l border-gray-200/60">
              <div className="bg-gray-50 p-2 rounded-full border border-gray-100">
                <Clock className="w-4 h-4 text-gray-500" />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-gray-900 text-sm leading-none tabular-nums">
                  {formatTime(currentTime)}
                </span>
                <span className="text-[11px] text-gray-500 font-medium mt-0.5">
                  {formatDate(currentTime)}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-8">
            {/* KPIs */}
            <div className="hidden lg:flex gap-8">
              <div className="text-center group cursor-default">
                <div className="text-2xl font-bold text-blue-600 group-hover:text-blue-700 transition-colors tabular-nums">
                  {metrics.averageServiceTime}<span className="text-sm ml-0.5 font-medium text-blue-400">m</span>
                </div>
                <div className="text-[10px] uppercase font-bold text-gray-400 tracking-wide mt-0.5">Avg Service</div>
              </div>
              <div className="text-center group cursor-default">
                <div className="text-2xl font-bold text-green-600 group-hover:text-green-700 transition-colors tabular-nums">
                  {metrics.averageWaitTime}<span className="text-sm ml-0.5 font-medium text-green-400">m</span>
                </div>
                <div className="text-[10px] uppercase font-bold text-gray-400 tracking-wide mt-0.5">Avg Wait</div>
              </div>
              <div className="text-center group cursor-default">
                <div className="text-2xl font-bold text-emerald-600 group-hover:text-emerald-700 transition-colors tabular-nums">
                  {metrics.slaCompliance}<span className="text-sm ml-0.5 font-medium text-emerald-400">%</span>
                </div>
                <div className="text-[10px] uppercase font-bold text-gray-400 tracking-wide mt-0.5">SLA Score</div>
              </div>
            </div>

            {/* Actions & Profile */}
            <div className="flex items-center gap-4 border-l border-gray-200/60 pl-8 relative">
              <button
                onClick={() => setLiveMode(!liveMode)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                  liveMode
                    ? 'bg-red-50 text-red-600 border border-red-100 hover:bg-red-100'
                    : 'bg-gray-100 text-gray-600 border border-gray-200 hover:bg-gray-200'
                }`}
              >
                <Zap className={`w-3 h-3 ${liveMode ? 'fill-current' : ''}`} />
                {liveMode ? 'LIVE' : 'DEMO'}
              </button>
              
              {/* Settings Dropdown */}
              <div className="relative" ref={settingsRef}>
                  <button 
                    onClick={() => setShowSettings(!showSettings)}
                    className={`p-2 rounded-full transition-colors ${showSettings ? 'bg-gray-100 text-gray-800' : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'}`}
                  >
                    <Settings className="w-5 h-5" />
                  </button>
                  
                  {showSettings && (
                      <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl border border-gray-100 py-1 z-50">
                          <button 
                            onClick={() => setShowCalibration(true)}
                            className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                          >
                              <Crosshair size={16} />
                              Camera Calibration
                          </button>
                          <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                              <Bell size={16} />
                              Notification Preferences
                          </button>
                          <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                              <Shield size={16} />
                              System Config
                          </button>
                      </div>
                  )}
              </div>

              {/* Profile Modal Trigger */}
              <div className="relative" ref={profileRef}>
                  <button 
                    onClick={() => setShowProfile(!showProfile)}
                    className="w-9 h-9 bg-gradient-to-tr from-gray-700 to-gray-900 rounded-full flex items-center justify-center shadow-md hover:ring-2 ring-offset-2 ring-gray-200 transition-all"
                  >
                    <User className="w-5 h-5 text-white" />
                  </button>

                  {showProfile && (
                      <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-xl border border-gray-100 z-50 overflow-hidden">
                          <div className="bg-gradient-to-r from-gray-800 to-gray-900 p-6 text-white">
                              <div className="flex items-center gap-4">
                                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center text-xl font-bold">
                                      JS
                                  </div>
                                  <div>
                                      <h3 className="font-bold text-lg">John Smith</h3>
                                      <p className="text-xs text-gray-300">Operations Admin</p>
                                      <p className="text-[10px] text-gray-400 mt-1">ID: OP-8821-X</p>
                                  </div>
                              </div>
                          </div>
                          <div className="p-2">
                              <button onClick={() => { navigate('/account-settings'); setShowProfile(false); }} className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 rounded-lg flex items-center gap-2">
                                  <Settings size={16} />
                                  Account Settings
                              </button>
                              <div className="h-px bg-gray-100 my-1"></div>
                              <button className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 rounded-lg flex items-center gap-2">
                                  <LogOut size={16} />
                                  Logout
                              </button>
                          </div>
                      </div>
                  )}
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>

    {/* Calibration Modal */}
    {showCalibration && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-xl shadow-2xl w-[600px] p-6">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-gray-900">Camera Calibration</h2>
                    <button onClick={() => setShowCalibration(false)} className="text-gray-400 hover:text-gray-600">
                        <span className="sr-only">Close</span>
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                
                <div className="space-y-4">
                    <p className="text-sm text-gray-600">
                        Input homography matrix to map video coordinates to floor plan pixels.
                    </p>
                    
                    <div className="grid grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg border border-gray-200 font-mono text-sm">
                        <input type="text" placeholder="h11" className="w-full p-2 border rounded" defaultValue="0.5" />
                        <input type="text" placeholder="h12" className="w-full p-2 border rounded" defaultValue="-0.1" />
                        <input type="text" placeholder="h13" className="w-full p-2 border rounded" defaultValue="100" />
                        
                        <input type="text" placeholder="h21" className="w-full p-2 border rounded" defaultValue="0.1" />
                        <input type="text" placeholder="h22" className="w-full p-2 border rounded" defaultValue="0.5" />
                        <input type="text" placeholder="h23" className="w-full p-2 border rounded" defaultValue="200" />
                        
                        <input type="text" placeholder="h31" className="w-full p-2 border rounded" defaultValue="0" />
                        <input type="text" placeholder="h32" className="w-full p-2 border rounded" defaultValue="0" />
                        <input type="text" placeholder="h33" className="w-full p-2 border rounded" defaultValue="1" />
                    </div>

                    <div className="flex justify-end gap-3 mt-6">
                        <button 
                            onClick={() => setShowCalibration(false)}
                            className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium"
                        >
                            Cancel
                        </button>
                        <button 
                            onClick={handleCalibrationSave}
                            className="px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-lg font-medium"
                        >
                            Save Calibration
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )}
    </>
  );
};
