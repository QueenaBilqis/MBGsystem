
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
        L.marker([delivery.destLat, delivery.destLng]).addTo(map).bindPopup("SDN Kauman 1");
        
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
    }
  }, [deliveryProgress, isDelivering]);

  const startCamera = async (type) => {
    setIsCapturing(type);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      setTimeout(() => { if (videoRef.current) videoRef.current.srcObject = stream; }, 200);
    } catch (err) { alert("Izin kamera ditolak. Berikan akses di pengaturan browser."); setIsCapturing(null); }
  };

  const takePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;
    const context = canvasRef.current.getContext('2d');
    context.drawImage(videoRef.current, 0, 0, 640, 480);
    setPhotos(prev => ({ ...prev, [isCapturing]: canvasRef.current.toDataURL('image/jpeg') }));
    closeCamera();
  };

  const closeCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) videoRef.current.srcObject.getTracks().forEach(t => t.stop());
    setIsCapturing(null);
  };

  const handleCreatePoll = () => {
    if (!pollName || !pollImg) return alert("Isi nama menu dan link gambar.");
    const newPoll = { id: Date.now(), name: pollName, img: pollImg, votes: 0, desc: 'Menu rekomendasi unit SPPG' };
    onUpdatePolls([newPoll, ...globalPolls]);
    setPollName(''); setPollImg('');
    alert("Polling berhasil dipublikasikan!");
  };

  if (activeTab === 'dashboard') {
    return (
      <div className="space-y-6 animate-fade-in pb-10">
        {isCapturing && (
          <div className="fixed inset-0 z-[110] bg-black flex flex-col items-center justify-between p-6">
             <button onClick={closeCamera} className="self-end p-3 text-white"><X size={32}/></button>
             <div className="relative w-full aspect-[3/4] rounded-3xl overflow-hidden border-2 border-white/20">
                <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
             </div>
             <canvas ref={canvasRef} width="640" height="480" className="hidden" />
             <button onClick={takePhoto} className="w-20 h-20 bg-white rounded-full border-8 border-slate-300 flex items-center justify-center shadow-2xl active:scale-90 mb-10">
                <div className="w-12 h-12 bg-slate-900 rounded-full"></div>
             </button>
          </div>
        )}

        <div className="bg-white p-6 rounded-[2.5rem] shadow-xl border border-blue-50">
           <h3 className="text-xl font-bold mb-6 flex items-center gap-3"><FileText className="text-blue-500" /> Realisasi Harian</h3>
           <div className="space-y-5">
              <input value={reportTitle} onChange={e => setReportTitle(e.target.value)} className="w-full p-4 border rounded-2xl bg-slate-50 focus:bg-white outline-none" placeholder="Judul Laporan (Cth: Distribusi SD Kauman)" />
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                 <button onClick={() => startCamera('cooking')} className={`p-4 border-2 border-dashed rounded-3xl flex flex-col items-center gap-2 transition-all ${photos.cooking ? 'border-emerald-500 bg-emerald-50' : 'border-slate-200'}`}>
                    {photos.cooking ? <img src={photos.cooking} className="w-10 h-10 rounded-lg object-cover" /> : <Camera size={24} className="text-slate-300" />}
                    <span className="text-[9px] font-bold uppercase">{photos.cooking ? 'Foto OK' : 'Ambil Foto Masak'}</span>
                 </button>
                 <button onClick={() => startCamera('packing')} className={`p-4 border-2 border-dashed rounded-3xl flex flex-col items-center gap-2 transition-all ${photos.packing ? 'border-emerald-500 bg-emerald-50' : 'border-slate-200'}`}>
                    {photos.packing ? <img src={photos.packing} className="w-10 h-10 rounded-lg object-cover" /> : <Camera size={24} className="text-slate-300" />}
                    <span className="text-[9px] font-bold uppercase">{photos.packing ? 'Foto OK' : 'Ambil Foto Packing'}</span>
                 </button>
                 <label className="p-4 border-2 border-dashed rounded-3xl flex flex-col items-center justify-center gap-2 cursor-pointer col-span-2 md:col-span-1">
                    <FileText className={reportFile ? 'text-blue-500' : 'text-slate-300'} size={24} />
                    <span className="text-[9px] font-bold uppercase text-center">{reportFile ? reportFile : 'Upload PDF'}</span>
                    <input type="file" className="hidden" accept=".pdf" onChange={e => setReportFile(e.target.files[0]?.name)} />
                 </label>
              </div>
              <button disabled={!photos.cooking || !photos.packing || !reportFile || !reportTitle} onClick={() => { 
                onSendReport({ id: Date.now(), title: reportTitle, status: 'Pending', sender: 'SPPG Malang', date: 'Hari Ini', attachments: { cookingPhoto: photos.cooking, packingPhoto: photos.packing }}); 
                setPhotos({cooking: null, packing: null}); setReportFile(null); setReportTitle('');
                alert("Laporan Terkirim!"); 
              }} className="w-full bg-slate-900 text-white py-4 rounded-2xl font-bold hover:bg-blue-600 disabled:opacity-40">Kirim Ke Pusat</button>
           </div>
        </div>

        <div className="space-y-4">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-4">Status Laporan</h4>
            {reports.map(r => (
                <div key={r.id} className="bg-white p-5 rounded-3xl border border-slate-100 flex justify-between items-center shadow-sm">
                    <div>
                        <p className="font-bold text-slate-800 text-sm">{r.title}</p>
                        <p className="text-[10px] text-slate-400 font-bold uppercase">{r.date}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-[9px] font-bold uppercase ${r.status === 'Approved' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                        {r.status}
                    </span>
                </div>
            ))}
        </div>
      </div>
    );
  }

  if (activeTab === 'polling') {
    return (
      <div className="space-y-6 animate-slide-up pb-10">
         <div className="bg-white p-6 rounded-[2.5rem] shadow-xl border border-indigo-50">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-3 text-indigo-900"><Vote className="text-indigo-500" /> Buat Polling Menu</h3>
            <div className="space-y-4">
               <input value={pollName} onChange={e => setPollName(e.target.value)} className="w-full p-4 border rounded-2xl bg-slate-50 outline-none" placeholder="Nama Menu (Cth: Ayam Bakar Madu)" />
               <input value={pollImg} onChange={e => setPollImg(e.target.value)} className="w-full p-4 border rounded-2xl bg-slate-50 outline-none" placeholder="Link Gambar (https://...)" />
               <button onClick={handleCreatePoll} className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-bold shadow-lg shadow-indigo-100">Publikasikan Ke Siswa</button>
            </div>
         </div>
         <div className="space-y-4">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-4">Polling Aktif</h4>
            {globalPolls.map(poll => (
                <div key={poll.id} className="bg-white p-4 rounded-3xl border border-slate-100 flex items-center justify-between">
                   <div className="flex items-center gap-3">
                      <img src={poll.img} className="w-12 h-12 rounded-xl object-cover" />
                      <div>
                         <p className="font-bold text-sm text-slate-800">{poll.name}</p>
                         <p className="text-xs text-indigo-600 font-bold">{poll.votes} Suara</p>
                      </div>
                   </div>
                   <button onClick={() => onUpdatePolls(globalPolls.filter(p => p.id !== poll.id))} className="text-rose-400 p-2"><Trash2 size={18}/></button>
                </div>
            ))}
         </div>
      </div>
    );
  }

  if (activeTab === 'inventory') {
    return (
      <div className="space-y-4 animate-slide-up pb-10">
         <h2 className="text-xl font-bold text-slate-800 px-2 flex items-center gap-3"><Utensils className="text-emerald-500" /> Bahan Baku</h2>
         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {MOCK_INGREDIENTS.map(item => (
                <div key={item.id} className="bg-white p-5 rounded-[2rem] shadow-md border border-slate-50 relative overflow-hidden">
                    <div className={`absolute top-0 right-0 p-2 rounded-bl-xl ${item.status === 'Safe' ? 'bg-emerald-500' : 'bg-rose-500'} text-white`}>
                        {item.status === 'Safe' ? <CheckCircle size={12} /> : <AlertTriangle size={12} />}
                    </div>
                    <h4 className="text-lg font-bold text-slate-800 mb-1">{item.name}</h4>
                    <div className="flex justify-between items-end">
                       <p className="text-xl font-bold text-slate-900">{item.quantity} <span className="text-xs font-medium text-slate-400">{item.unit}</span></p>
                       <p className="text-[10px] font-bold text-slate-400">Exp: {item.expiryDate}</p>
                    </div>
                </div>
            ))}
         </div>
      </div>
    );
  }

  if (activeTab === 'distribution') {
    return (
      <div className="space-y-6 animate-fade-in pb-10">
         <div className="flex flex-col gap-3 px-2">
            <h2 className="text-xl font-bold text-slate-800">Live Tracking</h2>
            {!isDelivering ? (
              <button onClick={() => setIsDelivering(true)} className="bg-blue-600 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg"><Play size={20} /> Mulai Pengiriman</button>
            ) : (
              <div className="bg-emerald-100 text-emerald-700 py-4 rounded-2xl font-bold flex items-center justify-center gap-2 animate-pulse border border-emerald-200">Berjalan: {deliveryProgress}%</div>
            )}
         </div>
         <div className="bg-white p-3 rounded-[2.5rem] shadow-xl border border-blue-50">
              <div ref={mapRef} className="h-[350px] w-full rounded-[2rem] overflow-hidden"></div>
         </div>
      </div>
    );
  }

  return <div className="p-20 text-center"><RefreshCw className="animate-spin text-blue-500 mx-auto" size={32}/><p className="mt-4 text-slate-400 italic">Memuat Data...</p></div>;
};

export default DashboardSPPG;
