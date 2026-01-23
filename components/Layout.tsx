import React, { useState } from 'react';
import { UserRole } from '../types';
import { 
  LayoutDashboard, 
  Utensils, 
  Truck, 
  ShieldAlert, 
  LogOut, 
  FileText,
  QrCode,
  Vote,
  Home,
  ShieldCheck,
  Search
} from 'lucide-react';

const Layout = ({ children, role = '', onLogout, activeTab, setActiveTab }) => {
  const safeRole = role || '';

  if (!safeRole) return <div className="min-h-screen bg-slate-900 flex items-center justify-center">{children}</div>;

  const getNavItems = (userRole) => {
    switch (userRole) {
      case UserRole.BGN:
        return [
          { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
          { id: 'compliance', label: 'Kepatuhan', icon: ShieldCheck },
          { id: 'reports', label: 'Validasi', icon: FileText },
        ];
      case UserRole.SPPG:
        return [
          { id: 'dashboard', label: 'Overview', icon: LayoutDashboard },
          { id: 'distribution', label: 'Distribusi', icon: Truck },
          { id: 'inventory', label: 'Bahan Baku', icon: Utensils },
          { id: 'polling', label: 'Buat Polling', icon: Vote },
        ];
      case UserRole.SCHOOL:
        return [
          // GANTI Siswa -> Pengiriman sesuai request
          { id: 'dashboard', label: 'Pengiriman', icon: Truck },
          { id: 'attendance', label: 'Absensi QR', icon: QrCode },
          { id: 'incident', label: 'Laporan', icon: ShieldAlert },
        ];
      case UserRole.STUDENT:
        return [
          { id: 'menu', label: 'Menu', icon: Home },
          { id: 'vote', label: 'Voting', icon: Vote },
          { id: 'scan', label: 'Scan', icon: QrCode },
          { id: 'emergency', label: 'Darurat', icon: ShieldAlert },
        ];
      default:
        return [];
    }
  };

  const navItems = getNavItems(safeRole);

  return (
    <div className="min-h-screen font-sans text-slate-800 flex flex-col md:flex-row bg-[#f8fafc]">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-72 bg-[#0f172a] text-white h-screen sticky top-0 z-40 border-r border-slate-800 shadow-2xl">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-8 px-2">
             <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center font-display font-bold text-white text-xl shadow-lg shadow-blue-500/30">
               M
             </div>
             <div>
                <span className="font-display font-bold text-lg tracking-tight block leading-none">MBG</span>
                <span className="text-[10px] text-slate-400 uppercase tracking-widest font-medium">Systems</span>
             </div>
          </div>
          
          <div className="px-4 py-4 bg-slate-800/40 rounded-2xl mb-6 border border-slate-700/50 backdrop-blur-sm">
             <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1.5">Sesi Aktif</p>
             <div className="flex items-center justify-between">
                <p className="text-sm font-bold text-white capitalize">{safeRole.toLowerCase()}</p>
                <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)] animate-pulse"></div>
             </div>
          </div>
        </div>
        
        <nav className="flex-1 px-4 space-y-2 overflow-y-auto no-scrollbar">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex items-center w-full px-4 py-4 rounded-xl transition-all duration-300 group relative overflow-hidden ${
                activeTab === item.id 
                  ? 'bg-blue-600 text-white shadow-glow' 
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <item.icon size={20} className={`mr-3 transition-transform duration-300 ${activeTab === item.id ? 'scale-110' : 'group-hover:scale-110'}`} />
              <span className="font-medium text-sm tracking-wide">{item.label}</span>
              {activeTab === item.id && (
                 <div className="absolute right-3 w-1.5 h-1.5 bg-white rounded-full"></div>
              )}
            </button>
          ))}
        </nav>

        <div className="p-6 border-t border-slate-800">
          <button 
            onClick={onLogout}
            className="flex items-center w-full px-4 py-3 text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 rounded-xl transition-colors font-medium text-sm group"
          >
            <LogOut size={20} className="mr-3 group-hover:-translate-x-1 transition-transform" />
            Keluar
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
         <header className="hidden md:flex h-20 bg-white/80 backdrop-blur-xl border-b border-slate-200/60 sticky top-0 z-30 px-8 items-center justify-between">
            <div className="flex items-center gap-4">
               <h2 className="text-xl font-display font-bold text-slate-800 capitalize">
                 {activeTab.replace('-', ' ')}
               </h2>
               <div className="h-6 w-[1px] bg-slate-200"></div>
               <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">MBG National Platform</span>
            </div>
            <div className="flex items-center gap-4">
               <div className="relative">
                  <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" />
                  <input type="text" placeholder="Cari data..." className="pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-full text-xs outline-none focus:border-blue-500 transition-all w-64" />
               </div>
            </div>
         </header>

         <main className="flex-1 p-4 md:p-8 overflow-y-auto pb-32 md:pb-8">
            <div className="max-w-7xl mx-auto">
               {children}
            </div>
         </main>
      </div>
    </div>
  );
};

export default Layout;