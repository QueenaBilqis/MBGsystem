
import React, { useState, useRef, useEffect } from 'react';
import { MOCK_MENU, MOCK_HOSPITALS } from '../constants';

// Added CheckCircle to the lucide-react imports to fix "Cannot find name 'CheckCircle'" error
import { ThumbsUp, ThumbsDown, AlertCircle, Vote, Check, QrCode, ShieldAlert, Send, Flame, Skull, Thermometer, Camera, X, Phone, MapPin, ChevronRight, RefreshCw, CheckCircle } from 'lucide-react';

const DashboardStudent = ({ activeTab, pollOptions, onVote, onScan, isScanned }) => {
  const [vote, setVote] = useState(null);
  const [pollSelected, setPollSelected] = useState(null);
  const [pollSubmitted, setPollSubmitted] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [emergencyType, setEmergencyType] = useState(null);
  const [emergencyMsg, setEmergencyMsg] = useState('');
  const [isSent, setIsSent] = useState(false);

  const videoRef = useRef(null);

  useEffect(() => {
    let stream = null;
    const startVideo = async () => {
      try {
        const constraints = { 
          video: { 
            facingMode: 'environment',
            width: { ideal: 1280 },
            height: { ideal: 720 }
          } 
        };
        stream = await navigator.mediaDevices.getUserMedia(constraints);
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          // Penting untuk mobile: playsinline dan muted
          videoRef.current.setAttribute('playsinline', 'true');
          videoRef.current.muted = true;
          await videoRef.current.play();
        }
        
        // Simulasi deteksi QR sukses setelah 2.5 detik
        const timer = setTimeout(() => {
          onScan();
          setScanning(false);
          if (stream) {
            stream.getTracks().forEach(track => track.stop());
          }
        }, 2500);

        return () => clearTimeout(timer);
      } catch (err) {
        console.error("Camera access error:", err);
        alert("Gagal membuka kamera. Pastikan izin kamera aktif di browser Anda.");
        setScanning(false);
      }
    };

    if (activeTab === 'scan' && scanning && !isScanned) {
      startVideo();
    }

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [scanning, activeTab, isScanned, onScan]);

  if (activeTab === 'emergency') {
    return (
        <div className="space-y-6 animate-slide-up px-2 pb-10">
            <div className="bg-rose-600 rounded-[2.5rem] p-8 text-white shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-10"><ShieldAlert size={120}/></div>
                <h2 className="text-2xl font-bold mb-2 flex items-center gap-3 relative z-10">SOS Gizi <ShieldAlert /></h2>
                <p className="opacity-90 text-sm relative z-10">Gunakan fitur ini hanya untuk keadaan darurat medis atau keracunan makanan.</p>
            </div>

            <div className="bg-white p-6 rounded-[2.5rem] shadow-xl border border-slate-100">
                <div className="grid grid-cols-2 gap-3 mb-6">
                    {['sakit', 'alergi'].map(type => (
                        <button key={type} onClick={() => setEmergencyType(type)} className={`p-5 rounded-3xl border-2 transition-all flex flex-col items-center gap-3 ${emergencyType === type ? 'bg-rose-50 border-rose-600 text-rose-600' : 'bg-slate-50 border-transparent text-slate-400'}`}>
                            {type === 'sakit' ? <Thermometer size={32}/> : <Skull size={32}/>}
                            <span className="font-bold text-xs uppercase tracking-widest capitalize">{type}</span>
                        </button>
                    ))}
                </div>
                <textarea value={emergencyMsg} onChange={e => setEmergencyMsg(e.target.value)} className="w-full p-5 bg-slate-50 rounded-2xl min-h-[120px] outline-none mb-4 text-sm focus:bg-white focus:ring-2 focus:ring-rose-500 transition-all" placeholder="Jelaskan kondisi Anda... (Cth: Mual setelah makan, gatal-gatal)" />
                <button disabled={!emergencyType} onClick={() => { setIsSent(true); alert("Sinyal Darurat Terkirim! Petugas kesehatan sekolah akan segera menemui Anda."); }} className="w-full bg-rose-600 text-white py-5 rounded-2xl font-bold text-lg active:scale-95 shadow-lg shadow-rose-200 flex items-center justify-center gap-3"><Send size={24} /> Kirim SOS Darurat</button>
            </div>

            <div className="space-y-4">
               <h4 className="text-sm font-bold text-slate-400 uppercase tracking-widest ml-4 flex items-center gap-2"><MapPin size={16} className="text-rose-500"/> Rumah Sakit Terdekat</h4>
               {MOCK_HOSPITALS.map(h => (
                  <div key={h.id} className="bg-white p-5 rounded-[2rem] border border-slate-100 flex items-center justify-between shadow-sm group">
                     <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-rose-50 text-rose-600 rounded-2xl flex items-center justify-center group-hover:bg-rose-600 group-hover:text-white transition-colors"><Phone size={24}/></div>
                        <div>
                           <p className="font-bold text-slate-800 text-sm">{h.name}</p>
                           <p className="text-[10px] text-slate-400 font-medium">{h.distance} • {h.phone}</p>
                        </div>
                     </div>
                     <ChevronRight size={20} className="text-slate-300" />
                  </div>
               ))}
            </div>
        </div>
    );
  }

  if (activeTab === 'scan') {
    return (
       <div className="flex flex-col items-center justify-center min-h-[70vh] animate-fade-in py-6">
          <h2 className="text-3xl font-bold text-slate-800 mb-2">Presensi Gizi</h2>
          <p className="text-slate-500 text-sm mb-10 text-center px-8">Arahkan kamera ke QR Code yang tersedia di titik distribusi sekolah.</p>
          
          <div className="relative w-full max-w-[320px] aspect-square p-2 bg-white rounded-[3.5rem] shadow-2xl">
             <div className="absolute inset-2 bg-slate-900 rounded-[3rem] overflow-hidden border-4 border-white flex items-center justify-center">
                {scanning && !isScanned ? (
                   <div className="relative w-full h-full">
                      <video ref={videoRef} autoPlay playsInline muted className="absolute inset-0 w-full h-full object-cover grayscale opacity-80"></video>
                      <div className="absolute inset-0 border-[30px] border-slate-900/50 flex items-center justify-center">
                          <div className="w-full h-1 bg-blue-500/80 shadow-[0_0_15px_blue] animate-bounce"></div>
                      </div>
                   </div>
                ) : isScanned ? (
                   <div className="absolute inset-0 flex flex-col items-center justify-center text-white z-40 bg-emerald-600 animate-pop">
                      <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mb-4"><Check size={48} strokeWidth={3} /></div>
                      <h3 className="text-2xl font-bold">Klaim Berhasil!</h3>
                      <p className="text-xs opacity-80 mt-1 uppercase font-bold tracking-widest">Porsi Terverifikasi</p>
                   </div>
                ) : (
                    <div className="flex flex-col items-center gap-4 text-white/20">
                       <QrCode size={100} />
                       <p className="text-[10px] font-bold uppercase tracking-[0.2em]">Ready to Scan</p>
                    </div>
                )}
             </div>
          </div>
          
          <div className="mt-14 w-full px-10">
             {!scanning && !isScanned ? (
                <button onClick={() => setScanning(true)} className="w-full py-5 bg-blue-600 text-white rounded-[2rem] font-bold text-lg shadow-xl shadow-blue-200 flex items-center justify-center gap-3 active:scale-95 transition-all">
                   <Camera size={24} /> Mulai Scan QR
                </button>
             ) : scanning ? (
                <div className="flex flex-col items-center gap-3">
                   <RefreshCw className="animate-spin text-blue-500" size={32} />
                   <p className="text-blue-600 font-bold uppercase tracking-widest text-xs">Mendeteksi QR Gizi...</p>
                </div>
             ) : (
                <div className="text-center">
                   <span className="inline-flex items-center gap-2 text-emerald-600 font-bold bg-emerald-50 px-8 py-3 rounded-full border border-emerald-100">
                      <CheckCircle size={18} /> Status: Sudah Makan
                   </span>
                </div>
             )}
          </div>
       </div>
    );
  }

  if (activeTab === 'vote') {
    return (
      <div className="space-y-6 animate-slide-up px-2 pb-10">
        <div className="bg-indigo-600 rounded-[2.5rem] p-8 text-white shadow-xl relative overflow-hidden">
           <div className="absolute top-0 right-0 p-8 opacity-10"><Vote size={120}/></div>
           <h2 className="text-2xl font-bold mb-1 relative z-10">Vote Menu 🗳️</h2>
           <p className="opacity-90 text-sm relative z-10">Tentukan menu favoritmu untuk pekan depan.</p>
        </div>

        {pollSubmitted ? (
          <div className="bg-white p-10 rounded-[3rem] shadow-xl text-center animate-pop">
             <div className="w-20 h-20 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6"><Check size={40} strokeWidth={3}/></div>
             <h3 className="text-2xl font-bold mb-8 text-slate-800">Suara Anda Masuk!</h3>
             <div className="space-y-4">
                {pollOptions.map(opt => (
                    <div key={opt.id} className="p-5 bg-slate-50 rounded-3xl flex justify-between items-center border border-slate-100">
                        <p className="text-sm font-bold text-slate-800">{opt.name}</p>
                        <span className="text-sm font-bold text-indigo-600 bg-indigo-50 px-4 py-1.5 rounded-xl">{opt.votes}</span>
                    </div>
                ))}
             </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5">
             {pollOptions.map((option) => (
                <div key={option.id} onClick={() => setPollSelected(option.id)} className={`bg-white rounded-[2.5rem] overflow-hidden border-2 transition-all active:scale-[0.98] ${pollSelected === option.id ? 'border-indigo-500 shadow-xl ring-8 ring-indigo-50' : 'border-transparent shadow-md'}`}>
                   <div className="h-40 w-full overflow-hidden relative">
                      <img src={option.img} className="w-full h-full object-cover" />
                      {pollSelected === option.id && (
                        <div className="absolute inset-0 bg-indigo-600/40 flex items-center justify-center backdrop-blur-[2px] animate-fade-in">
                          <div className="bg-white text-indigo-600 p-3 rounded-full shadow-2xl"><Check size={32} strokeWidth={4} /></div>
                        </div>
                      )}
                   </div>
                   <div className="p-5 flex justify-between items-center">
                      <h4 className="font-bold text-slate-800">{option.name}</h4>
                      <ChevronRight size={20} className="text-slate-300" />
                   </div>
                </div>
             ))}
             <button disabled={!pollSelected} onClick={() => { onVote(pollSelected); setPollSubmitted(true); }} className="w-full bg-slate-900 text-white py-5 rounded-[2.5rem] font-bold text-lg active:scale-95 disabled:opacity-40 shadow-xl shadow-slate-200 mt-4 transition-all hover:bg-indigo-600">Konfirmasi Vote Menu</button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in pb-10">
      <div className="relative h-[24rem] mx-2 rounded-[3.5rem] overflow-hidden shadow-2xl ring-8 ring-white">
         <img src={MOCK_MENU.image} className="w-full h-full object-cover" />
         <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/10 to-transparent"></div>
         <div className="absolute bottom-0 p-10 text-white w-full">
            <span className="text-[10px] font-bold uppercase tracking-[0.3em] bg-blue-600/80 backdrop-blur-md px-4 py-1.5 rounded-full mb-3 inline-block">Menu Gizi Hari Ini</span>
            <h2 className="text-3xl font-bold mb-4 leading-tight">{MOCK_MENU.name}</h2>
            <div className="flex gap-4">
               <div className="bg-white/10 backdrop-blur-xl px-5 py-2.5 rounded-2xl border border-white/20">
                  <p className="text-[8px] font-bold uppercase opacity-60">Energi</p>
                  <p className="font-bold text-lg">{MOCK_MENU.calories} <span className="text-xs font-normal">kkal</span></p>
               </div>
               <div className="bg-white/10 backdrop-blur-xl px-5 py-2.5 rounded-2xl border border-white/20">
                  <p className="text-[8px] font-bold uppercase opacity-60">Protein</p>
                  <p className="font-bold text-lg">{MOCK_MENU.protein} <span className="text-xs font-normal">gr</span></p>
               </div>
            </div>
         </div>
      </div>

      <div className="bg-white mx-2 p-8 rounded-[3rem] shadow-sm text-center border border-slate-50">
         <h3 className="font-bold text-slate-800 mb-8 uppercase tracking-widest text-xs">Ulasan Menu Hari Ini</h3>
         <div className="flex justify-center gap-8">
            <button onClick={() => setVote('up')} className={`w-24 h-24 rounded-[2.5rem] flex flex-col items-center justify-center gap-3 transition-all ${vote === 'up' ? 'bg-emerald-500 text-white shadow-xl scale-110 shadow-emerald-200' : 'bg-slate-50 text-slate-400 hover:bg-emerald-50'}`}>
               <ThumbsUp size={36} />
               <span className="font-bold text-[10px] uppercase">Enak</span>
            </button>
            <button onClick={() => setVote('down')} className={`w-24 h-24 rounded-[2.5rem] flex flex-col items-center justify-center gap-3 transition-all ${vote === 'down' ? 'bg-rose-500 text-white shadow-xl scale-110 shadow-rose-200' : 'bg-slate-50 text-slate-400 hover:bg-rose-50'}`}>
               <ThumbsDown size={36} />
               <span className="font-bold text-[10px] uppercase">Kurang</span>
            </button>
         </div>
      </div>
    </div>
  );
};

export default DashboardStudent;
