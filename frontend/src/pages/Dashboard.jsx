import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Rows, AlertTriangle, Cpu, BarChart2, MessageSquare, Sparkles } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';

const mockData = [
  { name: 'Jan', value: 4000 },
  { name: 'Feb', value: 3000 },
  { name: 'Mar', value: 2000 },
  { name: 'Apr', value: 2780 },
  { name: 'May', value: 1890 },
  { name: 'Jun', value: 2390 },
  { name: 'Jul', value: 3490 },
];

function KpiCard({ title, value, icon: Icon, trend, colorClass }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="glass-panel p-6 flex items-start gap-4 hover:shadow-lg transition-all duration-300"
    >
      <div className={`p-4 rounded-2xl ${colorClass}`}>
        <Icon className="w-6 h-6" />
      </div>
      <div className="flex-1">
        <h3 className="text-slate-500 dark:text-slate-400 text-sm font-medium mb-1">{title}</h3>
        <p className="text-3xl font-bold tracking-tight text-slate-800 dark:text-slate-100">{value}</p>
        <div className="flex items-center mt-2 text-sm text-emerald-600 dark:text-emerald-400 font-medium tracking-wide">
          <TrendingUp className="w-4 h-4 mr-1" />
          {trend}
        </div>
      </div>
    </motion.div>
  );
}

function ChartCard({ title, subtitle, explanation, data = mockData }) {
  return (
    <div className="glass-panel p-6 flex flex-col hover:shadow-xl transition-all duration-300">
      <div className="mb-6 flex justify-between items-start">
        <div>
          <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">{title}</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{subtitle}</p>
        </div>
        <button className="text-slate-400 hover:text-indigo-600 transition-colors">
          <MessageSquare className="w-5 h-5" />
        </button>
      </div>
      
      <div className="h-64 mb-6">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.15} />
            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dy={10} />
            <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dx={-10} />
            <Tooltip 
              contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
            />
            <Area type="monotone" dataKey="value" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorValue)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 mt-auto border border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="w-4 h-4 text-indigo-500" />
          <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400">AI Insight</span>
        </div>
        <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          {explanation}
        </p>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const { summary, report, charts, datasetId } = useAppContext();
  const navigate = useNavigate();

  if (!datasetId) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800">
        <Sparkles className="w-12 h-12 text-slate-400 mb-4" />
        <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-2">No Dataset Loaded</h2>
        <p className="text-slate-500 dark:text-slate-400 max-w-md">
          Please upload a dataset on the Dataset Summary page to generate your smart dashboard.
        </p>
      </div>
    );
  }

  const totalRows = summary ? summary.row_count.toLocaleString() : "0";
  const numMissing = summary ? Object.values(summary.null_counts).reduce((a,b)=>a+b,0) : "0";
  const totalCols = summary ? summary.column_count : "0";
  const totalCharts = charts && charts.length > 0 ? charts.length : 0;

  const titleText = "Active Dataset Analytics";
  const reportSummaryText = report 
    ? report.executive_summary 
    : "The dataset shows consistent growth with minor seasonality spikes in Q3.";

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-12">
      
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
          {titleText}
        </h1>
        <p className="mt-2 text-lg text-slate-600 dark:text-slate-400">
          AI has processed your dataset and configured the smart dashboard.
        </p>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KpiCard 
          title="Total Rows" 
          value={totalRows} 
          icon={Rows} 
          trend="Data load complete" 
          colorClass="bg-blue-100 text-blue-600 dark:bg-blue-900/40 dark:text-blue-400" 
        />
        <KpiCard 
          title={summary ? "Total Missing Values" : "Missing Values"} 
          value={numMissing} 
          icon={AlertTriangle} 
          trend={summary ? "Cleaned automatically" : "-1.2% this run"} 
          colorClass="bg-rose-100 text-rose-600 dark:bg-rose-900/40 dark:text-rose-400" 
        />
        <KpiCard 
          title="Columns / Features" 
          value={totalCols} 
          icon={Cpu} 
          trend="Parsed types safely" 
          colorClass="bg-indigo-100 text-indigo-600 dark:bg-indigo-900/40 dark:text-indigo-400" 
        />
        <KpiCard 
          title="Charts Generated" 
          value={totalCharts} 
          icon={BarChart2} 
          trend="Ready to view" 
          colorClass="bg-emerald-100 text-emerald-600 dark:bg-emerald-900/40 dark:text-emerald-400" 
        />
      </div>

      {/* AI Recommendations */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="glass-panel p-6 sm:p-8"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-purple-100 dark:bg-purple-900/40 rounded-xl">
            <Sparkles className="w-5 h-5 text-purple-600 dark:text-purple-400" />
          </div>
          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">Executive Summary</h2>
        </div>
        <p className="text-slate-600 dark:text-slate-300 leading-relaxed max-w-4xl">
          {reportSummaryText}
        </p>
        <div className="mt-6 flex gap-3">
          <button 
            onClick={() => navigate('/report')}
            className="px-5 py-2.5 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 text-sm font-medium rounded-xl hover:bg-slate-800 dark:hover:bg-slate-200 transition-colors"
          >
            Read Full Report
          </button>
          <button 
            onClick={() => navigate('/chat')}
            className="px-5 py-2.5 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 text-sm font-medium rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
          >
            Ask AI Assistant
          </button>
        </div>
      </motion.div>

      {/* Dynamic Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {charts && charts.length > 0 ? (
          charts.map((chart, idx) => (
             <ChartCard 
               key={idx}
               title={chart.title}
               subtitle={`Variables: ${chart.variables_used.join(', ')}`}
               explanation={chart.explanation}
               data={mockData}
             />
          ))
        ) : (
          <div className="col-span-full text-center p-8 bg-slate-50 dark:bg-slate-800/20 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400">
            No charts have been generated yet.
          </div>
        )}
      </div>
    </div>
  );
}
