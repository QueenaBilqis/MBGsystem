import React, { useState } from 'react';
import { MOCK_MENU } from '../constants';
import { Phone, ThumbsUp, ThumbsDown, Camera, MapPin, AlertCircle, Vote, Check, Utensils, Zap, Activity, ChevronRight, Star } from 'lucide-react';

const DashboardStudent = ({ activeTab, pollOptions, onVote }) => {
  const [vote, setVote] = useState(null); // 'up' | 'down'
  
  // Polling Menu Minggu Depan State
  const [pollSelected, setPollSelected] = useState(null);
  const [pollSubmitted, setPollSubmitted] = useState(false);

  const handleSubmitVote = () => {
    onVote(pollSelected);
    setPollSubmitted(true);
  };

  // SCANNER VIEW
  if (activeTab === 'scan') {
    return (
       <div className="flex flex-col items-center justify-center min-h-[75vh] relative">
          <div className="absolute top-0 left-0 w-full h-full bg-slate-900/5 backdrop-blur-sm -z-10 rounded-3xl"></div>
          
          <div className="relative w-full max-w-sm mx-auto p-4">
             {/* Viewfinder UI */}
             <div className="aspect-[3/4] bg-black rounded-[2rem] relative overflow-hidden shadow-2xl border-4 border-slate-800">
                <div className="absolute inset-0 opacity-70 bg-[url('https://images.unsplash.com/photo-1596495578065-6e0763fa1178?q=80&w=1000&auto=format&fit=crop')] bg-cover"></div>
                
                {/* HUD Elements */}
                <div className="absolute top-6 left-0 right-0 flex justify-center">
                   <span className="bg-black/50 backdrop-blur text-white text-xs px-3 py-1 rounded-full font-mono border border-white/20">SCANNING...</span>
                </div>
                
                <div className="absolute inset-0 flex items-center justify-center">
                   <div className="w-64 h-64 border-2 border-white/50 rounded-2xl relative">
                      <div className="absolute top-0 left-0 w-6 h-6 border-t-4 border-l-4 border-accent rounded-tl-lg"></div>
                      <div className="absolute top-0 right-0 w-6 h-6 border-t-4 border-r-4 border-accent rounded-tr-lg"></div>
                      <div className="absolute bottom-0 left-0 w-6 h-6 border-b-4 border-l-4 border-accent rounded-bl-lg"></div>
                      <div className="absolute bottom-0 right-0 w-6 h-6 border-b-4 border-r-4 border-accent rounded-br-lg"></div>
                      <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-accent/50 animate-pulse-slow"></div>
                   </div>
                </div>

                <div className="absolute bottom-8 left-0 right-0 text-center px-6">
                   <p className="text-white text-sm font-medium drop-shadow-md">Arahkan kamera ke QR Code petugas sekolah</p>
                </div>
             </div>

             <div className="mt-8 flex justify-center">
                <button className="bg-white p-4 rounded-full shadow-lg shadow-blue-500/20 active:scale-90 transition-transform">
                   <div className="w-16 h-16 rounded-full border-4 border-secondary flex items-center justify-center bg-secondary/10">
                      <div className="w-12 h-12 bg-secondary rounded-full"></div>
                   </div>
                </button>
             </div>
          </div>
       </div>
    );
  }

  // VOTING VIEW
  if (activeTab === 'vote') {
    return (
      <div className="space-y-6 pb-20">
        <div className="bg-gradient-to-br from-indigo-600 to-purple-600 rounded-3xl p-8 text-white shadow-lg relative overflow-hidden">
           <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
           <div className="absolute -left-10 bottom-0 w-32 h-32 bg-purple-400/20 rounded-full blur-2xl"></div>
           
           <div className="relative z-10">
              <span className="bg-white/20 backdrop-blur px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-3 inline-block">Minggu Depan</span>
              <h2 className="text-3xl font-display font-bold mb-2">Suaramu, Menumu! 🗳️</h2>
              <p className="text-indigo-100 opacity-90">Pilih menu favorit untuk makan siang minggu depan.</p>
           </div>
        </div>

        {pollSubmitted ? (
          <div className="bg-white p-8 rounded-3xl shadow-float border border-slate-100 animate-pop">
             <div className="text-center mb-6">
               <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
                  <Check size={40} strokeWidth={3} />
               </div>
               <h3 className="text-2xl font-bold text-slate-800 mb-2">Pilihan Tersimpan!</h3>
               <p className="text-slate-500">Berikut hasil sementara voting siswa:</p>
             </div>
             
             <div className="space-y-4">
               {pollOptions.map(option => {
                 const totalVotes = pollOptions.reduce((acc, curr) => acc + curr.votes, 0);
                 const percentage = totalVotes > 0 ? Math.round((option.votes / totalVotes) * 100) : 0;
                 return (
                   <div key={option.id} className="relative">
                      <div className="flex justify-between text-sm font-bold mb-1">
                        <span className="text-slate-700">{option.name}</span>
                        <span className="text-indigo-600">{percentage}%</span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                        <div 
                          className={`h-full rounded-full transition-all duration-1000 ${option.id === pollSelected ? 'bg-indigo-500' : 'bg-slate-300'}`} 
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                   </div>
                 );
               })}
             </div>

             <div className="text-center mt-8">
               <button onClick={() => setPollSubmitted(false)} className="text-secondary font-bold hover:text-blue-700 transition">
                  Ubah Pilihan
               </button>
             </div>
          </div>
        ) : (
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
             {pollOptions && pollOptions.map((option) => (
                <div 
                  key={option.id}
                  onClick={() => setPollSelected(option.id)}
                  className={`group relative rounded-3xl overflow-hidden cursor-pointer transition-all duration-300 btn-press ${
                    pollSelected === option.id 
                    ? 'ring-4 ring-secondary ring-offset-2 shadow-xl scale-[1.02]' 
                    : 'shadow-md hover:shadow-lg bg-white'
                  }`}
                >
                   <div className="h-40 overflow-hidden relative">
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10"></div>
                      <img src={option.img} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" alt={option.name} />
                      {pollSelected === option.id && (
                         <div className="absolute top-3 right-3 z-20 bg-secondary text-white w-8 h-8 rounded-full flex items-center justify-center shadow-lg animate-pop">
                            <Check size={18} strokeWidth={3} />
                         </div>
                      )}
                   </div>
                   <div className="p-5 bg-white">
                      <h4 className={`font-bold text-lg mb-1 ${pollSelected === option.id ? 'text-secondary' : 'text-slate-800'}`}>{option.name}</h4>
                      <p className="text-slate-500 text-sm">{option.desc || 'Deskripsi menu'}</p>
                   </div>
                </div>
             ))}
             
             {pollOptions && pollOptions.length === 0 && (
                <div className="col-span-full p-8 text-center text-slate-400 bg-slate-50 rounded-3xl border border-slate-100">
                  Belum ada polling yang tersedia saat ini.
                </div>
             )}
             
             <div className="md:col-span-2 lg:col-span-3 mt-4">
                <button 
                  disabled={!pollSelected}
                  onClick={handleSubmitVote}
                  className="w-full bg-slate-900 text-white py-4 rounded-2xl font-bold text-lg hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed shadow-xl shadow-slate-900/20 transition-all btn-press flex items-center justify-center gap-2"
                >
                  <Vote size={20} />
                  Kirim Pilihan Saya
                </button>
             </div>
          </div>
        )}
      </div>
    );
  }

  // EMERGENCY VIEW
  if (activeTab === 'emergency') {
     return (
        <div className="space-y-6 pb-20">
           <div className="bg-red-500 rounded-3xl p-8 text-center shadow-lg relative overflow-hidden text-white">
              <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white/20 to-transparent opacity-50"></div>
              
              <div className="relative z-10">
                 <div className="bg-white/20 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 backdrop-blur-sm border border-white/30 animate-pulse">
                    <AlertCircle className="text-white h-12 w-12" />
                 </div>
                 <h2 className="text-3xl font-display font-bold mb-3">Darurat Kesehatan</h2>
                 <p className="text-red-100 mb-8 max-w-sm mx-auto font-medium text-lg leading-relaxed">
                    Hanya gunakan tombol ini jika kamu mengalami gejala serius setelah makan.
                 </p>
                 
                 <button className="w-full bg-white text-red-600 py-5 rounded-2xl font-bold text-xl shadow-xl hover:bg-red-50 transition btn-press flex justify-center items-center gap-3">
                    <Phone size={24} strokeWidth={2.5} /> HUBUNGI BANTUAN
                 </button>
                 
                 <div className="mt-6 flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-widest text-red-200">
                    <div className="w-2 h-2 bg-red-200 rounded-full animate-ping"></div>
                    GPS Aktif & Terpantau
                 </div>
              </div>
           </div>

           <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
              <h3 className="font-bold mb-4 flex items-center gap-2 text-slate-800"><MapPin size={20} className="text-slate-400" /> RS Terdekat</h3>
              <div className="space-y-3">
                 {[
                    { name: 'RSUD Kota', dist: '2.1 km', type: 'Rumah Sakit' },
                    { name: 'Klinik Sehat', dist: '0.5 km', type: 'Klinik 24 Jam' }
                 ].map((rs, i) => (
                    <div key={i} className="flex justify-between items-center p-4 bg-slate-50 rounded-2xl border border-slate-100">
                       <div className="flex items-center gap-4">
                          <div className="bg-white p-3 rounded-xl text-slate-400 shadow-sm">
                             <Activity size={20} />
                          </div>
                          <div>
                             <p className="font-bold text-slate-800">{rs.name}</p>
                             <p className="text-xs text-slate-500">{rs.type} • <span className="text-emerald-600 font-bold">{rs.dist}</span></p>
                          </div>
                       </div>
                       <button className="w-10 h-10 bg-green-100 text-green-600 rounded-full flex items-center justify-center hover:bg-green-200 transition">
                          <Phone size={18} />
                       </button>
                    </div>
                 ))}
              </div>
           </div>
        </div>
     );
  }

  // DEFAULT: MENU VIEW
  return (
    <div className="space-y-8 pb-24">
      {/* Header Greeting */}
      <div className="flex justify-between items-end px-2">
         <div>
            <p className="text-slate-500 text-sm font-medium mb-1">Selamat Siang,</p>
            <h1 className="text-3xl font-display font-bold text-slate-800">Budi Santoso 👋</h1>
         </div>
         <div className="bg-white px-3 py-1.5 rounded-full shadow-sm border border-slate-200 flex items-center gap-2">
            <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
            <span className="text-xs font-bold text-slate-600">Sesi Makan Aktif</span>
         </div>
      </div>

      {/* Hero Card */}
      <div className="relative h-[28rem] rounded-[2.5rem] overflow-hidden shadow-2xl group cursor-pointer transition-all duration-500 hover:shadow-glow">
         <img src={MOCK_MENU.image} alt={MOCK_MENU.name} className="w-full h-full object-cover transition duration-1000 group-hover:scale-105" />
         
         {/* Gradient Overlay */}
         <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent"></div>
         
         {/* Content */}
         <div className="absolute bottom-0 left-0 w-full p-8 text-white z-10">
            <div className="flex items-center gap-2 mb-4">
               <span className="bg-white/20 backdrop-blur-md border border-white/20 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                  <Utensils size={12} /> MENU HARI INI
               </span>
               <span className="bg-amber-500 px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                  ⭐ 4.8/5
               </span>
            </div>
            <h2 className="text-3xl lg:text-4xl font-display font-bold mb-3 leading-tight text-shadow">{MOCK_MENU.name}</h2>
            <p className="text-slate-200 text-sm lg:text-base opacity-90 line-clamp-2 mb-6 font-light leading-relaxed">{MOCK_MENU.description}</p>
            
            {/* Macro Pills */}
            <div className="flex gap-3">
               <div className="flex-1 bg-white/10 backdrop-blur-md rounded-2xl p-3 border border-white/10">
                  <div className="flex items-center gap-2 mb-1 text-amber-300">
                     <Zap size={14} />
                     <span className="text-[10px] font-bold uppercase tracking-wider">Energi</span>
                  </div>
                  <p className="text-xl font-bold">{MOCK_MENU.calories} <span className="text-xs font-normal opacity-70">kkal</span></p>
               </div>
               <div className="flex-1 bg-white/10 backdrop-blur-md rounded-2xl p-3 border border-white/10">
                  <div className="flex items-center gap-2 mb-1 text-blue-300">
                     <Activity size={14} />
                     <span className="text-[10px] font-bold uppercase tracking-wider">Protein</span>
                  </div>
                  <p className="text-xl font-bold">{MOCK_MENU.protein} <span className="text-xs font-normal opacity-70">g</span></p>
               </div>
            </div>
         </div>
      </div>

      {/* Allergen Alert */}
      {MOCK_MENU.allergens && (
         <div className="glass-panel p-5 rounded-2xl flex items-start gap-4 border-l-4 border-amber-500 shadow-sm">
            <div className="bg-amber-100 p-2 rounded-full text-amber-600">
               <AlertCircle size={20} />
            </div>
            <div>
               <p className="font-bold text-slate-800 text-sm uppercase tracking-wide mb-1">Info Alergen</p>
               <p className="text-slate-600 text-sm font-medium leading-relaxed">
                  Menu ini mengandung: <span className="text-amber-600 font-bold">{MOCK_MENU.allergens.join(', ')}</span>.
               </p>
            </div>
         </div>
      )}

      {/* Interactive Feedback */}
      <div className="bg-white p-8 rounded-[2rem] shadow-float border border-slate-100 relative overflow-hidden">
         <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-bl-[4rem] -z-10"></div>
         
         <div className="text-center mb-8">
            <h3 className="font-display font-bold text-xl text-slate-800">Gimana rasa makanannya?</h3>
            <p className="text-slate-400 text-sm mt-1">Bantu dapur kami jadi lebih baik!</p>
         </div>
         
         <div className="flex justify-center gap-6">
            <button 
               onClick={() => setVote('up')}
               className={`group relative w-32 h-32 rounded-3xl flex flex-col items-center justify-center gap-3 transition-all duration-300 btn-press ${
                  vote === 'up' 
                  ? 'bg-emerald-500 text-white shadow-xl shadow-emerald-200 scale-105' 
                  : 'bg-slate-50 text-slate-400 hover:bg-emerald-50 hover:text-emerald-500'
               }`}
            >
               <ThumbsUp size={36} className={`transition-transform duration-300 ${vote === 'up' ? 'scale-125 rotate-[-10deg]' : 'group-hover:scale-110'}`} />
               <span className="font-bold text-sm">Enak!</span>
               {vote === 'up' && <div className="absolute inset-0 border-2 border-white/30 rounded-3xl animate-pulse"></div>}
            </button>

            <button 
               onClick={() => setVote('down')}
               className={`group relative w-32 h-32 rounded-3xl flex flex-col items-center justify-center gap-3 transition-all duration-300 btn-press ${
                  vote === 'down' 
                  ? 'bg-rose-500 text-white shadow-xl shadow-rose-200 scale-105' 
                  : 'bg-slate-50 text-slate-400 hover:bg-rose-50 hover:text-rose-500'
               }`}
            >
               <ThumbsDown size={36} className={`transition-transform duration-300 ${vote === 'down' ? 'scale-125 rotate-[10deg]' : 'group-hover:scale-110'}`} />
               <span className="font-bold text-sm">Kurang</span>
            </button>
         </div>
      </div>
    </div>
  );
};

export default DashboardStudent;