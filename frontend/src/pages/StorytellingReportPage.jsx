import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { FileText, TrendingUp, AlertTriangle, Download, Info } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import html2pdf from 'html2pdf.js';

export default function StorytellingReportPage() {
  const { report, isLoading } = useAppContext();
  const reportRef = useRef(null);

  // Handle case when no data is loaded yet
  if (!report && !isLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800">
        <FileText className="w-12 h-12 text-slate-400 mb-4" />
        <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-2">No Report Available</h2>
        <p className="text-slate-500 dark:text-slate-400 max-w-md">
          Please upload a dataset on the Dashboard or Dataset Summary page to generate your comprehensive AI Storytelling Report.
        </p>
      </div>
    );
  }

  // Fallbacks if data isn't loaded
  const execSummary = report?.executive_summary;
  const insights = report?.key_insights;
  const trends = report?.trends;
  const anomalies = report?.anomalies;

  const handleDownloadPdf = () => {
    const element = reportRef.current;
    
    // Configure html2pdf options
    const opt = {
      margin:       0.5,
      filename:     'Data_Storytelling_Report.pdf',
      image:        { type: 'jpeg', quality: 0.98 },
      html2canvas:  { scale: 2 },
      jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' }
    };

    html2pdf().from(element).set(opt).save();
  };

  return (
    <div className="max-w-4xl mx-auto space-y-10 pb-16 w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-4xl flex items-center gap-3">
            <FileText className="text-indigo-500" />
            Storytelling Report
          </h1>
          <p className="mt-2 text-lg text-slate-600 dark:text-slate-400">
            A deeply curated narrative summarizing your dataset.
          </p>
        </div>
        
        <button 
          onClick={handleDownloadPdf}
          className="flex items-center px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-medium transition-transform active:scale-95 shadow-lg shadow-indigo-600/20 whitespace-nowrap"
        >
          <Download className="w-4 h-4 mr-2" />
          Download PDF
        </button>
      </div>

      <div 
        ref={reportRef}
        className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden divide-y divide-slate-100 dark:divide-slate-800/50"
      >
        
        {/* Executive Summary */}
        {execSummary && (
          <div className="p-8">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2">Executive Summary</h2>
            <div className="flex items-start gap-2 mb-4 text-slate-500 dark:text-slate-400 text-sm">
              <Info className="w-4 h-4 shrink-0 mt-0.5" />
              <p>A high-level synthesis of your dataset designed to provide a broad understanding of the underlying factors, relationships, and the overall business context.</p>
            </div>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed text-lg bg-slate-50 dark:bg-slate-800/50 p-6 rounded-xl border border-slate-100 dark:border-slate-800">
              {execSummary}
            </p>
          </div>
        )}

        {/* Key Insights */}
        {insights?.length > 0 && (
          <div className="p-8 bg-slate-50 dark:bg-slate-800/20">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2">Key Insights</h2>
            <div className="flex items-start gap-2 mb-6 text-slate-500 dark:text-slate-400 text-sm">
              <Info className="w-4 h-4 shrink-0 mt-0.5" />
              <p>These are the major actionable takeaways derived directly from the numerical distributions, categorical clusters, and time-series patterns in the data.</p>
            </div>
            <ul className="space-y-4">
              {insights.map((item, idx) => (
                <motion.li 
                  key={idx}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="flex gap-4 p-4 bg-white dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm"
                >
                  <div className="w-2 h-2 rounded-full bg-indigo-500 mt-2 shrink-0" />
                  <span className="text-slate-700 dark:text-slate-300 text-lg leading-relaxed">{item}</span>
                </motion.li>
              ))}
            </ul>
          </div>
        )}

        {/* Trends & Anomalies */}
        <div className="p-8 grid md:grid-cols-2 gap-8">
          {/* Trends */}
          {trends?.length > 0 && (
            <div className="space-y-4">
              <h3 className="flex items-center gap-2 text-xl font-bold text-emerald-700 dark:text-emerald-400 mb-1">
                <TrendingUp className="w-6 h-6" />
                Verified Trends
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-4 px-1">
                Persistent shifts or patterns developing over time across columns.
              </p>
              <ul className="space-y-3">
                {trends.map((item, idx) => (
                  <li key={idx} className="flex gap-3 text-slate-700 dark:text-slate-300 leading-relaxed bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-100 dark:border-emerald-500/20 px-4 py-3 rounded-xl font-medium">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Anomalies */}
          {anomalies?.length > 0 && (
            <div className="space-y-4">
              <h3 className="flex items-center gap-2 text-xl font-bold text-rose-700 dark:text-rose-400 mb-1">
                <AlertTriangle className="w-6 h-6" />
                Anomalies Detected
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-4 px-1">
                Outliers and statistically improbable events that require investigation.
              </p>
              <ul className="space-y-3">
                {anomalies.map((item, idx) => (
                  <li key={idx} className="flex gap-3 text-slate-700 dark:text-slate-300 leading-relaxed bg-rose-50 dark:bg-rose-500/10 border border-rose-100 dark:border-rose-500/20 px-4 py-3 rounded-xl font-medium">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}