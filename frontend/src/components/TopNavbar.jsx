import React, { useState, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { Moon, Sun, Bell, Search, User, UploadCloud, Loader2, Sparkles, Command } from 'lucide-react';
import { motion } from 'framer-motion';
import { uploadDataset, getDatasetSummary, getCharts, getReport } from '../api';
import { useAppContext } from '../context/AppContext';

export default function TopNavbar() {
  const location = useLocation();
  const [isDark, setIsDark] = useState(false);
  const fileInputRef = useRef(null);
  const { setDatasetId, setSummary, setCharts, setReport, isLoading, setIsLoading, datasetId } = useAppContext();

  const toggleTheme = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle('dark');
  };

  const handleUploadClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setIsLoading(true);
    let newDatasetId = null;
    try {
      // 1. Upload File
      const uploadRes = await uploadDataset(file);
      newDatasetId = uploadRes.dataset_id;
      setDatasetId(newDatasetId);
      
      // Stop blocking the entire UI immediately after the upload finishes
      // so the user can look at the dashboard instantly, and we fetch the heavy LLMs asynchronously.
      setIsLoading(false);

      // 2. Fetch Dashboard Data context concurrently (In background)
      const [summaryData, chartsData, reportData] = await Promise.all([
        getDatasetSummary(newDatasetId),
        getCharts(newDatasetId).catch(() => []), // LLM gen takes long
        getReport(newDatasetId).catch(() => null) // LLM gen takes long
      ]);

      setSummary(summaryData);
      setCharts(chartsData || []);
      setReport(reportData);

    } catch (error) {
      console.error("Error uploading dataset or fetching data:", error);
      alert("Failed to process dataset. Ensure backend is running and API key is valid.");
    } finally {
      setIsLoading(false);
      event.target.value = null; // Reset input
    }
  };

  // Only render this specialized header on the main Dashboard page.
  if (location.pathname !== '/') {
    return null;
  }

  return (
    <motion.header 
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="absolute top-0 right-0 left-0 h-[5rem] bg-white/75 dark:bg-slate-950/75 backdrop-blur-2xl mx-4 md:mx-8 mt-5 px-5 md:px-8 flex items-center justify-between z-40 rounded-[2.5rem] shadow-2xl shadow-slate-200/50 dark:shadow-black/50 border border-white/80 dark:border-slate-800/80 transition-all duration-300"
    >
      
      {/* Left Side: Search / Command Palette Box */}
      <div className="flex items-center flex-1">
        <div className="hidden lg:flex items-center bg-slate-100/60 dark:bg-slate-900/60 hover:bg-white dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 px-5 py-2.5 rounded-full transition-all cursor-pointer w-80 shadow-inner border border-slate-200/60 dark:border-slate-700/50 focus-within:ring-2 ring-indigo-500/20">
          <Search className="w-4 h-4 mr-2" />
          <span className="text-sm font-medium">Search insights...</span>
          <div className="ml-auto flex items-center gap-1">
            <kbd className="hidden sm:inline-flex items-center gap-1 rounded bg-slate-50 dark:bg-slate-900 px-1.5 font-mono text-[10px] font-medium text-slate-500 shadow-sm border border-slate-200 dark:border-slate-700">
              <Command className="w-3 h-3" /> K
            </kbd>
          </div>
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center space-x-2 md:space-x-4">
        
        {/* Status Badge */}
        <div className="hidden md:flex items-center pl-2 pr-3 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-800/30">
          {datasetId ? (
            <>
              <div className="w-2 h-2 rounded-full bg-emerald-500 mr-2 relative">
                <div className="absolute inset-0 rounded-full bg-emerald-500 animate-ping opacity-50"></div>
              </div>
              <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-400">Dataset Active</span>
            </>
          ) : (
            <>
              <div className="w-2 h-2 rounded-full bg-amber-500 mr-2"></div>
              <span className="text-xs font-semibold text-amber-700 dark:text-amber-400">Awaiting Data</span>
            </>
          )}
        </div>

        {/* Hidden File Input */}
        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handleFileChange} 
          accept=".csv,.xlsx" 
          className="hidden" 
        />

        {/* Upload Button */}
        <motion.button 
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleUploadClick}
          disabled={isLoading}
          className="flex items-center px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-xl text-sm font-bold transition-all shadow-lg shadow-indigo-600/20 disabled:opacity-70 disabled:cursor-not-allowed border border-indigo-400/20"
        >
          {isLoading ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <Sparkles className="w-4 h-4 mr-2" />
          )}
          {isLoading ? 'Processing...' : 'New Analysis'}
        </motion.button>

        <div className="hidden sm:block h-6 w-px bg-slate-200 dark:bg-slate-700 mx-2"></div>

        {/* Theme Toggle */}
        <button onClick={toggleTheme} className="text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800">
          {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>

        {/* Notifications */}
        <button className="text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 relative">
          <Bell className="w-5 h-5" />
          <span className="absolute top-[6px] right-[6px] w-2 h-2 bg-rose-500 rounded-full border-2 border-white dark:border-slate-900"></span>
        </button>

        {/* Profile Avatar */}
        <div className="pl-2">
          <button className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-500 flex-shrink-0 to-purple-500 text-white shadow-md ring-2 ring-white dark:ring-slate-800 transition-transform hover:scale-105 active:scale-95">
            <User className="w-5 h-5" />
          </button>
        </div>

      </div>
    </motion.header>
  );
}