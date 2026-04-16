import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Database, BarChart3, Bot, Sparkles, FileText, Settings, PanelLeftClose, Layers, LogOut } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

const navItems = [
  { name: 'Dashboard', icon: LayoutDashboard, path: '/' },
  { name: 'Dataset Summary', icon: Database, path: '/dataset' },
  { name: 'Charts & Insights', icon: BarChart3, path: '/charts' },
  { name: 'AI Chat', icon: Bot, path: '/chat' },
  { name: 'Recommendations', icon: Sparkles, path: '/recommendations' },
  { name: 'Storytelling Report', icon: FileText, path: '/report' },
];

export default function Sidebar() {
  const { setIsAuthenticated } = useAppContext();
  const navigate = useNavigate();

  const handleLogout = (e) => {
    e.preventDefault();
    setIsAuthenticated(false);
    navigate('/');
  };

  return (
    <aside className="w-64 flex-shrink-0 flex flex-col justify-between border-r border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl h-full shadow-sm">
      <div>
        <div className="h-16 flex items-center px-6 border-b border-slate-200 dark:border-slate-800 shrink-0">
          <Layers className="w-7 h-7 text-indigo-600 dark:text-indigo-400 mr-3" />
          <span className="font-bold text-xl tracking-tight bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent">Data-Storytelling-AI</span>
        </div>
        
        <div className="py-6 px-4 space-y-1">
          <p className="px-3 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Analytics Workspace</p>
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group ${
                  isActive
                    ? 'bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100'
                }`
              }
            >
              <item.icon className="w-5 h-5 mr-3 flex-shrink-0" />
              {item.name}
            </NavLink>
          ))}
        </div>
      </div>
      
      <div className="p-4 border-t border-slate-200 dark:border-slate-800 space-y-1">
        <NavLink
            to="/settings"
            className="flex items-center px-3 py-2.5 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 transition-colors"
        >
          <Settings className="w-5 h-5 mr-3 flex-shrink-0" />
          Settings
        </NavLink>
        <button
            onClick={handleLogout}
            className="w-full flex items-center px-3 py-2.5 rounded-xl text-sm font-medium text-slate-600 hover:bg-rose-50 hover:text-rose-600 dark:text-slate-400 dark:hover:bg-rose-500/10 dark:hover:text-rose-400 transition-colors mt-2"
        >
          <LogOut className="w-5 h-5 mr-3 flex-shrink-0" />
          Logout
        </button>
      </div>
    </aside>
  );
}