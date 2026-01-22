import React, { useState } from 'react';
import { UserRole } from '../types';
import { 
  LayoutDashboard, 
  Utensils, 
  Truck, 
  ShieldAlert, 
  LogOut, 
  Users,
  FileText,
  QrCode,
  Vote,
  Bell,
  Search,
  Menu as MenuIcon,
  Home,
  Check,
  X,
  ShieldCheck,
  Lock
} from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  role: string;
  onLogout: () => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const Layout = ({ children, role, onLogout, activeTab, setActiveTab }: LayoutProps) => {
  const [showNotifications, setShowNotifications] = useState(false);

  // Mock Notification Data
  const notifications = [
    { id: 1, title: 'Pengiriman Tiba', message: 'Bahan baku ayam & sayur telah diterima di Gudang Utama.', time: '5m lalu', unread: true, type: 'info' },
    { id: 2, title: 'Peringatan Stok', message: 'Stok beras merah menipis (sisa 20kg). Segera restock.', time: '1j lalu', unread: true, type: 'alert' },
    { id: 3, title: 'Laporan Masuk', message: 'SDN 01 Jakarta mengirimkan laporan insiden.', time: '3j lalu', unread: false, type: 'warning' },
    { id: 4, title: 'Menu Disetujui', message: 'Menu minggu depan telah disetujui oleh Ahli Gizi.', time: '1h lalu', unread: false, type: 'success' },
  ];

  const getNavItems = (role: string) => {
    switch (role) {
      case UserRole.BGN:
        return [
          { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
          { id: 'compliance', label: 'Kepatuhan', icon: ShieldAlert },
          { id: 'reports', label: 'Laporan', icon: FileText },
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
          { id: 'dashboard', label: 'Siswa', icon: Users },
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

  const navItems = getNavItems(role);

  return (
    <div className="min-h-screen font-sans text-slate-800 flex flex-col md:flex-row">
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
             <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1.5">Portal Akses</p>
             <div className="flex items-center justify-between">
                <p className="text-sm font-bold text-white capitalize">{role.toLowerCase()}</p>
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

        <div className="p-6 border-t border-slate-800 space-y-4">
          <div className="bg-slate-900/50 p-3 rounded-xl border border-slate-800/50 flex items-center gap-3">
             <ShieldCheck size={16} className="text-emerald-500" />
             <div>
                <p className="text-[10px] text-slate-400 font-bold uppercase">Koneksi Aman</p>
                <p className="text-[9px] text-emerald-500">AES-256 Encrypted</p>
             </div>
          </div>

          <button 
            onClick={onLogout}
            className="flex items-center w-full px-4 py-3 text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 rounded-xl transition-colors font-medium text-sm group"
          >
            <LogOut size={20} className="mr-3 group-hover:-translate-x-1 transition-transform" />
            Keluar
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
         {/* Desktop Header */}
         <header className="hidden md:flex h-20 bg-white/80 backdrop-blur-xl border-b border-slate-200/60 sticky top-0 z-30 px-8 items-center justify-between shadow-sm">
            <h2 className="text-xl font-display font-bold text-slate-800 capitalize">{activeTab === 'profile' ? 'Profil Pengguna' : activeTab.replace('-', ' ')}</h2>
            <div className="flex items-center gap-6">
               <div className="relative group">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={18} />
                  <input type="text" placeholder="Cari data..." className="pl-10 pr-4 py-2.5 rounded-full bg-slate-100 text-sm focus:ring-2 focus:ring-blue-100 focus:bg-white outline-none w-64 border border-transparent focus:border-blue-200 transition-all" />
               </div>
               
               {/* Notification Dropdown */}
               <div className="relative">
                 <button 
                    onClick={() => setShowNotifications(!showNotifications)}
                    className={`relative p-2.5 rounded-full transition-all active:scale-95 ${showNotifications ? 'bg-blue-100 text-blue-600' : 'text-slate-500 hover:bg-slate-100'}`}
                 >
                    <Bell size={20} />
                    <span className="absolute top-2 right-2.5 w-2 h-2 bg-rose-500 rounded-full border-2 border-white"></span>
                 </button>

                 {showNotifications && (
                   <>
                     {/* Backdrop to close on click outside */}
                     <div className="fixed inset-0 z-40 cursor-default" onClick={() => setShowNotifications(false)}></div>
                     
                     {/* Dropdown Panel */}
                     <div className="absolute right-0 top-full mt-4 w-80 bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden z-50 animate-pop origin-top-right">
                        <div className="p-4 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
                            <h3 className="font-bold text-slate-800">Notifikasi</h3>
                            <button className="text-xs text-blue-600 font-bold hover:underline flex items-center gap-1">
                               <Check size={12} /> Tandai dibaca
                            </button>
                        </div>
                        <div className="max-h-[24rem] overflow-y-auto">
                            {notifications.map(n => (
                                <div key={n.id} className={`p-4 border-b border-slate-50 hover:bg-slate-50 transition-colors cursor-pointer group ${n.unread ? 'bg-blue-50/30' : ''}`}>
                                    <div className="flex justify-between items-start mb-1">
                                        <p className={`text-sm font-bold ${n.unread ? 'text-slate-800' : 'text-slate-500'}`}>{n.title}</p>
                                        <span className="text-[10px] text-slate-400 font-medium">{n.time}</span>
                                    </div>
                                    <p className="text-xs text-slate-500 leading-relaxed line-clamp-2 group-hover:text-slate-700">{n.message}</p>
                                </div>
                            ))}
                        </div>
                        <div className="p-3 text-center bg-slate-50 cursor-pointer hover:bg-slate-100 transition-colors border-t border-slate-100">
                            <p className="text-xs font-bold text-slate-500 hover:text-blue-600 transition-colors">Lihat Semua Notifikasi</p>
                        </div>
                     </div>
                   </>
                 )}
               </div>

               <button 
                onClick={() => setActiveTab('profile')}
                className="w-10 h-10 rounded-full bg-gradient-to-br from-slate-800 to-slate-900 text-white flex items-center justify-center font-bold text-sm shadow-md cursor-pointer hover:scale-105 transition-transform ring-2 ring-slate-100 overflow-hidden"
               >
                  {/* Mock Avatar */}
                  <img src={`https://ui-avatars.com/api/?name=${role}&background=0F172A&color=fff`} alt="Profile" />
               </button>
            </div>
         </header>

         {/* Mobile Header (Hidden for Student Role to give immersive feel) */}
         <div className={`md:hidden bg-white/80 backdrop-blur-md border-b border-slate-100 p-4 flex justify-between items-center sticky top-0 z-50 ${role === UserRole.STUDENT ? 'hidden' : ''}`}>
            <div className="flex items-center gap-2">
               <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center font-display font-bold text-white shadow-md">M</div>
               <h1 className="text-lg font-display font-bold text-slate-800">MBG</h1>
            </div>
            <button onClick={() => setActiveTab('profile')} className="w-8 h-8 rounded-full bg-slate-200 overflow-hidden">
                <img src={`https://ui-avatars.com/api/?name=${role}&background=random`} alt="Profile" />
            </button>
         </div>

         <main className="flex-1 p-4 md:p-8 overflow-y-auto pb-32 md:pb-8 relative">
            <div className="max-w-7xl mx-auto">
               {children}
            </div>
         </main>
      </div>

      {/* Mobile Bottom Floating Nav */}
      <div className="md:hidden fixed bottom-6 left-4 right-4 z-50">
        <div className="glass-nav rounded-[2rem] p-2 flex justify-around items-center shadow-float ring-1 ring-white/50">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`relative flex flex-col items-center justify-center w-14 h-14 rounded-full transition-all duration-300 ${
                  isActive ? 'text-white shadow-lg scale-110 -translate-y-2' : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                {/* Background Bubble for Active State */}
                <div className={`absolute inset-0 rounded-full transition-all duration-300 ${isActive ? 'bg-gradient-to-br from-blue-500 to-cyan-500 scale-100 opacity-100' : 'scale-0 opacity-0'}`}></div>
                
                <item.icon size={22} className="relative z-10" strokeWidth={isActive ? 2.5 : 2} />
                
                {/* Active Dot Indicator */}
                {!isActive && (
                   <span className="text-[9px] font-bold mt-0.5 opacity-0 scale-0 group-hover:opacity-100 group-hover:scale-100 transition-all">{item.label}</span>
                )}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  );
};

export default Layout;