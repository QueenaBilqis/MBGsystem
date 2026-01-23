
import React from 'react';
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
  Search,
  UserCircle
} from 'lucide-react';

const Layout = ({ children, role = '', onLogout, activeTab, setActiveTab }) => {
  const safeRole = role || '';

  if (!safeRole) return <div className="min-h-screen bg-slate-900 flex items-center justify-center">{children}</div>;

  const getNavItems = (userRole) => {
    switch (userRole) {
      case UserRole.BGN:
        return [
          { id: 'dashboard', label: 'Home', icon: LayoutDashboard },
          { id: 'compliance', label: 'Gizi', icon: ShieldCheck },
          { id: 'reports', label: 'Validasi', icon: FileText },
        ];
      case UserRole.SPPG:
        return [
          { id: 'dashboard', label: 'Home', icon: LayoutDashboard },
          { id: 'distribution', label: 'Kirim', icon: Truck },
          { id: 'inventory', label: 'Stok', icon: Utensils },
          { id: 'polling', label: 'Poll', icon: Vote },
        ];
      case UserRole.SCHOOL:
        return [
          { id: 'dashboard', label: 'Lacak', icon: Truck },
          { id: 'attendance', label: 'Absen', icon: QrCode },
          { id: 'incident', label: 'Lapor', icon: ShieldAlert },
        ];
      case UserRole.STUDENT:
        return [
          { id: 'menu', label: 'Menu', icon: Home },
          { id: 'vote', label: 'Vote', icon: Vote },
          { id: 'scan', label: 'Scan', icon: QrCode },
          { id: 'emergency', label: 'SOS', icon: ShieldAlert },
        ];
      default:
        return [];
    }
  };

  const navItems = getNavItems(safeRole);

  return (
    <div className="min-h-screen font-sans text-slate-800 flex flex-col md:flex-row bg-[#f8fafc]">
      {/* Mobile Top Header */}
      <header className="md:hidden flex h-16 bg-white border-b border-slate-100 sticky top-0 z-50 px-5 items-center justify-between shadow-sm">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center font-bold text-white text-sm">M</div>
          <span className="font-display font-bold text-slate-800 tracking-tight">MBG <span className="text-blue-600">Systems</span></span>
        </div>
        <button onClick={() => setActiveTab('profile')} className="p-2 text-slate-400">
          <UserCircle size={24} />
        </button>
      </header>

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
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
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
              <item.icon size={20} className="mr-3" />
              <span className="font-medium text-sm tracking-wide">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="p-6 border-t border-slate-800">
          <button 
            onClick={onLogout}
            className="flex items-center w-full px-4 py-3 text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 rounded-xl transition-colors font-medium text-sm group"
          >
            <LogOut size={20} className="mr-3" />
            Keluar
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
         {/* Desktop Header */}
         <header className="hidden md:flex h-20 bg-white/80 backdrop-blur-xl border-b border-slate-200/60 sticky top-0 z-30 px-8 items-center justify-between">
            <div className="flex items-center gap-4">
               <h2 className="text-xl font-display font-bold text-slate-800 capitalize">
                 {activeTab.replace('-', ' ')}
               </h2>
               <div className="h-6 w-[1px] bg-slate-200"></div>
               <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">MBG National Platform</span>
            </div>
            <button onClick={onLogout} className="p-2 text-slate-400 hover:text-rose-500"><LogOut size={20}/></button>
         </header>

         <main className="flex-1 p-4 md:p-8 overflow-y-auto pb-24 md:pb-8">
            <div className="max-w-7xl mx-auto">
               {children}
            </div>
         </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-100 flex justify-around items-center h-20 z-50 px-2 pb-2 shadow-[0_-4px_16px_rgba(0,0,0,0.05)]">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`flex flex-col items-center justify-center w-16 h-14 rounded-2xl transition-all ${
              activeTab === item.id 
                ? 'text-blue-600 bg-blue-50' 
                : 'text-slate-400'
            }`}
          >
            <item.icon size={22} className={activeTab === item.id ? 'scale-110' : ''} />
            <span className="text-[10px] font-bold mt-1 uppercase tracking-tighter">{item.label}</span>
          </button>
        ))}
        <button onClick={onLogout} className="flex flex-col items-center justify-center w-16 h-14 text-rose-400">
           <LogOut size={22} />
           <span className="text-[10px] font-bold mt-1 uppercase tracking-tighter">Keluar</span>
        </button>
      </nav>
    </div>
  );
};

export default Layout;
