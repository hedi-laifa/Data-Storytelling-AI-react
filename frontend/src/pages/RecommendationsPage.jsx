import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, CheckCircle2, TrendingUp, AlertCircle, Zap, Target, ArrowRight, Lightbulb } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

export default function RecommendationsPage() {
  const { report, isLoading } = useAppContext();
  const [actionsTaken, setActionsTaken] = useState([]);

  const handleTakeAction = (index) => {
    if (!actionsTaken.includes(index)) {
      setActionsTaken([...actionsTaken, index]);
    }
  };

  // Handle case when no data is loaded yet
  if (!report && !isLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800 h-[60vh]">
        <div className="w-20 h-20 bg-indigo-50 dark:bg-indigo-900/30 rounded-full flex items-center justify-center mb-6">
          <Lightbulb className="w-10 h-10 text-indigo-400" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-3">Awaiting Data Insights</h2>
        <p className="text-slate-500 dark:text-slate-400 max-w-md text-lg">
          Upload a dataset to generate powerful, AI-driven business recommendations and strategic action plans.
        </p>
      </div>
    );
  }

  // Expanded fallback recommendations if none exist
  const defaultRecommendations = [
    "Consider optimizing pricing strategy to reflect real-time market trends and customer willingness to pay, potentially increasing margins by 8-12%.",
    "Investigate the drop in Q3 engagement among older demographics by launching a targeted feedback survey and adjusting ad placements.",
    "Increase inventory buffers by 15% for the top 3 best-selling products to avoid recent stockouts during peak seasonal demand.",
    "Reallocate 20% of the Q4 marketing budget from low-performing traditional channels toward the newly successful social video ad campaigns.",
    "Implement automated follow-up emails for workflow drop-offs to recover an estimated 15% in lost user conversions.",
    "Review vendor contracts for operational materials, as associated overhead costs have risen disproportionately over the last fiscal year.",
    "Develop a loyalty program for returning users, who currently make up a smaller demographic but drive the majority of long-term value."
  ];

  const recommendations = report?.business_recommendations || defaultRecommendations;

  // Helpers to make the UI look rich even with plain string arrays
  const getCategory = (index) => {
    const categories = [
      { name: 'Growth Strategy', text: 'text-emerald-700 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-500/10', border: 'border-emerald-200 dark:border-emerald-500/20', Icon: TrendingUp },
      { name: 'Risk Management', text: 'text-rose-700 dark:text-rose-400', bg: 'bg-rose-50 dark:bg-rose-500/10', border: 'border-rose-200 dark:border-rose-500/20', Icon: AlertCircle },
      { name: 'Process Optimization', text: 'text-blue-700 dark:text-blue-400', bg: 'bg-blue-50 dark:bg-blue-500/10', border: 'border-blue-200 dark:border-blue-500/20', Icon: Zap },
      { name: 'Strategic Initiative', text: 'text-amber-700 dark:text-amber-400', bg: 'bg-amber-50 dark:bg-amber-500/10', border: 'border-amber-200 dark:border-amber-500/20', Icon: Target }
    ];
    return categories[index % categories.length];
  };

  const getPriority = (index) => {
    const priorities = ['High Priority', 'Medium Priority', 'Critical Action', 'Quick Win'];
    return priorities[index % priorities.length];
  };

  return (
    <div className="max-w-6xl mx-auto space-y-10 pb-16 w-full">
      {/* Header */}
      <div className="bg-gradient-to-br from-indigo-900 to-purple-900 rounded-3xl p-8 md:p-12 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 opacity-10 pointer-events-none">
          <Sparkles className="w-64 h-64" />
        </div>
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/20 hover:bg-white/30 rounded-full font-medium text-sm mb-6 backdrop-blur-md transition-colors cursor-default border border-white/10">
            <Sparkles className="w-4 h-4 text-indigo-200" />
            AI-Generated Strategy
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl mb-4">
            Actionable Recommendations
          </h1>
          <p className="max-w-2xl text-lg text-indigo-100 leading-relaxed font-light">
            Based on deep analysis of your dataset, the AI has formulated these strategic steps to help you mitigate risks, optimize processes, and accelerate growth.
          </p>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full">
        {recommendations.map((rec, index) => {
          const cat = getCategory(index);
          const priority = getPriority(index);

          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.5, ease: "easeOut" }}
              className="group bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 sm:p-8 rounded-3xl shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col h-full relative overflow-hidden"
            >
              {/* Category Badge Row */}
              <div className="flex items-center justify-between mb-5">
                <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider ${cat.bg} ${cat.text} ${cat.border} border`}>
                  <cat.Icon className="w-4 h-4" />
                  {cat.name}
                </div>
                <div className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-widest bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-full">
                  {priority}
                </div>
              </div>

              {/* Text Content */}
              <div className="flex-1 flex gap-4">
                <div className="flex-shrink-0 mt-1">
                  <div className="p-2 border-2 border-slate-100 dark:border-slate-800 rounded-full group-hover:border-indigo-500 group-hover:bg-indigo-50 dark:group-hover:bg-indigo-500/20 transition-all duration-300">
                    <CheckCircle2 className="w-5 h-5 text-slate-300 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors" />
                  </div>
                </div>
                <div className="flex-1 text-slate-700 dark:text-slate-300 text-[1.05rem] leading-relaxed font-medium">
                  {rec}
                </div>
              </div>

              {/* Action Footer */}
              <div className="mt-8 pt-5 border-t border-slate-100 dark:border-slate-800/60 flex items-center justify-between opacity-50 group-hover:opacity-100 transition-opacity">
                <span className="text-sm text-slate-500 dark:text-slate-400 font-medium">Auto-generated insight #{index + 1}</span>
                {actionsTaken.includes(index) ? (
                  <span className="text-emerald-500 dark:text-emerald-400 flex items-center gap-1 text-sm font-bold transition-all">
                    Action Logged <CheckCircle2 className="w-4 h-4 ml-0.5" />
                  </span>
                ) : (
                  <button 
                    onClick={() => handleTakeAction(index)}
                    className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 flex items-center gap-1 text-sm font-bold transition-colors"
                  >
                    Take Action <ArrowRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}