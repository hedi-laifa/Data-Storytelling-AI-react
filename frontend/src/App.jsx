import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import TopNavbar from './components/TopNavbar';
import Dashboard from './pages/Dashboard';
import DatasetSummary from './pages/DatasetSummary';
import ChartsPage from './pages/ChartsPage';
import ChatPage from './pages/ChatPage';
import RecommendationsPage from './pages/RecommendationsPage';
import StorytellingReportPage from './pages/StorytellingReportPage';
import SettingsPage from './pages/SettingsPage';
import LoginPage from './pages/LoginPage';
import { AppProvider, useAppContext } from './context/AppContext';

function AppContent() {
  const { isAuthenticated } = useAppContext();

  if (!isAuthenticated) {
    return (
      <div className="h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-50">
        <LoginPage />
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 dark:bg-slate-950 font-sans text-slate-900 dark:text-slate-50">
      <Sidebar />
      <div className="flex-1 flex flex-col relative overflow-hidden">
        <TopNavbar />
        <main className="flex-1 overflow-y-auto p-6 md:p-8 pt-24 space-y-8 scroll-smooth">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/dataset" element={<DatasetSummary />} />
            <Route path="/charts" element={<ChartsPage />} />
            <Route path="/chat" element={<ChatPage />} />
            <Route path="/recommendations" element={<RecommendationsPage />} />
            <Route path="/report" element={<StorytellingReportPage />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </AppProvider>
  );
}

export default App;