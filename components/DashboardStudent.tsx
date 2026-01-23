import React, { useState, useRef, useEffect } from 'react';
import { MOCK_MENU } from '../constants';
import { ThumbsUp, ThumbsDown, AlertCircle, Vote, Check, QrCode, ShieldAlert, Send, Flame, Skull, Thermometer, Camera, X } from 'lucide-react';

const DashboardStudent = ({ activeTab, pollOptions, onVote, onScan, isScanned }) => {
  const [vote, setVote] = useState(null);
  const [pollSelected, setPollSelected] = useState(null);
  const [pollSubmitted, setPollSubmitted] = useState(false);
  const [scanning, setScanning] = useState(false);
  
  // Emergency states
  const [emergencyType, setEmergencyType] = useState(null);
  const [emergencyMsg, setEmergencyMsg] = useState('');
  const [isSent, setIsSent] = useState(false);

  const videoRef = useRef(null);

  useEffect(() => {
    let stream = null;
    if (activeTab === 'scan' && scanning && !isScanned) {
        const startVideo = async () => {
            try {
                stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
                if(videoRef.current) videoRef.current.srcObject = stream;
                
                // Real scan would use a library like jsQR or similar,
                // here we simulate detection after 3 seconds of showing the real feed.
                const scanTimer = setTimeout(() => {
                    if (stream) {
                        stream.getTracks().forEach(t => t.stop());
                    }
                    onScan();
                    setScanning(false);
                    alert("Presensi Gizi Berhasil Terverifikasi!");
                }, 3000);

                return () => clearTimeout(scanTimer);
            } catch (err) {
                console.error(err);
                alert("Mohon izinkan akses kamera untuk memindai kode QR absensi di meja distribusi.");
                setScanning(false);
            }
        };
        startVideo();
    }
    return () => { if(stream) stream.getTracks().forEach(t => t.stop()); };
  }, [scanning, activeTab, isScanned, onScan]);

  if (activeTab === 'emergency') {
    return (
        <div className="space-y-8 pb-32 animate-slide-up px-2">
            <div className="bg-rose-600 rounded-[2.5rem] p-8 text-white shadow-2xl relative overflow-hidden group">
                <div className="absolute -right-8 -top-8 text-white/10 rotate-12 group-hover:scale-110 transition-transform duration-700"><ShieldAlert size={160} /></div>
                <h2 className="text-3xl font-display font-bold mb-3">Pusat Bantuan Darurat</h2>
                <p className="opacity-90 max-w-sm font-medium">Laporkan segera jika ada kendala kesehatan atau kualitas makanan yang tidak layak.</p>
            </div>

            {isSent ? (
                <div className="bg-white p-12 rounded-[3rem] shadow-xl border border-emerald-100 text-center animate-pop">
                    <div className="w-20 h-20 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner"><Check size={40} /></div>
                    <h3 className="text-2xl font-bold text-slate-800 mb-2">Laporan Terkirim!</h3>
                    <p className="text-slate-500 mb-8 leading-relaxed">Pusat Monitor Gizi & Tim Medis sekolah telah menerima laporan Anda dan akan segera memberikan tindak lanjut.</p>
                    <button onClick={() => setIsSent(false)} className="bg-slate-900 text-white px-10 py-3 rounded-2xl font-bold active:scale-95 transition-all">Tutup</button>
                </div>
            ) : (
                <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-slate-100">
                    <h3 className="text-lg font-bold text-slate-800 mb-6 uppercase tracking-widest flex items-center gap-3"><ShieldAlert className="text-rose-500" /> Kategori Laporan Cepat</h3>
                    <div className="grid grid-cols-2 gap-4">
                        <button onClick={() => setEmergencyType('basi')} className={`p-6 rounded-3xl border-2 transition-all flex flex-col items-center gap-3 group ${emergencyType === 'basi' ? 'bg-rose-50 border-rose-600 text-rose-600 shadow-lg shadow-rose-100' : 'bg-slate-50 border-transparent text-slate-400 hover:bg-slate-100'}`}>
                            <Flame size={32} />
                            <span className="font-bold text-xs uppercase tracking-tighter">Makanan Basi</span>
                        </button>
                        <button onClick={() => setEmergencyType('sakit')} className={`p-6 rounded-3xl border-2 transition-all flex flex-col items-center gap-3 group ${emergencyType === 'sakit' ? 'bg-rose-50 border-rose-600 text-rose-600 shadow-lg shadow-rose-100' : 'bg-slate-50 border-transparent text-slate-400 hover:bg-slate-100'}`}>
                            <Thermometer size={32} />
                            <span className="font-bold text-xs uppercase tracking-tighter">Gejala Sakit</span>
                        </button>
                        <button onClick={() => setEmergencyType('alergi')} className={`p-6 rounded-3xl border-2 transition-all flex flex-col items-center gap-3 group ${emergencyType === 'alergi' ? 'bg-rose-50 border-rose-600 text-rose-600 shadow-lg shadow-rose-100' : 'bg-slate-50 border-transparent text-slate-400 hover:bg-slate-100'}`}>
                            <Skull size={32} />
                            <span className="font-bold text-xs uppercase tracking-tighter">Reaksi Alergi</span>
                        </button>
                        <button onClick={() => setEmergencyType('asing')} className={`p-6 rounded-3xl border-2 transition-all flex flex-col items-center gap-3 group ${emergencyType === 'asing' ? 'bg-rose-50 border-rose-600 text-rose-600 shadow-lg shadow-rose-100' : 'bg-slate-50 border-transparent text-slate-400 hover:bg-slate-100'}`}>
                            <AlertCircle size={32} />
                            <span className="font-bold text-xs uppercase tracking-tighter">Benda Asing</span>
                        </button>
                    </div>
                    <div className="mt-8 space-y-4">
                        <div className="space-y-1">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Keterangan Tambahan</label>
                            <textarea 
                                value={emergencyMsg} 
                                onChange={e => setEmergencyMsg(e.target.value)} 
                                className="w-full p-6 bg-slate-50 border border-slate-100 rounded-3xl min-h-[140px] outline-none focus:border-rose-500 transition-all font-medium" 
                                placeholder="Jelaskan detail kejadian agar kami dapat bertindak tepat..." 
                            />
                        </div>
                        <button 
                            disabled={!emergencyType}
                            onClick={() => { setIsSent(true); setEmergencyType(null); setEmergencyMsg(''); }} 
                            className="w-full bg-rose-600 text-white py-5 rounded-[2rem] font-bold text-lg shadow-xl shadow-rose-200 flex items-center justify-center gap-3 active:scale-95 transition-all hover:bg-rose-700 disabled:opacity-40"
                        >
                            <Send size={24} /> Kirim SOS / Laporan Darurat
                        </button>
                    </div>
                </div>
            )}
            
            <div className="p-6 bg-amber-50 border border-amber-200 rounded-3xl">
                <p className="text-xs text-amber-800 leading-relaxed font-medium">
                    <span className="font-bold">Catatan Keamanan:</span> Setiap laporan darurat yang dikirimkan akan mencatat identitas dan NIS Anda untuk proses verifikasi medis yang akurat.
                </p>
            </div>
        </div>
    );
  }

  if (activeTab === 'scan') {
    return (
       <div className="flex flex-col items-center justify-center min-h-[75vh] animate-fade-in pb-32">
          <div className="text-center mb-12">
             <h2 className="text-3xl font-display font-bold text-primary">Presensi Gizi Digital</h2>
             <p className="text-slate-500 mt-2 font-medium">Pindai kode QR untuk klaim porsi makan Anda.</p>
          </div>
          
          <div className="relative w-full max-w-sm mx-auto group">
             <div className="aspect-square bg-slate-900 rounded-[3.5rem] relative overflow-hidden shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] border-8 border-white flex items-center justify-center">
                {scanning && !isScanned ? (
                   <div className="absolute inset-0 w-full h-full">
                       <video ref={videoRef} autoPlay playsInline className="absolute inset-0 w-full h-full object-cover grayscale opacity-70"></video>
                       <div className="absolute top-0 left-0 right-0 h-1 bg-blue-500 shadow-[0_0_20px_rgba(59,130,246,1)] animate-scanner z-30"></div>
                   </div>
                ) : isScanned ? (
                   <div className="absolute inset-0 flex flex-col items-center justify-center text-white z-40 bg-emerald-600/95 backdrop-blur-md animate-pop p-8">
                      <div className="w-24 h-24 bg-white text-emerald-600 rounded-full flex items-center justify-center mb-6 shadow-2xl animate-bounce"><Check size={48} strokeWidth={4} /></div>
                      <h3 className="text-3xl font-bold text-center">Terklaim!</h3>
                      <p className="text-emerald-100 text-center font-medium mt-2">Porsi Anda telah tercatat sebagai hadir.</p>
                   </div>
                ) : (
                    <div className="absolute inset-0 flex flex-center items-center justify-center text-slate-800/20"><QrCode size={180} /></div>
                )}

                {!isScanned && (
                   <div className="w-64 h-64 border-4 border-white/20 rounded-[3rem] relative z-20 flex items-center justify-center">
                      <div className="absolute top-0 left-0 w-14 h-14 border-t-8 border-l-8 border-blue-500 rounded-tl-3xl"></div>
                      <div className="absolute top-0 right-0 w-14 h-14 border-t-8 border-r-8 border-blue-500 rounded-tr-3xl"></div>
                      <div className="absolute bottom-0 left-0 w-14 h-14 border-b-8 border-l-8 border-blue-500 rounded-bl-3xl"></div>
                      <div className="absolute bottom-0 right-0 w-14 h-14 border-b-8 border-r-8 border-blue-500 rounded-br-3xl"></div>
                      {!scanning && <QrCode size={80} className="text-white/20" />}
                   </div>
                )}
             </div>
             
             <div className="mt-14 flex flex-col items-center gap-4">
                {!scanning && !isScanned ? (
                   <button onClick={() => setScanning(true)} className="px-14 py-5 bg-blue-600 text-white rounded-[2.5rem] font-bold shadow-2xl shadow-blue-200 flex items-center gap-4 hover:bg-blue-700 active:scale-95 transition-all group">
                      <Camera size={26} className="group-hover:rotate-12 transition-transform" /> 
                      <span>Mulai Scan Presensi</span>
                   </button>
                ) : scanning ? (
                    <div className="flex flex-col items-center gap-3">
                        <div className="flex gap-2">
                             <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></div>
                             <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce delay-100"></div>
                             <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce delay-200"></div>
                        </div>
                        <p className="text-blue-600 font-bold uppercase tracking-widest text-xs">Mendeteksi QR Code...</p>
                    </div>
                ) : (
                    <div className="flex flex-col items-center gap-2">
                        <span className="text-emerald-600 font-bold text-sm bg-emerald-50 px-6 py-2 rounded-full border border-emerald-100 flex items-center gap-2"><Check size={14} /> Presensi Hari Ini Selesai</span>
                        <p className="text-slate-400 text-xs font-medium">Data klaim dikirim ke dashboard SPPG & Sekolah.</p>
                    </div>
                )}
             </div>
          </div>
          <style>{`
            @keyframes scanner {
              0% { top: 10%; opacity: 0.5; }
              50% { opacity: 1; }
              100% { top: 90%; opacity: 0.5; }
            }
            .animate-scanner { animation: scanner 2s ease-in-out infinite; }
          `}</style>
       </div>
    );
  }

  if (activeTab === 'vote') {
    return (
      <div className="space-y-6 pb-32 animate-slide-up px-2">
        <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-[2.5rem] p-10 text-white shadow-2xl relative overflow-hidden group">
           <div className="absolute -right-6 -bottom-6 text-white/10 group-hover:scale-125 transition-transform duration-1000"><Vote size={140} /></div>
           <h2 className="text-3xl font-display font-bold mb-3">Tentukan Menu! 🗳️</h2>
           <p className="opacity-90 leading-relaxed font-medium">Pilih menu favoritmu untuk sajian gizi pekan depan.</p>
        </div>

        {pollSubmitted ? (
          <div className="bg-white p-12 rounded-[3.5rem] shadow-xl border border-slate-100 text-center animate-pop">
             <div className="w-24 h-24 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner"><Check size={48} strokeWidth={3} /></div>
             <h3 className="text-3xl font-bold mb-3 text-slate-800">Voting Berhasil!</h3>
             <p className="text-slate-500 mb-10 font-medium">Pilihan Anda telah tercatat secara nasional. Sampai jumpa di hidangan pekan depan!</p>
             <div className="space-y-5 text-left max-w-sm mx-auto">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">Statistik Real-Time Voting</p>
                {pollOptions.map(opt => (
                    <div key={opt.id} className="relative p-5 bg-slate-50 rounded-2xl border border-slate-100">
                        <div className="flex justify-between items-center mb-2">
                            <p className="text-sm font-bold text-slate-800">{opt.name}</p>
                            <span className="text-xs font-bold text-indigo-600">{opt.votes} Suara</span>
                        </div>
                        <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden shadow-inner">
                            <div className="h-full bg-indigo-600 transition-all duration-1000" style={{ width: `${Math.min(100, (opt.votes / 200) * 100)}%` }}></div>
                        </div>
                    </div>
                ))}
             </div>
             <button onClick={() => setPollSubmitted(false)} className="mt-12 text-indigo-600 font-bold text-sm hover:underline">Ubah pilihan?</button>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
             {pollOptions.map((option) => (
                <div key={option.id} onClick={() => setPollSelected(option.id)} className={`group rounded-[2.5rem] overflow-hidden cursor-pointer border-4 transition-all duration-500 active:scale-[0.98] ${pollSelected === option.id ? 'border-indigo-500 shadow-2xl' : 'border-transparent bg-white shadow-lg'}`}>
                   <div className="h-48 w-full overflow-hidden relative">
                      <img src={option.img} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={option.name} />
                      {pollSelected === option.id && <div className="absolute inset-0 bg-indigo-600/20 flex items-center justify-center backdrop-blur-[2px]"><div className="bg-white text-indigo-600 p-3 rounded-full shadow-2xl animate-pop"><Check size={32} strokeWidth={4} /></div></div>}
                   </div>
                   <div className="p-8">
                      <h4 className="font-bold text-xl text-slate-800 mb-2">{option.name}</h4>
                      <p className="text-slate-500 text-sm leading-relaxed">{option.desc || 'Olahan bergizi tinggi khas Unit SPPG Malang.'}</p>
                   </div>
                </div>
             ))}
             <button 
                disabled={!pollSelected} 
                onClick={() => { onVote(pollSelected); setPollSubmitted(true); }} 
                className="md:col-span-2 w-full bg-slate-900 text-white py-6 rounded-[2.5rem] font-bold text-xl shadow-2xl shadow-slate-200 hover:bg-indigo-600 transition-all flex items-center justify-center gap-4 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed group"
             >
                <Vote size={28} className="group-hover:rotate-12 transition-transform" /> 
                Konfirmasi Pilihan Saya
             </button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-32 animate-fade-in">
      <div className="flex justify-between items-start px-4">
         <div>
            <p className="text-slate-500 text-sm font-bold uppercase tracking-widest mb-1 opacity-70">Identitas Siswa</p>
            <h1 className="text-3xl font-display font-bold text-slate-900 tracking-tight">SDN KAUMAN 1 MALANG</h1>
         </div>
         {isScanned && (
            <div className="bg-emerald-500 text-white px-6 py-2.5 rounded-full text-[10px] font-black tracking-widest uppercase shadow-lg shadow-emerald-200 flex items-center gap-2 animate-pop">
               <Check size={16} strokeWidth={4} /> TERKONFIRMASI
            </div>
         )}
      </div>

      <div className="relative h-[32rem] mx-2 rounded-[3.5rem] overflow-hidden shadow-2xl group animate-float">
         <img src={MOCK_MENU.image} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[2000ms]" alt={MOCK_MENU.name} />
         <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent"></div>
         <div className="absolute bottom-0 p-12 text-white w-full">
            <div className="flex items-center gap-3 mb-6">
                <span className="bg-amber-500 px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest shadow-xl flex items-center gap-2">
                    <Flame size={12} fill="currentColor" /> Menu Harian
                </span>
                <span className="bg-white/10 backdrop-blur-md px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest border border-white/20">
                    Gizi Seimbang
                </span>
            </div>
            <h2 className="text-5xl font-display font-bold mb-6 drop-shadow-2xl leading-tight">{MOCK_MENU.name}</h2>
            <div className="flex gap-6">
               <div className="bg-white/10 backdrop-blur-xl rounded-[2rem] p-6 border border-white/20 flex-1 group-hover:bg-white/20 transition-all">
                  <p className="text-[10px] font-black uppercase tracking-widest text-amber-400 mb-2">Nutrisi Kalori</p>
                  <p className="font-bold text-3xl">{MOCK_MENU.calories} <span className="text-sm font-medium opacity-60">kkal</span></p>
               </div>
               <div className="bg-white/10 backdrop-blur-xl rounded-[2rem] p-6 border border-white/20 flex-1 group-hover:bg-white/20 transition-all">
                  <p className="text-[10px] font-black uppercase tracking-widest text-cyan-400 mb-2">Nutrisi Protein</p>
                  <p className="font-bold text-3xl">{MOCK_MENU.protein} <span className="text-sm font-medium opacity-60">gram</span></p>
               </div>
            </div>
         </div>
      </div>

      <div className="bg-white mx-2 p-12 rounded-[3.5rem] shadow-float text-center border border-slate-50">
         <h3 className="font-display font-bold text-3xl text-slate-800 mb-10">Ulasan Makan Hari Ini</h3>
         <div className="flex justify-center gap-10">
            <button 
                onClick={() => setVote('up')} 
                className={`group w-40 h-40 rounded-[3rem] flex flex-col items-center justify-center gap-5 transition-all duration-300 shadow-2xl active:scale-90 ${vote === 'up' ? 'bg-emerald-500 text-white shadow-emerald-200' : 'bg-slate-50 text-slate-400 border-2 border-transparent hover:border-emerald-200'}`}
            >
               <ThumbsUp size={56} className={`${vote === 'up' ? 'animate-bounce' : ''}`} />
               <span className="font-black text-xs uppercase tracking-widest">Sangat Enak</span>
            </button>
            <button 
                onClick={() => setVote('down')} 
                className={`group w-40 h-40 rounded-[3rem] flex flex-col items-center justify-center gap-5 transition-all duration-300 shadow-2xl active:scale-90 ${vote === 'down' ? 'bg-rose-500 text-white shadow-rose-200' : 'bg-slate-50 text-slate-400 border-2 border-transparent hover:border-rose-200'}`}
            >
               <ThumbsDown size={56} className={`${vote === 'down' ? 'animate-bounce' : ''}`} />
               <span className="font-black text-xs uppercase tracking-widest">Kurang Cocok</span>
            </button>
         </div>
      </div>
    </div>
  );
};

export default DashboardStudent;