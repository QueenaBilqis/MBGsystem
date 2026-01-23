import React, { useState, useEffect, useRef } from 'react';
import { MOCK_DELIVERIES, MOCK_INGREDIENTS, MOCK_STATS } from '../constants';
import { Truck, Camera, FileText, Send, Check, Play, CheckCircle, Plus, Image as ImageIcon, XCircle, Clock, Utensils, Vote, X, Trash2, AlertTriangle, RefreshCw } from 'lucide-react';
import L from 'leaflet';

const DashboardSPPG = ({ activeTab, globalPolls, reports, onUpdatePolls, onSendReport, isDelivering, setIsDelivering, deliveryProgress }) => {
  const [photos, setPhotos] = useState({ cooking: null, packing: null });
  const [reportFile, setReportFile] = useState(null);
  const [reportTitle, setReportTitle] = useState('');
  const [isCapturing, setIsCapturing] = useState(null);
  const [pollName, setPollName] = useState('');
  const [pollImg, setPollImg] = useState('');

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const truckMarkerRef = useRef(null);

  useEffect(() => {
    if (activeTab === 'distribution' && mapRef.current) {
        if (mapInstance.current) mapInstance.current.remove();
        const map = L.map(mapRef.current).setView([-7.9666, 112.6326], 13);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);
        
        const delivery = MOCK_DELIVERIES[0];
        
        const truckIcon = L.divIcon({
            className: 'truck-mini-icon',
            html: `<div style="background: #2563eb; color: white; padding: 5px; border-radius: 6px; border: 2px solid white;"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><rect x="1" y="3" width="15" height="13"></rect><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon><circle cx="5.5" cy="18.5" r="2.5"></circle><circle cx="18.5" cy="18.5" r="2.5"></circle></svg></div>`,
            iconSize: [28, 28]
        });

        L.marker([delivery.originLat, delivery.originLng]).addTo(map).bindPopup("Unit SPPG Malang");
        L.marker([delivery.destLat, delivery.destLng]).addTo(map).bindPopup(`<b>${delivery.schoolName}</b> (Tujuan)`);
        
        L.polyline([[delivery.originLat, delivery.originLng], [delivery.destLat, delivery.destLng]], {
            color: '#3b82f6', weight: 4, dashArray: '8, 12', opacity: 0.4
        }).addTo(map);

        truckMarkerRef.current = L.marker([delivery.originLat, delivery.originLng], { icon: truckIcon }).addTo(map);
        mapInstance.current = map;
    }
  }, [activeTab]);

  useEffect(() => {
    if (isDelivering && truckMarkerRef.current && mapInstance.current) {
        const delivery = MOCK_DELIVERIES[0];
        const lat = delivery.originLat + (delivery.destLat - delivery.originLat) * (deliveryProgress / 100);
        const lng = delivery.originLng + (delivery.destLng - delivery.originLng) * (deliveryProgress / 100);
        truckMarkerRef.current.setLatLng([lat, lng]);
        if (deliveryProgress % 10 === 0) mapInstance.current.panTo([lat, lng]);
    }
  }, [deliveryProgress, isDelivering]);

  const handleAddPoll = (e) => {
    e.preventDefault();
    if(!pollName || !pollImg) return alert("Lengkapi data polling!");
    onUpdatePolls([...globalPolls, { id: Date.now(), name: pollName, votes: 0, img: pollImg, desc: 'Menu pilihan baru unit SPPG.' }]);
    setPollName(''); setPollImg('');
    alert("Polling Berhasil Ditambahkan!");
  };

  const startCamera = async (type) => {
    setIsCapturing(type);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      setTimeout(() => {
        if (videoRef.current) videoRef.current.srcObject = stream;
      }, 100);
    } catch (err) { 
      alert("Gagal mengakses kamera. Pastikan izin diberikan."); 
      setIsCapturing(null); 
    }
  };

  const takePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;
    const context = canvasRef.current.getContext('2d');
    context.drawImage(videoRef.current, 0, 0, 640, 480);
    const dataUrl = canvasRef.current.toDataURL('image/jpeg');
    setPhotos(prev => ({ ...prev, [isCapturing]: dataUrl }));
    closeCamera();
  };

  const closeCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      videoRef.current.srcObject.getTracks().forEach(t => t.stop());
    }
    setIsCapturing(null);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setReportFile(file.name);
    }
  };

  if (activeTab === 'dashboard') {
    return (
      <div className="space-y-8 pb-20 animate-fade-in">
        {isCapturing && (
          <div className="fixed inset-0 z-[110] bg-black flex flex-col items-center justify-center p-4">
             <div className="relative w-full max-w-lg aspect-[4/3] bg-slate-900 rounded-3xl overflow-hidden border-4 border-white/20">
                <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
                <div className="absolute inset-0 border-[20px] border-black/10 pointer-events-none flex items-center justify-center">
                   <div className="w-full h-[2px] bg-blue-500/50 shadow-[0_0_15px_rgba(59,130,246,0.5)]"></div>
                </div>
             </div>
             <canvas ref={canvasRef} width="640" height="480" className="hidden" />
             <div className="flex gap-6 mt-10">
                <button onClick={closeCamera} className="p-5 bg-white/10 text-white rounded-full hover:bg-white/20 transition-all"><X size={32} /></button>
                <button onClick={takePhoto} className="w-20 h-20 bg-white rounded-full border-8 border-slate-300 flex items-center justify-center shadow-2xl active:scale-90 transition-all">
                   <div className="w-12 h-12 bg-slate-900 rounded-full"></div>
                </button>
                <div className="p-5 opacity-0"><X size={32} /></div>
             </div>
          </div>
        )}

        <div className="bg-white p-10 rounded-[2.5rem] shadow-xl border border-blue-50">
           <div className="flex justify-between items-center mb-8">
              <h3 className="text-xl font-bold flex items-center gap-3"><FileText className="text-blue-500" /> Kirim Realisasi Harian</h3>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-slate-50 px-3 py-1 rounded-lg">ID UNIT: SPPG-MLG-01</span>
           </div>
           <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Judul Laporan</label>
                <input value={reportTitle} onChange={e => setReportTitle(e.target.value)} className="w-full p-4 border rounded-2xl bg-slate-50 focus:bg-white focus:border-blue-500 outline-none transition-all font-medium" placeholder="Cth: Laporan Distribusi Gizi 12 November" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                 <button onClick={() => startCamera('cooking')} className={`p-6 border-2 border-dashed rounded-3xl flex flex-col items-center gap-3 transition-all ${photos.cooking ? 'border-emerald-500 bg-emerald-50' : 'border-slate-200 hover:border-blue-300 hover:bg-blue-50'}`}>
                    {photos.cooking ? <img src={photos.cooking} className="w-12 h-12 rounded-lg object-cover" /> : <Camera className="text-slate-300" size={32} />}
                    <span className={`text-[10px] font-bold uppercase ${photos.cooking ? 'text-emerald-600' : 'text-slate-400'}`}>{photos.cooking ? 'Foto Masak OK' : 'Ambil Foto Masak'}</span>
                 </button>
                 <button onClick={() => startCamera('packing')} className={`p-6 border-2 border-dashed rounded-3xl flex flex-col items-center gap-3 transition-all ${photos.packing ? 'border-emerald-500 bg-emerald-50' : 'border-slate-200 hover:border-blue-300 hover:bg-blue-50'}`}>
                    {photos.packing ? <img src={photos.packing} className="w-12 h-12 rounded-lg object-cover" /> : <Camera className="text-slate-300" size={32} />}
                    <span className={`text-[10px] font-bold uppercase ${photos.packing ? 'text-emerald-600' : 'text-slate-400'}`}>{photos.packing ? 'Foto Packing OK' : 'Ambil Foto Packing'}</span>
                 </button>
                 <label className={`p-6 border-2 border-dashed rounded-3xl flex flex-col items-center justify-center gap-3 cursor-pointer transition-all ${reportFile ? 'border-blue-500 bg-blue-50' : 'border-slate-200 hover:border-blue-300 hover:bg-blue-50'}`}>
                    <FileText className={reportFile ? 'text-blue-500' : 'text-slate-300'} size={32} />
                    <span className={`text-[10px] font-bold uppercase text-center ${reportFile ? 'text-blue-600' : 'text-slate-400'}`}>{reportFile ? reportFile : 'Upload PDF Laporan'}</span>
                    <input type="file" accept=".pdf" className="hidden" onChange={handleFileChange} />
                 </label>
              </div>
              <button 
                disabled={!photos.cooking || !photos.packing || !reportFile || !reportTitle} 
                onClick={() => { 
                  onSendReport({ id: `R-${Date.now()}`, title: reportTitle, status: 'Pending', sender: 'SPPG Malang', date: 'Hari Ini', attachments: { cookingPhoto: photos.cooking, packingPhoto: photos.packing }});
                  setReportTitle(''); setPhotos({cooking:null, packing:null}); setReportFile(null);
                  alert("Laporan Berhasil Terkirim ke Badan Gizi Nasional!");
                }} 
                className="w-full bg-slate-900 text-white py-5 rounded-2xl font-bold text-lg hover:bg-blue-600 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-xl shadow-slate-200 active:scale-[0.98]"
              >
                Kirim Laporan Realisasi
              </button>
           </div>
        </div>

        <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-slate-100">
            <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-3"><Clock className="text-orange-500" /> Riwayat Status Laporan</h3>
            <div className="space-y-4">
                {reports.map(r => (
                    <div key={r.id} className="p-5 bg-slate-50 rounded-2xl border border-slate-100 flex justify-between items-center group hover:border-blue-200 transition-all">
                        <div className="flex items-center gap-4">
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${r.status === 'Approved' ? 'bg-emerald-100 text-emerald-600' : r.status === 'Rejected' ? 'bg-rose-100 text-rose-600' : 'bg-amber-100 text-amber-600'}`}>
                                <FileText size={20} />
                            </div>
                            <div>
                                <p className="font-bold text-slate-800">{r.title}</p>
                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{r.date}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <span className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${r.status === 'Approved' ? 'bg-emerald-100 text-emerald-700' : r.status === 'Rejected' ? 'bg-rose-100 text-rose-700' : 'bg-amber-100 text-amber-700'}`}>
                                {r.status}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
      </div>
    );
  }

  if (activeTab === 'inventory') {
    return (
      <div className="space-y-8 animate-slide-up pb-20">
         <div className="flex justify-between items-center px-2">
            <div>
               <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-3"><Utensils className="text-emerald-500" /> Stok Bahan Baku</h2>
               <p className="text-slate-500 text-sm mt-1">Monitoring ketersediaan logistik gizi unit SPPG.</p>
            </div>
         </div>
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {MOCK_INGREDIENTS.map(item => (
                <div key={item.id} className="bg-white p-6 rounded-[2rem] shadow-lg border border-slate-50 relative overflow-hidden group">
                    <div className={`absolute top-0 right-0 p-3 rounded-bl-2xl ${item.status === 'Safe' ? 'bg-emerald-500' : item.status === 'Warning' ? 'bg-amber-500' : 'bg-rose-500'} text-white`}>
                        {item.status === 'Safe' ? <CheckCircle size={14} /> : <AlertTriangle size={14} />}
                    </div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Nama Bahan</p>
                    <h4 className="text-xl font-bold text-slate-800 mb-4">{item.name}</h4>
                    <div className="flex justify-between items-end">
                       <div>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Kuantitas</p>
                          <p className="text-2xl font-display font-bold text-slate-900">{item.quantity} <span className="text-sm font-medium text-slate-400">{item.unit}</span></p>
                       </div>
                       <div className="text-right">
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Kadaluarsa</p>
                          <p className={`text-xs font-bold ${new Date(item.expiryDate) < new Date() ? 'text-rose-500' : 'text-slate-600'}`}>{item.expiryDate}</p>
                       </div>
                    </div>
                </div>
            ))}
         </div>
      </div>
    );
  }

  if (activeTab === 'polling') {
    return (
      <div className="space-y-8 animate-slide-up pb-20">
         <div className="bg-white p-10 rounded-[2.5rem] shadow-xl border border-blue-50">
            <h3 className="text-xl font-bold mb-8 flex items-center gap-3"><Vote className="text-indigo-600" /> Buat Polling Menu Baru</h3>
            <form onSubmit={handleAddPoll} className="space-y-6">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Nama Menu</label>
                    <input value={pollName} onChange={e => setPollName(e.target.value)} className="w-full p-4 border rounded-2xl bg-slate-50 outline-none focus:border-indigo-500 focus:bg-white transition-all font-medium" placeholder="Cth: Ayam Geprek Tanpa Tulang" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">URL Gambar Menu</label>
                    <input value={pollImg} onChange={e => setPollImg(e.target.value)} className="w-full p-4 border rounded-2xl bg-slate-50 outline-none focus:border-indigo-500 focus:bg-white transition-all font-medium" placeholder="https://images.unsplash.com/..." />
                  </div>
               </div>
               <button type="submit" className="bg-indigo-600 text-white px-10 py-4 rounded-2xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 flex items-center gap-3 active:scale-95">
                  <Plus size={20} /> Publikasikan Polling
               </button>
            </form>
         </div>
         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
               {globalPolls.map(poll => (
                  <div key={poll.id} className="bg-white rounded-[2rem] overflow-hidden shadow-lg border border-slate-50 group">
                     <div className="h-32 w-full overflow-hidden relative">
                        <img src={poll.img} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={poll.name} />
                        <div className="absolute inset-0 bg-black/20"></div>
                     </div>
                     <div className="p-6">
                        <h5 className="font-bold text-slate-800 mb-1">{poll.name}</h5>
                        <div className="flex justify-between items-center mt-4">
                           <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest bg-indigo-50 px-3 py-1 rounded-lg">{poll.votes} Suara</span>
                        </div>
                     </div>
                  </div>
               ))}
            </div>
      </div>
    );
  }

  if (activeTab === 'distribution') {
    return (
      <div className="space-y-8 animate-fade-in pb-20">
         <div className="flex justify-between items-center px-2">
            <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-3"><Truck className="text-blue-500" /> Live Tracking Logistik</h2>
            <div className="flex gap-4">
               {!isDelivering ? (
                 <button onClick={() => setIsDelivering(true)} className="bg-blue-600 text-white px-8 py-3 rounded-2xl font-bold flex items-center gap-2 active:scale-95 transition-all"><Play size={20} /> Mulai Pengiriman</button>
               ) : (
                 <div className="bg-emerald-100 text-emerald-700 px-8 py-3 rounded-2xl font-bold border border-emerald-200 flex items-center gap-2 animate-pulse"><CheckCircle size={20} /> Sedang Berjalan: {deliveryProgress}%</div>
               )}
            </div>
         </div>
         <div className="bg-white p-4 rounded-[2.5rem] shadow-2xl border border-blue-50 overflow-hidden">
              <div ref={mapRef} className="h-[500px] w-full rounded-[2rem] border shadow-inner"></div>
         </div>
      </div>
    );
  }

  return (
    <div className="p-20 text-center flex flex-col items-center gap-4">
        <RefreshCw className="text-blue-500 animate-spin" size={40} />
        <p className="text-slate-400 font-medium italic">Sinkronisasi Data Unit...</p>
    </div>
  );
};

export default DashboardSPPG;