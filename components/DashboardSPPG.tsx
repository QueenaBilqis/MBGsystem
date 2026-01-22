import React, { useState, useEffect, useRef } from 'react';
import { MOCK_INGREDIENTS, MOCK_DELIVERIES, MOCK_MENU } from '../constants';
import { Truck, AlertTriangle, Clock, MapPin, CheckCircle, Camera, Play, Pause, Vote, Plus, Trash, Check } from 'lucide-react';
import L from 'leaflet';

const DashboardSPPG = ({ activeTab, globalPolls, onUpdatePolls }) => {
  const [isDelivering, setIsDelivering] = useState(false);
  const [deliveryTimer, setDeliveryTimer] = useState(0);
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markerRef = useRef(null);

  // Poll State (Local editing state before publish)
  const [localPolls, setLocalPolls] = useState(globalPolls || []);
  const [newOption, setNewOption] = useState('');
  const [isPublished, setIsPublished] = useState(false);

  useEffect(() => {
    // Sync local with global on mount or global update
    if (globalPolls) {
      setLocalPolls(globalPolls);
    }
  }, [globalPolls]);

  // Leaflet Map Initialization
  useEffect(() => {
    if (activeTab === 'distribution' && mapRef.current && !mapInstanceRef.current) {
        // Init Map
        const map = L.map(mapRef.current).setView([-6.2088, 106.8456], 13); // Jakarta Coordinates
        
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);

        // School Marker (Static)
        const schoolIcon = L.divIcon({
            className: 'custom-div-icon',
            html: `<div style="background-color: white; border: 2px solid #ef4444; border-radius: 50%; padding: 5px; width: 30px; height: 30px; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 6px rgba(0,0,0,0.1);"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ef4444" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg></div>`,
            iconSize: [30, 30],
            iconAnchor: [15, 30]
        });
        
        L.marker([-6.2088, 106.8456], { icon: schoolIcon }).addTo(map).bindPopup("<b>SDN 01 Jakarta</b><br>Tujuan Pengiriman");

        // Truck Marker (Dynamic)
        const truckIcon = L.divIcon({
            className: 'custom-div-icon',
            html: `<div style="background-color: #0f172a; border-radius: 50%; padding: 6px; width: 36px; height: 36px; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 10px rgba(0,0,0,0.3);"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="1" y="3" width="15" height="13"></rect><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon><circle cx="5.5" cy="18.5" r="2.5"></circle><circle cx="18.5" cy="18.5" r="2.5"></circle></svg></div>`,
            iconSize: [36, 36],
            iconAnchor: [18, 18]
        });

        markerRef.current = L.marker([-6.2200, 106.8200], { icon: truckIcon }).addTo(map).bindPopup("<b>Driver #1</b><br>Membawa 200 Porsi");

        mapInstanceRef.current = map;
    }

    // Cleanup on unmount or tab change
    return () => {
        if (activeTab !== 'distribution' && mapInstanceRef.current) {
            mapInstanceRef.current.remove();
            mapInstanceRef.current = null;
        }
    };
  }, [activeTab]);

  // Delivery Animation Logic
  useEffect(() => {
    let interval;
    if (isDelivering) {
      interval = setInterval(() => {
        setDeliveryTimer(prev => prev + 1);
        
        // Move marker logic if map exists
        if (markerRef.current && mapInstanceRef.current) {
            const currentLatLng = markerRef.current.getLatLng();
            // Simple movement simulation towards destination
            const destLat = -6.2088;
            const destLng = 106.8456;
            
            const newLat = currentLatLng.lat + (destLat - currentLatLng.lat) * 0.05;
            const newLng = currentLatLng.lng + (destLng - currentLatLng.lng) * 0.05;
            
            markerRef.current.setLatLng([newLat, newLng]);
        }

      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isDelivering]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const addPollOption = () => {
    if (newOption.trim()) {
      const newPoll = { 
        id: Date.now(), 
        name: newOption, 
        description: 'Menu baru', 
        img: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=500&auto=format&fit=crop', // Default image for new items
        votes: 0 
      };
      setLocalPolls([...localPolls, newPoll]);
      setNewOption('');
      setIsPublished(false); // Reset published state on change
    }
  };

  const removePollOption = (id) => {
    setLocalPolls(localPolls.filter(o => o.id !== id));
    setIsPublished(false);
  };

  const handlePublish = () => {
    onUpdatePolls(localPolls);
    setIsPublished(true);
    // Hide success message after 3 seconds
    setTimeout(() => setIsPublished(false), 3000);
  };
  
  if (activeTab === 'polling') {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-primary">Buat Polling Menu Minggu Depan</h2>
        
        {isPublished && (
          <div className="bg-emerald-100 border border-emerald-200 text-emerald-800 p-4 rounded-xl flex items-center gap-3 animate-pop">
             <div className="bg-emerald-200 p-1 rounded-full"><Check size={16} /></div>
             <span className="font-bold">Berhasil! Polling telah diterbitkan ke dashboard siswa.</span>
          </div>
        )}

        <div className="bg-white p-6 rounded-2xl shadow-lg border border-blue-50">
           <p className="text-slate-500 mb-6">Siswa akan memilih menu favorit mereka dari opsi yang Anda buat di sini. Opsi ini akan muncul di Dashboard Siswa secara real-time.</p>
           
           <div className="flex gap-3 mb-6">
              <input 
                type="text" 
                value={newOption}
                onChange={(e) => setNewOption(e.target.value)}
                className="flex-1 p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-primary outline-none"
                placeholder="Masukkan nama menu (contoh: Gado-gado Jakarta)..."
              />
              <button 
                onClick={addPollOption}
                className="bg-primary text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-800 flex items-center gap-2"
              >
                <Plus size={20} /> Tambah
              </button>
           </div>

           <div className="space-y-3">
              {localPolls.map((opt, idx) => (
                <div key={opt.id} className="flex justify-between items-center p-4 bg-slate-50 rounded-xl border border-slate-100">
                   <div className="flex items-center gap-4">
                      <img src={opt.img} alt={opt.name} className="w-12 h-12 rounded-lg object-cover shadow-sm" />
                      <div>
                        <p className="font-bold text-slate-800">{opt.name}</p>
                        <p className="text-xs text-slate-500">{opt.description || 'Menu pilihan'}</p>
                        <p className="text-xs text-blue-600 font-bold mt-1">Saat ini: {opt.votes} suara</p>
                      </div>
                   </div>
                   <button onClick={() => removePollOption(opt.id)} className="text-red-500 hover:bg-red-50 p-2 rounded-lg transition-colors">
                      <Trash size={18} />
                   </button>
                </div>
              ))}
              {localPolls.length === 0 && (
                <div className="text-center py-8 text-slate-400 border-2 border-dashed border-slate-200 rounded-xl">
                   Belum ada opsi menu. Tambahkan sekarang.
                </div>
              )}
           </div>

           <div className="mt-8 pt-6 border-t border-slate-100 flex justify-end">
              <button 
                onClick={handlePublish}
                className="bg-emerald-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-emerald-700 shadow-lg shadow-emerald-200 flex items-center gap-2 transform active:scale-95 transition-all"
              >
                 <Vote size={18} /> Terbitkan Polling
              </button>
           </div>
        </div>
      </div>
    );
  }

  if (activeTab === 'inventory') {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-primary">Manajemen Bahan Baku & Kadaluarsa</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
           {MOCK_INGREDIENTS.map((item) => (
             <div key={item.id} className={`p-5 rounded-2xl border-l-[6px] shadow-md bg-white flex justify-between items-center hover:shadow-lg transition-shadow ${
               item.status === 'Critical' ? 'border-red-500' : 
               item.status === 'Warning' ? 'border-amber-500' : 'border-emerald-500'
             }`}>
               <div>
                 <h3 className="font-bold text-lg text-slate-800">{item.name}</h3>
                 <p className="text-sm text-slate-500 font-medium">Stok: {item.quantity} {item.unit}</p>
                 <p className="text-xs mt-2 bg-slate-100 inline-block px-2 py-1 rounded text-slate-600">
                   Exp: <span className="font-mono font-bold">{item.expiryDate}</span>
                 </p>
               </div>
               <div className="text-right">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${
                    item.status === 'Critical' ? 'bg-red-100 text-red-700' :
                    item.status === 'Warning' ? 'bg-amber-100 text-amber-700' :
                    'bg-emerald-100 text-emerald-700'
                  }`}>
                    {item.status === 'Critical' ? 'EXPIRED SOON' : item.status}
                  </span>
               </div>
             </div>
           ))}
        </div>
      </div>
    );
  }

  if (activeTab === 'distribution') {
     return (
       <div className="space-y-6">
         <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-primary">Tracking Distribusi Real-Time</h2>
            
            {/* Start Delivery Feature */}
            <div className="flex items-center gap-4 bg-white p-2 pr-6 rounded-full shadow-md">
               <button 
                 onClick={() => setIsDelivering(!isDelivering)}
                 className={`flex items-center gap-2 px-6 py-2 rounded-full font-bold text-white transition-all ${
                   isDelivering ? 'bg-red-500 hover:bg-red-600' : 'bg-primary hover:bg-blue-800'
                 }`}
               >
                 {isDelivering ? <Pause size={18} /> : <Play size={18} />}
                 {isDelivering ? 'Hentikan' : 'Mulai Kirim'}
               </button>
               {isDelivering && (
                 <div className="flex flex-col">
                    <span className="text-xs text-slate-500 font-bold uppercase">Durasi</span>
                    <span className="text-xl font-mono font-bold text-primary animate-pulse">{formatTime(deliveryTimer)}</span>
                 </div>
               )}
            </div>
         </div>

         <div className="bg-white p-6 rounded-2xl shadow-lg border border-blue-50">
            {/* Functional Leaflet Map */}
            <div className="h-[400px] w-full rounded-xl overflow-hidden shadow-inner border border-slate-200 relative z-0">
               <div id="map" ref={mapRef} className="h-full w-full"></div>
            </div>
            
            <div className="mt-4 flex gap-4 text-xs text-slate-500 font-medium">
               <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-slate-900 border border-slate-600"></div> Driver
               </div>
               <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-white border-2 border-red-500"></div> Tujuan (Sekolah)
               </div>
            </div>

            <div className="space-y-4 mt-6">
              {MOCK_DELIVERIES.map((d) => (
                <div key={d.id} className="flex flex-col md:flex-row justify-between items-center p-5 border border-slate-100 rounded-xl hover:bg-blue-50 transition bg-slate-50">
                   <div className="flex items-center gap-4 mb-2 md:mb-0">
                      <div className="bg-blue-100 p-3 rounded-full text-primary">
                        <Truck size={20} />
                      </div>
                      <div>
                        <p className="font-bold text-slate-800">{d.schoolName}</p>
                        <p className="text-sm text-slate-500">Driver: {d.driverName}</p>
                      </div>
                   </div>
                   <div className="flex items-center gap-8">
                      <div className="text-right">
                        <p className="text-[10px] text-slate-400 font-bold uppercase">Status</p>
                        <p className={`font-bold ${d.status === 'Delivered' ? 'text-emerald-600' : 'text-primary'}`}>{isDelivering && d.id === 'd1' ? 'Sedang Jalan...' : d.status}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] text-slate-400 font-bold uppercase">ETA</p>
                        <p className="font-mono font-bold text-slate-800">{isDelivering && d.id === 'd1' ? '5 min' : d.eta}</p>
                      </div>
                   </div>
                </div>
              ))}
            </div>
         </div>
       </div>
     )
  }

  return (
    <div className="space-y-8">
      {/* Workflow Tracker */}
      <div className="bg-white p-8 rounded-2xl shadow-lg border border-blue-50">
        <h3 className="text-lg font-bold mb-8 text-primary flex items-center gap-2">
           <Clock size={20} /> Workflow Harian: {MOCK_MENU.date}
        </h3>
        <div className="relative">
          <div className="absolute top-1/2 left-0 w-full h-1 bg-slate-100 -translate-y-1/2 z-0 rounded-full"></div>
          <div className="relative z-10 flex justify-between">
            {['Pemasakan', 'Packaging', 'Distribusi', 'Diterima'].map((step, idx) => (
              <div key={step} className="flex flex-col items-center bg-white px-2">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center border-4 shadow-sm transition-all ${
                  idx < 2 ? 'bg-primary border-primary text-white scale-110' : 'bg-white border-slate-200 text-slate-300'
                }`}>
                  {idx < 2 ? <CheckCircle size={24} /> : <span className="text-lg font-bold">{idx + 1}</span>}
                </div>
                <span className={`text-xs mt-3 font-bold uppercase tracking-wide ${idx < 2 ? 'text-primary' : 'text-slate-400'}`}>{step}</span>
              </div>
            ))}
          </div>
        </div>
        
        {/* Upload Proof Action */}
        <div className="mt-10 p-6 bg-slate-50 rounded-xl border-2 border-dashed border-blue-200 flex flex-col items-center justify-center text-center hover:bg-blue-50 transition-colors cursor-pointer group">
           <div className="bg-white p-3 rounded-full mb-3 shadow-md group-hover:scale-110 transition-transform">
              <Camera className="text-primary" size={32} />
           </div>
           <p className="text-base font-bold text-slate-700 mb-1">Bukti Foto Real-Time</p>
           <p className="text-xs text-slate-500 mb-4">Wajib foto langsung (Fitur galeri dimatikan)</p>
           <button className="bg-primary text-white px-6 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-blue-800 shadow-lg shadow-blue-200">
             <Camera size={16} /> Ambil Foto Tahap Packaging
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-lg border border-blue-50">
          <h3 className="font-bold mb-4 text-primary">Menu Hari Ini</h3>
          <div className="flex gap-4">
            <img src={MOCK_MENU.image} alt={MOCK_MENU.name} className="w-28 h-28 object-cover rounded-xl shadow-md" />
            <div>
              <p className="font-bold text-lg text-slate-800 leading-tight">{MOCK_MENU.name}</p>
              <p className="text-sm text-slate-500 mt-2 line-clamp-2">{MOCK_MENU.description}</p>
              <div className="mt-3 flex gap-2">
                 <span className="text-xs bg-amber-100 text-amber-700 px-2 py-1 rounded font-bold">Cal: {MOCK_MENU.calories}</span>
                 <span className="text-xs bg-blue-100 text-primary px-2 py-1 rounded font-bold">Prot: {MOCK_MENU.protein}g</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-2xl shadow-lg border border-blue-50">
           <h3 className="font-bold mb-4 text-primary">Anggaran Terserap</h3>
           <div className="w-full bg-slate-100 rounded-full h-6 mb-4 inner-shadow">
             <div className="bg-gradient-to-r from-blue-400 to-primary h-6 rounded-full relative" style={{ width: '65%' }}>
                <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] text-white font-bold">65%</span>
             </div>
           </div>
           <div className="flex justify-between text-sm">
              <div className="text-center">
                 <p className="text-slate-400 text-xs font-bold uppercase">Terpakai</p>
                 <p className="font-bold text-lg text-slate-800">Rp 650jt</p>
              </div>
              <div className="text-center">
                 <p className="text-slate-400 text-xs font-bold uppercase">Total Pagu</p>
                 <p className="font-bold text-lg text-primary">Rp 1 Milyar</p>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardSPPG;