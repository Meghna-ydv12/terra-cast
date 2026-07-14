import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import DigitalTwin from './pages/DigitalTwin';
import MapDashboard from './pages/MapDashboard';
import ScenarioLab from './pages/ScenarioLab';
import { DataProvider } from './context/DataContext';

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <DataProvider>
        <BrowserRouter>
          <div className="flex h-screen w-full bg-background text-white font-sans overflow-hidden">
            <Sidebar />
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden bg-background">
              <Header />
              <div className="flex-1 overflow-y-auto p-6 relative">
                <Routes>
                  <Route path="/" element={<Navigate to="/overview" replace />} />
                  <Route path="/overview" element={<DigitalTwin />} />
                  <Route path="/map" element={<MapDashboard />} />
                  <Route path="/lab" element={<ScenarioLab />} />
                  <Route path="*" element={<Navigate to="/overview" replace />} />
                </Routes>
              </div>
            </div>
          </div>
        </BrowserRouter>
      </DataProvider>
    </QueryClientProvider>
  );
}
