import React, { useState, useEffect } from 'react';
import { Download, History, Database, Calendar, FileText } from 'lucide-react';


import { getHistory, downloadDataset } from '../api';
import { useAppContext } from '../context/AppContext';

import { motion } from 'framer-motion';

export default function HistoryPage() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Use a hardcoded user ID for mock auth
  
  const { user } = useAppContext();
  const userId = user?.id;


  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const data = await getHistory(userId);
      setHistory(data);
    } catch (error) {
      console.error("Failed to fetch history:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (datasetId) => {
    try {
      await downloadDataset(datasetId, userId);
    } catch (error) {
      console.error("Failed to download dataset:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-12">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-4xl flex items-center gap-3">
          <History className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
          Download History
        </h1>
        <p className="mt-2 text-lg text-slate-600 dark:text-slate-400">
          View and re-download previously analyzed datasets.
        </p>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
        {history.length === 0 ? (
          <div className="p-12 text-center flex flex-col items-center">
            <History className="w-16 h-16 text-slate-300 dark:text-slate-700 mb-4" />
            <h3 className="text-xl font-medium text-slate-900 dark:text-slate-100">No History Found</h3>
            <p className="mt-2 text-slate-500 dark:text-slate-400">You haven't downloaded any datasets yet.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-800">
              <thead className="bg-slate-50 dark:bg-slate-800/50">
                <tr>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Dataset Name
                  </th>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Date Downloaded
                  </th>
                  <th scope="col" className="px-6 py-4 text-right text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                {history.map((item, index) => (
                  <motion.tr 
                    key={item.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Database className="w-5 h-5 text-indigo-500 mr-3 flex-shrink-0" />
                        <span className="text-sm font-medium text-slate-900 dark:text-slate-100">
                          {item.dataset_name}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-slate-500 dark:text-slate-400">
                        <Calendar className="w-4 h-4 mr-2" />
                        {new Date(item.downloaded_at).toLocaleString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end gap-2">
                        {item.has_report && (
                          <button
                            onClick={async () => {
                              try {
                                const { downloadHistoryReport } = await import('../api');
                                await downloadHistoryReport(item.id);
                              } catch (e) {
                                console.error(e);
                                alert("Failed to download report");
                              }
                            }}
                            className="inline-flex items-center px-3 py-1.5 border border-slate-200 dark:border-slate-700 shadow-sm text-sm font-medium rounded-lg text-emerald-600 dark:text-emerald-400 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-colors"
                          >
                            <FileText className="w-4 h-4 mr-1.5" />
                            Download Report
                          </button>
                        )}
                        <button
                          onClick={() => handleDownload(item.dataset_id)}
                          className="inline-flex items-center px-3 py-1.5 border border-slate-200 dark:border-slate-700 shadow-sm text-sm font-medium rounded-lg text-indigo-600 dark:text-indigo-400 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
                        >
                          <Download className="w-4 h-4 mr-1.5" />
                          Download Dataset
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
