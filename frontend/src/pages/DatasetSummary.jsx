import React from 'react';
import { motion } from 'framer-motion';
import { Database, Hash, Type, AlertCircle, LayoutList } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

export default function DatasetSummary() {
  const { summary } = useAppContext();

  if (!summary) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-slate-500">
        <Database className="w-16 h-16 mb-4 text-slate-300 dark:text-slate-700" />
        <h2 className="text-xl font-semibold mb-2 text-slate-700 dark:text-slate-300">No Dataset Loaded</h2>
        <p>Please upload a dataset using the button in the top navigation to view its summary.</p>
      </div>
    );
  }

  const columns = Object.keys(summary.data_types);

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-12">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
          Dataset Summary
        </h1>
        <p className="mt-2 text-lg text-slate-600 dark:text-slate-400">
          A high-level structural overview and metadata profile of your active dataset.
        </p>
      </div>

      {/* Schema Overview Section */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-panel p-6"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-indigo-100 dark:bg-indigo-900/40 rounded-xl">
            <LayoutList className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
          </div>
          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">Column Schema & Metadata</h2>
        </div>

        <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
          <table className="min-w-full divide-y flex-1 divide-slate-200 dark:divide-slate-800">
            <thead className="bg-slate-50 dark:bg-slate-900/50">
              <tr>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Column Name</th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Data Type</th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Missing Values</th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Key Type</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-slate-800/20 divide-y divide-slate-100 dark:divide-slate-800">
              {columns.map((col, idx) => (
                <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900 dark:text-slate-200">{col}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600 dark:text-slate-400">
                    <span className="inline-flex items-center py-1 px-2.5 rounded-full text-xs font-medium bg-slate-100 dark:bg-slate-800 font-mono">
                      {summary.data_types[col]}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {summary.null_counts[col] > 0 ? (
                      <span className="inline-flex items-center text-rose-600 dark:text-rose-400">
                        <AlertCircle className="w-4 h-4 mr-1.5" />
                        {summary.null_counts[col]} empty
                      </span>
                    ) : (
                      <span className="text-emerald-600 dark:text-emerald-400 font-medium">0 empty</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 dark:text-slate-400">
                    {summary.numeric_columns.includes(col) ? (
                      <span className="inline-flex items-center"><Hash className="w-4 h-4 mr-1.5" /> Numeric</span>
                    ) : (
                      <span className="inline-flex items-center"><Type className="w-4 h-4 mr-1.5" /> Categorical</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Raw Data Sample */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass-panel p-6"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-emerald-100 dark:bg-emerald-900/40 rounded-xl">
            <Database className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
          </div>
          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">Dataset Sample (All Rows)</h2>
        </div>

        <div className="overflow-x-auto overflow-y-auto max-h-[600px] rounded-xl border border-slate-200 dark:border-slate-800">
          <table className="min-w-full relative divide-y divide-slate-200 dark:divide-slate-800">
            <thead className="bg-slate-50 dark:bg-slate-900/50 sticky top-0 z-10">
              <tr>
                {columns.map((col) => (
                  <th key={col} scope="col" className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-slate-800/20 divide-y divide-slate-100 dark:divide-slate-800">
              {summary.sample_rows.map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  {columns.map((col) => (
                    <td key={col} className="px-6 py-4 whitespace-nowrap text-sm text-slate-600 dark:text-slate-300">
                      {row[col] !== null ? String(row[col]) : <span className="text-slate-400 italic">null</span>}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

    </div>
  );
}
