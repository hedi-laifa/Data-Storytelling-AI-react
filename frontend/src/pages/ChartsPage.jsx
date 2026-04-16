import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BarChart3, Sparkles, Maximize2, X, GraduationCap, Info } from 'lucide-react';
import Plot from 'react-plotly.js';
import { useAppContext } from '../context/AppContext';

function ChartCard({ chartData, title, explanation, variables, onZoom }) {
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 flex flex-col hover:shadow-2xl transition-all duration-300 relative group overflow-hidden">
      {/* Header */}
      <div className="mb-4">
        <div className="flex justify-between items-start gap-4">
          <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 leading-tight">{title}</h3>
          <button 
            onClick={onZoom}
            className="p-2 bg-slate-100/50 hover:bg-indigo-100 text-slate-500 hover:text-indigo-600 dark:bg-slate-800/50 dark:hover:bg-indigo-900/50 dark:text-slate-400 dark:hover:text-indigo-400 rounded-xl transition-colors"
            title="Expand Chart"
          >
            <Maximize2 className="w-5 h-5" />
          </button>
        </div>
        {variables && variables.length > 0 && (
          <div className="flex gap-2 mt-3 flex-wrap">
            {variables.map((v, i) => (
              <span key={i} className="px-3 py-1 text-xs font-semibold bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-full border border-indigo-100 dark:border-indigo-500/20">
                {v}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Chart Area */}
      <div className="h-[350px] w-full mb-6 relative z-0 bg-slate-50/50 dark:bg-slate-950/50 rounded-2xl border border-slate-100 dark:border-slate-800/50 p-2">
        {chartData ? (
           <Plot
             data={chartData.data}
             layout={{
               ...chartData.layout,
               autosize: true,
               paper_bgcolor: 'transparent',
               plot_bgcolor: 'transparent',
               font: { family: 'Inter', color: document.documentElement.classList.contains('dark') ? '#94a3b8' : '#475569' },
               margin: { t: 30, r: 20, b: 50, l: 50 }
             }}
             config={{ responsive: true, displayModeBar: false }}
             style={{ width: '100%', height: '100%' }}
           />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center rounded-xl">
             <BarChart3 className="w-8 h-8 text-slate-300 dark:text-slate-700 mb-2 animate-pulse" />
             <span className="text-slate-400 font-medium">Loading chart visualization...</span>
          </div>
        )}
      </div>

      {/* Explanations Section */}
      <div className="mt-auto space-y-3">
        {/* Beginner's Guide */}
        <div className="bg-emerald-50 dark:bg-emerald-500/10 rounded-2xl p-4 border border-emerald-100 dark:border-emerald-500/20">
          <div className="flex items-center gap-2 mb-2">
            <GraduationCap className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            <span className="text-sm font-bold tracking-tight text-emerald-800 dark:text-emerald-300">Beginner's Guide</span>
          </div>
          <p className="text-sm text-emerald-700 dark:text-emerald-400/90 leading-relaxed">
            <strong>How to read this:</strong> {title.toLowerCase().includes('scatter') || title.toLowerCase().includes('vs') ? 'This chart plots dots to show the relationship between two different variables. Look for upward or downward trends to see if one measurement increases as the other does.' : title.toLowerCase().includes('distribution') || title.toLowerCase().includes('histogram') ? 'This chart shows how your data is spread out. Taller bars mean those specific values happen much more frequently in your dataset.' : 'This chart compares different categories side-by-side. The height or length of the bars helps you quickly see which items are larger or more common.'}
          </p>
        </div>

        {/* Deep AI Insight */}
        <div className="bg-indigo-50/50 dark:bg-indigo-900/10 rounded-2xl p-4 border border-indigo-100/50 dark:border-indigo-800/30">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-4 h-4 text-indigo-500" />
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">Deep AI Insight</span>
          </div>
          <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
            {explanation || "No explanation provided for this chart."}
          </p>
        </div>
      </div>
    </div>
  );
}

export default function ChartsPage() {
  const { datasetId, charts, isLoading } = useAppContext();
  const [zoomedChart, setZoomedChart] = useState(null);

  if (isLoading || (datasetId && (!charts || charts.length === 0))) {
    return (
      <div className="flex flex-col items-center justify-center p-12 space-y-4">
        <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-slate-600 dark:text-slate-400 font-medium">AI is analyzing patterns and generating charts...</p>
        <p className="text-slate-500 dark:text-slate-500 text-sm">This may take up to a minute depending on dataset size.</p>
      </div>
    );
  }

  if (!datasetId) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-slate-500">
        <BarChart3 className="w-16 h-16 mb-4 text-slate-300 dark:text-slate-700" />
        <h2 className="text-xl font-semibold mb-2 text-slate-700 dark:text-slate-300">No Dataset Uploaded</h2>
        <p>Please upload a dataset using the button in the top navigation to view its charts.</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-12">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
          Charts & Insights
        </h1>
        <p className="mt-2 text-lg text-slate-600 dark:text-slate-400">
          Visualizations automatically generated by AI to highlight key relationships in your data.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {charts.map((chartItem, idx) => {
          let plotlyData = null;
          try {
            // The backend sends a JSON string or dict containing data/layout
            plotlyData = typeof chartItem.plotly_json === 'string' 
               ? JSON.parse(chartItem.plotly_json) 
               : chartItem.plotly_json;
          } catch(e) {
            console.error("Failed to parse chart JSON", e);
          }

          return (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
            >
              <ChartCard 
                title={chartItem.title}
                explanation={chartItem.explanation}
                variables={chartItem.variables_used}
                chartData={plotlyData}
                onZoom={() => setZoomedChart({
                  title: chartItem.title,
                  explanation: chartItem.explanation,
                  variables: chartItem.variables_used,
                  chartData: plotlyData
                })}
              />
            </motion.div>
          );
        })}
      </div>

      {/* Zoom Modal */}
      <AnimatePresence>
        {zoomedChart && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-12 bg-slate-900/80 backdrop-blur-sm"
            onClick={() => setZoomedChart(null)}
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl w-full max-w-6xl max-h-[90vh] flex flex-col overflow-hidden"
              onClick={e => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-800">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{zoomedChart.title}</h2>
                  {zoomedChart.variables && (
                    <div className="flex gap-2 mt-2">
                      {zoomedChart.variables.map((v, i) => (
                        <span key={i} className="px-3 py-1 text-xs font-semibold bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-full border border-indigo-100 dark:border-indigo-500/20">
                          {v}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <button 
                  onClick={() => setZoomedChart(null)}
                  className="p-2 bg-slate-100 hover:bg-rose-100 text-slate-500 hover:text-rose-600 dark:bg-slate-800 dark:hover:bg-rose-900/50 dark:hover:text-rose-400 rounded-full transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Modal Content - Splitting chart and text */}
              <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
                <div className="flex-1 p-6 bg-slate-50 dark:bg-slate-950/50 border-r border-slate-200 dark:border-slate-800 relative z-0 h-[50vh] lg:h-auto min-h-[400px]">
                  {zoomedChart.chartData && (
                     <Plot
                       data={zoomedChart.chartData.data}
                       layout={{
                         ...zoomedChart.chartData.layout,
                         autosize: true,
                         paper_bgcolor: 'transparent',
                         plot_bgcolor: 'transparent',
                         font: { family: 'Inter', color: document.documentElement.classList.contains('dark') ? '#94a3b8' : '#475569' },
                         margin: { t: 40, r: 40, b: 60, l: 60 }
                       }}
                       config={{ responsive: true, displayModeBar: true }}
                       style={{ width: '100%', height: '100%' }}
                       useResizeHandler={true}
                     />
                  )}
                </div>
                
                {/* Modal Sidebar for Explanation */}
                <div className="w-full lg:w-[400px] p-6 overflow-y-auto space-y-6 bg-white dark:bg-slate-900">
                  <div className="bg-emerald-50 dark:bg-emerald-500/10 rounded-2xl p-5 border border-emerald-100 dark:border-emerald-500/20">
                    <div className="flex items-center gap-2 mb-3">
                      <GraduationCap className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                      <span className="text-base font-bold tracking-tight text-emerald-800 dark:text-emerald-300">Beginner's Guide</span>
                    </div>
                    <p className="text-sm text-emerald-700 dark:text-emerald-400/90 leading-relaxed mb-3">
                      <strong>How to read this chart:</strong>
                    </p>
                    <ul className="text-sm text-emerald-700 dark:text-emerald-400/80 space-y-2 list-disc list-inside ml-2">
                       {zoomedChart.title.toLowerCase().includes('scatter') || zoomedChart.title.toLowerCase().includes('vs') ? (
                         <>
                           <li>Each dot represents a single row (or record) in your dataset.</li>
                           <li>The horizontal axis (bottom) shows one variable, and the vertical axis (side) shows another.</li>
                           <li>Look for a pattern: If dots go from bottom-left to top-right, the variables grow together.</li>
                         </>
                       ) : zoomedChart.title.toLowerCase().includes('distribution') || zoomedChart.title.toLowerCase().includes('histogram') ? (
                         <>
                           <li>This chart groups your numbers into buckets (the bars).</li>
                           <li>The height of each bar tells you how many records fell into that specific bucket.</li>
                           <li>A tall peak means that value is extremely common in your data.</li>
                         </>
                       ) : (
                         <>
                           <li>The bars let you easily compare the sizes of different categories.</li>
                           <li>Look for the tallest/longest bar to find the highest value quickly.</li>
                           <li>Compare bars next to each other to see relative differences.</li>
                         </>
                       )}
                    </ul>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
                      <Sparkles className="w-5 h-5 text-indigo-500" />
                      <h4 className="text-sm font-bold text-slate-800 dark:text-white uppercase tracking-wider">AI Analysis</h4>
                    </div>
                    <p className="text-base text-slate-700 dark:text-slate-300 leading-relaxed">
                      {zoomedChart.explanation || "No explanation provided for this chart."}
                    </p>
                  </div>
                  
                  <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 border border-slate-200 dark:border-slate-700">
                    <div className="flex items-start gap-3">
                      <Info className="w-5 h-5 text-slate-400 mt-0.5" />
                      <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                        Data represented in this chart is derived directly from your recent document upload. Anomalies or missing labels are dependent on the dataset's native formatting.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
